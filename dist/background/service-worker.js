// === AutoData Background Service Worker ===
(function() {
"use strict";
// background/service-worker.js - 后台服务脚本
// 负责：配置管理 + AI 分析

// 默认配置
const DEFAULT_CONFIG = {
  defaultLocale: 'zh_CN',
  autoFillDelay: 200,
  customMappings: {},
  showHighlights: true,
  // AI 配置
  aiEnabled: false,
  aiProvider: 'anthropic',
  aiBaseUrl: 'https://api.anthropic.com',
  apiKey: '',
  aiModel: 'claude-3-5-haiku-20240620',
};

// 各 provider 的默认 URL 和模型，供 callAI 回退使用
const PROVIDER_DEFAULTS = {
  anthropic: { baseUrl: 'https://api.anthropic.com', model: 'claude-3-5-haiku-20240620' },
  openai:    { baseUrl: 'https://api.openai.com',    model: 'gpt-4o-mini' },
};

async function getConfig() {
  const stored = await chrome.storage.local.get('config');
  return { ...DEFAULT_CONFIG, ...stored.config };
}

async function saveConfig(config) {
  await chrome.storage.local.set({ config });
  return config;
}

// AI 组合分析+数据生成系统提示词
// 同时完成：字段类型分析、关联关系识别、一致性测试数据生成
const FIELD_TYPES_SYSTEM_PROMPT = `<system>
你是一个表单测试数据生成助手。
【重要规则】
1. 直接输出JSON，不输出任何解释、思考过程、markdown代码块
2. JSON必须用<json></json>标签包裹
3. 所有key必须使用字段编号（field_0, field_1...），不能用语义名
4. data字段下的值必须是字符串
</system>

<data_types>
name,firstName,lastName,email,phone,address,city,province,country,zipcode,company,password,account,age,birthday,date,url,ip,idCard,gender,education,job,salary,amount,price,desc,select,checkbox,radio,bankCard,bankArea,bankName,bankBranch
</data_types>

<consistency_rules>
- 姓+名=姓名；性别与身份证17位奇偶一致；生日=身份证7-14位；年龄与出生年一致
- 省→市→区→地址→邮编层级对应
- 开户区域→银行名称→支行对应；银行卡BIN匹配
- 邮箱前缀与姓名关联
</consistency_rules>

<output_format>
{
  "field_0": {"type": "数据类型", "confidence": 0.95},
  "field_1": {"type": "数据类型", "confidence": 0.9},
  "groups": [
    {"name": "组名", "fields": ["field_0"], "rule": "规则"}
  ],
  "data": {
    "field_0": "值",
    "field_1": "值"
  }
}
</output_format>

<example>
输入字段：field_0: name="username", field_1: name="email", field_2: name="age"
<json>{"field_0":{"type":"name","confidence":0.95},"field_1":{"type":"email","confidence":0.95},"field_2":{"type":"age","confidence":0.9},"groups":[{"name":"账户","fields":["field_0","field_1"],"rule":"邮箱前缀与用户名关联"}],"data":{"field_0":"张三","field_1":"zhangsan@example.com","field_2":"28"}}</json>
</example>

【输出要求】
- 只输出<json>标签包裹的JSON
- 不要thinking、不要解释、不要markdown代码块
- 所有data值必须是字符串
- 严格使用field_0, field_1等作为key`;

// 根据扫描到的字段动态构建系统提示，包含字段上下文关联信息
function buildFieldContextPrompt(fields, locale = 'zh_CN') {
  // 列出所有字段key供AI参考
  const allKeys = fields.map(f => f.key).join(', ');

  const fieldDescriptions = fields.map(f => {
    const parts = [];
    if (f.label) parts.push(`标签="${f.label}"`);
    if (f.name) parts.push(`name="${f.name}"`);
    if (f.id) parts.push(`id="${f.id}"`);
    if (f.placeholder) parts.push(`占位符="${f.placeholder}"`);
    if (f.type) parts.push(`type="${f.type}"`);
    if (f.tagName) parts.push(`标签类型="${f.tagName}"`);
    return `${f.key}: ${parts.join(', ')}`;
  }).join('\n');

  const localeHint = locale === 'zh_CN' ? '中文' : locale === 'en_US' ? '英文' : '中英文混合';

  return `本表单共 ${fields.length} 个字段，字段编号为：${allKeys}

请完成：1)推断每个字段类型 2)识别关联分组 3)生成一致测试数据

语言环境：${localeHint}

字段列表：
${fieldDescriptions}`;
}

// 标准化用户输入的 base URL
// - 去掉尾部斜杠
// - 自动补全 https:// 协议（如果缺失）
// - 去掉常见的 API 端点后缀（/v1/messages、/v1/chat/completions 等）
function normalizeBaseUrl(rawUrl) {
  let url = (rawUrl || '').trim().replace(/\/+$/, '');
  // 自动补全 https:// 协议
  if (url && !/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  // 去掉常见的 API 端点路径，避免重复拼接
  url = url.replace(/\/v1\/(messages|chat\/completions|completions)$/i, '');
  url = url.replace(/\/v1$/i, '');
  return url;
}

// 统一入口：根据 provider 模式调用对应 API
async function callAI(prompt, config, systemPrompt = null) {
  const { aiProvider, aiBaseUrl, apiKey, aiModel } = config;
  // 根据 provider 获取默认值
  const provider = aiProvider || 'anthropic';
  const defaults = PROVIDER_DEFAULTS[provider] || PROVIDER_DEFAULTS.anthropic;
  // URL 和模型使用用户配置，配置为空时使用默认值
  const baseUrl = normalizeBaseUrl(aiBaseUrl) || defaults.baseUrl;
  const model = aiModel || defaults.model;
  const sys = systemPrompt || FIELD_TYPES_SYSTEM_PROMPT;

  console.log('[AutoData] callAI provider:', provider, 'url:', baseUrl, 'model:', model);

  if (provider === 'anthropic') {
    return await callAnthropicAPI(prompt, baseUrl, apiKey, model, sys);
  } else {
    return await callOpenAIAPI(prompt, baseUrl, apiKey, model, sys);
  }
}

async function callAnthropicAPI(prompt, baseUrl, apiKey, model, systemPrompt) {
  // Anthropic Messages API: {base}/v1/messages
  const url = `${baseUrl}/v1/messages`;
  console.log('[AutoData] Anthropic request:', url, 'model:', model);
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 20480,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ]
      })
    });
  } catch (networkErr) {
    throw new Error(`网络错误: ${networkErr.message}，请检查请求地址 ${url} 是否可访问`);
  }

  if (!response.ok) {
    let errMsg = response.statusText || `HTTP ${response.status}`;
    try {
      const errBody = await response.json();
      errMsg = errBody.error?.message || errBody.message || errMsg;
    } catch {}
    throw new Error(`API 错误 ${response.status}: ${errMsg}`);
  }

  const data = await response.json();
  // 遍历 content 数组，提取 text 类型的内容（跳过 thinking）
  for (const block of data.content) {
    if (block.type === 'text') {
      return block.text;
    }
  }
  return '';
}

