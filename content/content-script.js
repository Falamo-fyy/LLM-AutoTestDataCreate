// content/content-script.js - 内容脚本
// 注入到网页中，负责扫描表单和执行填充

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 存储当前页面识别的字段
let currentFields = [];
let highlightsEnabled = false;

// 初始化
function init() {
  chrome.runtime.onMessage.addListener(handleMessage);

  // 页面变化时重新扫描
  const observer = new MutationObserver(debounce(() => {
    if (currentFields.length > 0) {
      refreshFields();
    }
  }, 500));
  observer.observe(document.body, { childList: true, subtree: true });

  console.log('[AutoData] Content script loaded');
}

// 消息处理
function handleMessage(message, sender, sendResponse) {
  const handlers = {
    'scan-fields': async () => {
      currentFields = self.scanFormElements();
      if (highlightsEnabled) highlightFields(currentFields);
      return {
        success: true,
        fields: serializeFields(currentFields),
        count: currentFields.length,
      };
    },

    'fill-field': async (msg) => {
      const { key, value } = msg;
      const field = currentFields.find(f => f.key === key);
      if (field) {
        const success = await self.fillField(field, value);
        return { success };
      }
      return { success: false, error: 'Field not found' };
    },

    'fill-all': async (msg) => {
      const { locale, customMappings } = msg;
      try {
        const results = await self.fillAllFields(currentFields, locale, customMappings || {});
        return { success: true, results };
      } catch (error) {
        console.error('[AutoData] Fill error:', error);
        return { success: false, error: error.message };
      }
    },

    'clear-all': async () => {
      try {
        const results = await self.clearAllFields(currentFields);
        return { success: true, results };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    'toggle-highlight': async (msg) => {
      highlightsEnabled = msg.enabled;
      if (highlightsEnabled) {
        highlightFields(currentFields);
      } else {
        removeHighlights();
      }
      return { success: true, enabled: highlightsEnabled };
    },

    'get-field-detail': async (msg) => {
      const field = currentFields.find(f => f.key === msg.key);
      if (field) {
        return { success: true, field: serializeField(field) };
      }
      return { success: false, error: 'Field not found' };
    },

    'fill-single': async (msg) => {
      const { key, type, locale } = msg;
      const field = currentFields.find(f => f.key === key);
      if (field) {
        const value = self.generateData(type, locale);
        const success = await self.fillField(field, value);
        return { success, value };
      }
      return { success: false, error: 'Field not found' };
    },

    'fill-with-types': async (msg) => {
      const { locale, typeOverrides, customMappings, aiResults, aiData, aiGroups } = msg;
      try {
        const results = [];
        for (const field of currentFields) {
          let value;
          let usedType = field.inferredType;

          // 0. 优先使用 AI 预生成的数据（保持一致性）
          if (aiData && aiData[field.key] !== undefined && !(typeOverrides && typeOverrides[field.key])) {
            value = aiData[field.key];
            usedType = aiResults?.[field.key]?.type || field.inferredType;
          }
          // 1. 先检查用户指定的类型覆盖
          else if (typeOverrides && typeOverrides[field.key]) {
            usedType = typeOverrides[field.key];
            value = self.generateData(usedType, locale);
          }
          // 2. 检查 AI 分析结果
          else if (aiResults && aiResults[field.key] && aiResults[field.key].type) {
            usedType = aiResults[field.key].type;
            value = self.generateData(usedType, locale);
          }
          // 3. 再检查自定义映射
          else {
            const mappingKey = Object.keys(customMappings || {}).find(key =>
              (field.name && field.name.includes(key)) ||
              (field.id && field.id.includes(key)) ||
              (field.placeholder && field.placeholder.includes(key)) ||
              (field.label && field.label.includes(key))
            );

            if (mappingKey) {
              usedType = customMappings[mappingKey];
              value = self.generateData(usedType, locale, customMappings[mappingKey]);
            } else {
              value = self.generateData(field.inferredType, locale);
            }
          }

          if (value !== null && value !== undefined) {
            const success = await self.fillField(field, value);
            results.push({ field: field.key, success, value, usedType });
          }

          await delay(100);
        }
        return { success: true, results };
      } catch (error) {
        console.error('[AutoData] Fill error:', error);
        return { success: false, error: error.message };
      }
    },

    'refresh-fields': async () => {
      refreshFields();
      return {
        success: true,
        fields: serializeFields(currentFields),
        count: currentFields.length,
      };
    },

    'fill-with-dataset': async (msg) => {
      const { dataset } = msg;
      if (!dataset || !dataset.fields) {
        return { success: false, error: 'Invalid dataset' };
      }
      try {
        const results = [];
        for (const savedField of dataset.fields) {
          const field = currentFields.find(f => f.key === savedField.key);
          if (field && savedField.value !== undefined && savedField.value !== null) {
            const success = await self.fillField(field, savedField.value);
            results.push({ field: field.key, success, value: savedField.value });
          }
          await delay(100);
        }
        return { success: true, results };
      } catch (error) {
        console.error('[AutoData] Dataset fill error:', error);
        return { success: false, error: error.message };
      }
    },

    'get-page-context': async () => {
      // 获取页面上下文信息，帮助 AI 更好地理解表单
      return {
        success: true,
        url: window.location.href,
        title: document.title,
        formCount: document.querySelectorAll('form').length,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        description: document.querySelector('meta[name="description"]')?.content || '',
      };
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
}

function refreshFields() {
  const newFields = self.scanFormElements();
  currentFields = newFields;
  if (highlightsEnabled) {
    removeHighlights();
    highlightFields(currentFields);
  }
}

function serializeFields(fields) {
  return fields.map(serializeField);
}

function serializeField(field) {
  const { element, ...serialized } = field;
  return serialized;
}

function highlightFields(fields) {
  removeHighlights();
  fields.forEach((field, index) => {
    const el = field.element;
    if (el && self.isVisibleElement(el)) {
      el.classList.add('autodata-highlight');
      el.dataset.autodataIndex = index;
      el.dataset.autodataType = field.inferredType;
    }
  });
}

function removeHighlights() {
  document.querySelectorAll('.autodata-highlight').forEach(el => {
    el.classList.remove('autodata-highlight');
    delete el.dataset.autodataIndex;
    delete el.dataset.autodataType;
  });
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 启动
init();