async function callOpenAIAPI(prompt, baseUrl, apiKey, model, systemPrompt) {
  const url = `${baseUrl}/v1/chat/completions`;
  console.log('[AutoData] OpenAI request:', url, 'model:', model);
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 20480,
      })
    });
  } catch (networkErr) {
    throw new Error(`网络错误: ${networkErr.message}，请检查请求地址是否可访问`);
  }

  if (!response.ok) {
    let errMsg = response.statusText || `HTTP ${response.status}`;
    try {
      const errBody = await response.json();
      errMsg = errBody.error?.message || errBody.message || errMsg;
    } catch {}
    throw new Error(`API 错误 ${response.status}: ${errMsg}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function analyzeFieldsWithAI(fields, config, locale = 'zh_CN') {
  // 动态构建字段描述作为用户消息的一部分
  const fieldPrompt = buildFieldContextPrompt(fields, locale);
  // 用户请求说明
  const userPrompt = `请分析以上 ${fields.length} 个表单字段，返回类型推断、关联分组和一致的测试数据。`;

  // 关键：字段描述放在用户消息中，系统规则由 callAI 使用默认的 FIELD_TYPES_SYSTEM_PROMPT
  const combinedPrompt = `${fieldPrompt}\n\n${userPrompt}`;
  const text = await callAI(combinedPrompt, config, null);
  console.log('[AutoData] AI raw response:', text.substring(0, 500));

  // 智能提取JSON：按优先级尝试多种格式
  let jsonText = null;

  // 优先级1: <json>标签（最稳定）
  const xmlTagMatch = text.match(/<json[^>]*>([\s\S]*?)<\/json>/i);
  if (xmlTagMatch) {
    jsonText = xmlTagMatch[1].trim();
    console.log('[AutoData] Extracted JSON from <json> tag');
  }

  // 优先级2: markdown代码块
  if (!jsonText) {
    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
      console.log('[AutoData] Extracted JSON from code block');
    }
  }

  // 优先级3: 直接匹配JSON对象
  if (!jsonText) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
      console.log('[AutoData] Extracted JSON by direct match');
    }
  }

  if (!jsonText) {
    console.error('[AutoData] No JSON found in AI response');
    return null;
  }

  try {
    const result = JSON.parse(jsonText);

    // 建立字段名/label到field_key的映射，用于key不匹配时兜底
    const semanticToKey = {};
    for (const field of fields) {
      const aliases = [
        field.name, field.id, field.label, field.placeholder,
        field.name?.toLowerCase(), field.id?.toLowerCase(),
        field.label?.toLowerCase(), field.placeholder?.toLowerCase(),
      ].filter(Boolean);

      for (const alias of aliases) {
        semanticToKey[alias] = field.key;
        if (alias.includes('名') || alias.includes('姓')) semanticToKey[alias] = field.key;
      }
    }

    // 规范化返回格式
    // normalizedResult: field_key -> {type, confidence}  (popup 用 aiAnalysisResults)
    // normalizedData: field_key -> "value"  (popup 用 aiGeneratedData)
    const normalizedResult = {};
    const normalizedData = {};
    let hasFieldKeys = false; // 是否有 field_0 格式的 key

    for (const [key, value] of Object.entries(result)) {
      if (key === 'groups' || key === 'fields') {
        normalizedResult[key] = value;
      } else if (key === 'data') {
        // data 对象单独处理，映射其中的语义 key
        if (value && typeof value === 'object') {
          for (const [dk, dv] of Object.entries(value)) {
            const mapped = semanticToKey[dk] || semanticToKey[dk.toLowerCase()] || dk;
            if (mapped !== dk) console.log(`[AutoData] data key "${dk}" -> "${mapped}"`);
            normalizedData[mapped] = dv;
          }
        }
      } else {
        // 所有其他 key（类型推断或直接数据）
        const mappedKey = semanticToKey[key] || semanticToKey[key.toLowerCase()] || key;
        if (mappedKey.startsWith('field_')) hasFieldKeys = true;

        normalizedResult[mappedKey] = value;

        // 如果是简单值（非对象），也加入 normalizedData
        if (typeof value !== 'object') {
          normalizedData[mappedKey] = value;
        } else if (value && typeof value === 'object' && value.type) {
          // {type: "name", confidence: 0.9} 格式，跳过 data
        }
      }
    }

    // 如果 AI 没有返回 field_* 格式的 key，检查 normalizedData 是否为空
    // 此时所有数据可能在顶层语义 key 中，normalizedData 已通过上面的逻辑填充
    // 如果有 field_* 格式的 key，但 normalizedData 为空，说明数据在 result.data 中

    console.log('[AutoData] Normalized result keys:', Object.keys(normalizedResult));
    console.log('[AutoData] Normalized data keys:', Object.keys(normalizedData));

    return {
      ...normalizedResult,
      groups: result.groups || normalizedResult.groups || [],
      data: normalizedData,
    };
  } catch (parseError) {
    console.error('[AutoData] JSON parse error:', parseError.message, 'Text:', jsonText.substring(0, 200));
    return null;
  }
}

async function testAIConnection(config) {
  try {
    await callAI('请回复"OK"。', config);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handlers = {
    'get-config': async () => {
      const config = await getConfig();
      return { success: true, config };
    },

    'save-config': async (msg) => {
      const config = await saveConfig(msg.config);
      return { success: true, config };
    },

    'update-mappings': async (msg) => {
      const config = await getConfig();
      config.customMappings = { ...config.customMappings, ...msg.mappings };
      await saveConfig(config);
      return { success: true, config };
    },

    'delete-mapping': async (msg) => {
      const config = await getConfig();
      delete config.customMappings[msg.key];
      await saveConfig(config);
      return { success: true, config };
    },

    'reset-config': async () => {
      await saveConfig(DEFAULT_CONFIG);
      return { success: true, config: DEFAULT_CONFIG };
    },

    'save-ai-config': async (msg) => {
      const config = await getConfig();
      const savedConfig = { ...config, ...msg.config };
      await chrome.storage.local.set({ config: savedConfig });
      return { success: true, config: savedConfig };
    },

    'test-ai': async (msg) => {
      return await testAIConnection(msg.config);
    },

    'analyze-fields': async (msg) => {
      const config = await getConfig();
      try {
        // 传递 locale 参数以生成正确语言的数据
        const locale = msg.locale || 'zh_CN';
        const results = await analyzeFieldsWithAI(msg.fields, config, locale);
        return { success: true, results };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
  };

  const handler = handlers[message.action];
  if (handler) {
    Promise.resolve(handler(message))
      .then(sendResponse)
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
  return false;
});

chrome.runtime.onInstalled.addListener(async () => {
  const config = await getConfig();
  console.log('[AutoData] Extension installed, config:', config);
});

})();