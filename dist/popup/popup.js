// popup/popup.js - Popup 交互逻辑

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    scanBtn:       document.getElementById('scanBtn'),
    fillBtn:       document.getElementById('fillBtn'),
    applyBtn:      document.getElementById('applyBtn'),
    clearBtn:      document.getElementById('clearBtn'),
    settingsBtn:   document.getElementById('settingsBtn'),
    closeSettings: document.getElementById('closeSettings'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    scanStatus:    document.getElementById('scanStatus'),
    fieldsContainer: document.getElementById('fieldsContainer'),
    fieldsList:    document.getElementById('fieldsList'),
    fieldCount:    document.getElementById('fieldCount'),
    noFields:      document.getElementById('noFields'),
    highlightToggle: document.getElementById('highlightToggle'),
    mappingField:  document.getElementById('mappingField'),
    mappingType:   document.getElementById('mappingType'),
    addMappingBtn: document.getElementById('addMappingBtn'),
    mappingsList:  document.getElementById('mappingsList'),
    resetBtn:      document.getElementById('resetBtn'),
    toast:         document.getElementById('toast'),
    // AI 相关
    aiToggle:      document.getElementById('aiToggle'),
    aiEnabled:     document.getElementById('aiEnabled'),
    aiProvider:    document.getElementById('aiProvider'),
    aiBaseUrl:     document.getElementById('aiBaseUrl'),
    apiKey:        document.getElementById('apiKey'),
    aiModel:       document.getElementById('aiModel'),
    testAiBtn:     document.getElementById('testAiBtn'),
    aiStatus:      document.getElementById('aiStatus'),
  };

  let currentFields = [];
  let currentConfig = {};
  let fieldOverrides = {}; // 存储用户修改的字段类型
  let isEditing = false;
  let aiAnalysisResults = {}; // 存储 AI 识别结果（字段类型）
  let aiGeneratedData = {}; // 存储 AI 预生成的数据
  let aiGroups = []; // 存储 AI 识别的关联分组

  // 初始化
  init();

  async function init() {
    // 加载配置
    const config = await sendMessage({ action: 'get-config' });
    if (config?.success) {
      currentConfig = config.config;
      renderMappings(currentConfig.customMappings || {});

      // 加载 AI 设置
      if (currentConfig.aiEnabled !== undefined) {
        elements.aiEnabled.checked = currentConfig.aiEnabled;
        elements.aiToggle.checked = currentConfig.aiEnabled;
      }
      if (currentConfig.aiProvider) {
        elements.aiProvider.value = currentConfig.aiProvider;
      }
      if (currentConfig.aiBaseUrl) {
        elements.aiBaseUrl.value = currentConfig.aiBaseUrl;
      }
      if (currentConfig.apiKey) {
        elements.apiKey.value = currentConfig.apiKey;
      }
      if (currentConfig.aiModel) {
        elements.aiModel.value = currentConfig.aiModel;
      }
      // provider 切换时更新 placeholder
      updateProviderDefaults(currentConfig.aiProvider || 'anthropic', false);
    }
  }

  const PROVIDER_DEFAULTS = {
    anthropic: { baseUrl: 'https://api.anthropic.com', model: 'claude-3-5-haiku-20240620' },
    openai:    { baseUrl: 'https://api.openai.com',    model: 'gpt-4o-mini' },
  };

  function updateProviderDefaults(provider, overwriteInputs) {
    const defaults = PROVIDER_DEFAULTS[provider];
    if (!defaults) return;
    elements.aiBaseUrl.placeholder = defaults.baseUrl;
    elements.aiModel.placeholder = defaults.model;
    if (overwriteInputs) {
      elements.aiBaseUrl.value = defaults.baseUrl;
      elements.aiModel.value = defaults.model;
    }
  }

  // === 事件绑定 ===

  // 扫描页面
  elements.scanBtn.addEventListener('click', async () => {
    elements.scanBtn.disabled = true;
    elements.scanBtn.textContent = '🔍 扫描中...';

    // 先获取页面字段
    const response = await sendTabMessage({ action: 'scan-fields' });
    if (response?.success) {
      currentFields = response.fields;
      aiAnalysisResults = {};
      aiGeneratedData = {};
      aiGroups = [];

      // 如果启用了 AI，进行智能分析
      if (currentConfig.aiEnabled) {
        showToast('🤖 正在进行 AI 分析...', '');
        try {
          const locale = getSelectedLocale();
          const aiResponse = await sendMessage({
            action: 'analyze-fields',
            fields: response.fields,
            locale,
            pageContext: await sendTabMessage({ action: 'get-page-context' }),
          });

          if (aiResponse?.success && aiResponse.results) {
            aiAnalysisResults = aiResponse.results;
            aiGeneratedData = aiResponse.results.data || {};
            aiGroups = aiResponse.results.groups || [];
            // 合并 AI 分析结果到字段
            currentFields = currentFields.map(field => ({
              ...field,
              aiType: aiAnalysisResults[field.key]?.type,
              aiConfidence: aiAnalysisResults[field.key]?.confidence,
            }));
            const groupInfo = aiGroups.length > 0 ? `，${aiGroups.length}组关联` : '';
            showToast(`识别到 ${response.count} 个字段 (AI增强${groupInfo})`, 'success');
          } else {
            showToast(`识别到 ${response.count} 个字段`, 'success');
          }
        } catch (err) {
          console.error('AI analysis failed:', err);
          showToast(`识别到 ${response.count} 个字段`, 'success');
        }
      } else {
        showToast(`识别到 ${response.count} 个字段`, 'success');
      }

      updateFieldList(currentFields);
    } else {
      showNoFields();
      showToast('未检测到表单字段', 'error');
    }

    elements.scanBtn.disabled = false;
    elements.scanBtn.innerHTML = '<span>🔍</span> 扫描页面';
  });

  // 随机填充
  elements.fillBtn.addEventListener('click', async () => {
    elements.fillBtn.disabled = true;
    const locale = getSelectedLocale();

    // 如果有 AI 分析结果，使用 fill-with-types
    const response = Object.keys(aiAnalysisResults).length > 0
      ? await sendTabMessage({
          action: 'fill-with-types',
          locale,
          typeOverrides: {},
          customMappings: currentConfig.customMappings || {},
          aiResults: aiAnalysisResults,
          aiData: aiGeneratedData, // 传递 AI 预生成的数据
          aiGroups: aiGroups, // 传递关联分组
        })
      : await sendTabMessage({
          action: 'fill-all',
          locale,
          customMappings: currentConfig.customMappings || {},
        });

    if (response?.success) {
      const filled = response.results.filter(r => r.success).length;
      showToast(`已填充 ${filled} 个字段`, 'success');
      // 进入编辑模式
      isEditing = true;
      fieldOverrides = {};
      elements.fillBtn.classList.add('hidden');
      elements.applyBtn.classList.remove('hidden');
      // 刷新字段列表显示
      await refreshFieldList();
    } else {
      showToast('填充失败', 'error');
    }
    elements.fillBtn.disabled = false;
  });

  // 应用修改
  elements.applyBtn.addEventListener('click', async () => {
    // 收集用户修改的类型
    const typeOverrides = {};
    elements.fieldsList.querySelectorAll('.field-type-select').forEach(select => {
      const key = select.dataset.key;
      const newType = select.value;
      if (newType !== currentFields.find(f => f.key === key)?.inferredType) {
        typeOverrides[key] = newType;
      }
    });

    if (Object.keys(typeOverrides).length > 0 || Object.keys(fieldOverrides).length > 0) {
      // 重新生成并填充
      const locale = getSelectedLocale();
      const response = await sendTabMessage({
        action: 'fill-with-types',
        locale,
        typeOverrides,
        customMappings: currentConfig.customMappings || {},
        aiResults: aiAnalysisResults,
        aiData: aiGeneratedData,
        aiGroups: aiGroups,
      });
      if (response?.success) {
        showToast('已应用修改', 'success');
        await refreshFieldList();
      } else {
        showToast('应用失败', 'error');
      }
    }

    // 退出编辑模式
    exitEditMode();
  });

  function exitEditMode() {
    isEditing = false;
    fieldOverrides = {};
    elements.applyBtn.classList.add('hidden');
    elements.fillBtn.classList.remove('hidden');
    refreshFieldList();
  }

  async function refreshFieldList() {
    const response = await sendTabMessage({ action: 'scan-fields' });
    if (response?.success) {
      currentFields = response.fields;
      updateFieldList(currentFields);
    }
  }

  // 清空
  elements.clearBtn.addEventListener('click', async () => {
    const response = await sendTabMessage({ action: 'clear-all' });
    if (response?.success) {
      showToast('已清空所有字段', 'success');
      await elements.scanBtn.click();
    }
  });

  // 高亮切换
  elements.highlightToggle.addEventListener('change', async (e) => {
    await sendTabMessage({ action: 'toggle-highlight', enabled: e.target.checked });
  });

  // 设置面板
  elements.settingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.remove('hidden');
  });
  elements.closeSettings.addEventListener('click', () => {
    elements.settingsPanel.classList.add('hidden');
  });
  elements.closeSettingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.add('hidden');
  });

  // 添加映射
  elements.addMappingBtn.addEventListener('click', async () => {
    const field = elements.mappingField.value.trim();
    const type = elements.mappingType.value;
    if (!field) {
      showToast('请输入字段名', 'error');
      return;
    }
    const response = await sendMessage({
      action: 'update-mappings',
      mappings: { [field]: type },
    });
    if (response?.success) {
      currentConfig.customMappings = response.config.customMappings;
      renderMappings(currentConfig.customMappings);
      elements.mappingField.value = '';
      showToast('规则已添加', 'success');
    }
  });

  // 恢复默认
  elements.resetBtn.addEventListener('click', async () => {
    const response = await sendMessage({ action: 'reset-config' });
    if (response?.success) {
      currentConfig = response.config;
      renderMappings(currentConfig.customMappings);
      showToast('已恢复默认设置', 'success');
    }
  });

  // AI 相关事件
  elements.aiToggle.addEventListener('change', (e) => {
    elements.aiEnabled.checked = e.target.checked;
    saveAiSettings();
  });

  elements.aiProvider.addEventListener('change', (e) => {
    updateProviderDefaults(e.target.value, true);
    saveAiSettings();
  });

  // 保存 AI 设置
  async function saveAiSettings() {
    const aiConfig = {
      aiEnabled: elements.aiEnabled.checked,
      aiProvider: elements.aiProvider.value,
      aiBaseUrl: elements.aiBaseUrl.value.trim(),
      apiKey: elements.apiKey.value,
      aiModel: elements.aiModel.value.trim(),
    };
    const resp = await sendMessage({ action: 'save-ai-config', config: aiConfig });
    if (resp?.success) currentConfig = resp.config;
  }

  elements.aiEnabled.addEventListener('change', saveAiSettings);
  elements.aiBaseUrl.addEventListener('change', saveAiSettings);
  elements.apiKey.addEventListener('change', saveAiSettings);
  elements.aiModel.addEventListener('change', saveAiSettings);

  // 测试 AI 连接
  elements.testAiBtn.addEventListener('click', async () => {
    const provider = elements.aiProvider.value;
    const baseUrl = elements.aiBaseUrl.value.trim();
    const apiKey = elements.apiKey.value;
    const model = elements.aiModel.value.trim();

    if (!apiKey) {
      showAiStatus('请输入 API Key', 'error');
      return;
    }
    if (!baseUrl) {
      showAiStatus('请输入请求地址', 'error');
      return;
    }
    if (!model) {
      showAiStatus('请输入模型名称', 'error');
      return;
    }

    showAiStatus('正在测试...', 'loading');

    const response = await sendMessage({
      action: 'test-ai',
      config: { aiProvider: provider, aiBaseUrl: baseUrl, apiKey, aiModel: model }
    });

    if (response?.success) {
      showAiStatus('连接成功!', 'success');
    } else {
      showAiStatus(response?.error || '连接失败', 'error');
    }
  });

  function showAiStatus(message, type) {
    elements.aiStatus.textContent = message;
    elements.aiStatus.className = `ai-status ${type}`;
    setTimeout(() => {
      elements.aiStatus.textContent = '';
      elements.aiStatus.className = 'ai-status';
    }, 3000);
  }

  // === 辅助函数 ===

  function updateFieldList(fields) {
    if (fields.length === 0) {
      showNoFields();
      return;
    }

    elements.scanStatus.classList.add('hidden');
    elements.noFields.classList.add('hidden');
    elements.fieldsContainer.classList.remove('hidden');
    elements.fieldCount.textContent = fields.length;
    elements.fillBtn.disabled = false;
    elements.clearBtn.disabled = false;

    const allTypes = [
      'name', 'firstName', 'lastName', 'email', 'phone', 'address',
      'city', 'province', 'country', 'zipcode', 'company', 'password',
      'account', 'age', 'birthday', 'date', 'url', 'ip',
      'idCard', 'gender', 'education', 'job', 'salary', 'amount',
      'price', 'desc', 'bankCard', 'bankArea', 'bankName', 'bankBranch',
    ];

    const typeOptions = allTypes.map(type => {
      const label = getTypeLabel(type);
      return `<option value="${type}">${label}</option>`;
    }).join('');

    elements.fieldsList.innerHTML = fields.map(field => {
      const icon = getFieldIcon(field.inferredType);
      const label = field.label || field.name || field.placeholder || field.id || field.tagName;
      const currentType = fieldOverrides[field.key] || field.inferredType;
      const showEdit = isEditing && field.value; // 填充后才显示编辑

      // AI 分析结果显示
      const aiInfo = aiAnalysisResults[field.key];
      const hasAiAnalysis = aiInfo && aiInfo.type && aiInfo.type !== field.inferredType;
      const confidenceClass = aiInfo?.confidence >= 0.8 ? 'high' : aiInfo?.confidence >= 0.5 ? 'medium' : 'low';

      return `
        <div class="field-item ${showEdit ? 'editable' : ''} ${hasAiAnalysis ? 'has-ai' : ''}" data-key="${field.key}">
          <span class="field-icon">${icon}</span>
          <div class="field-info">
            <div class="field-label" title="${escapeHtml(label)}">${escapeHtml(label)}</div>
            ${showEdit ? `
              <select class="field-type-select" data-key="${field.key}">
                ${typeOptions.replace(`value="${currentType}"`, `value="${currentType}" selected`)}
              </select>
            ` : `
              <div class="field-type">
                ${getTypeLabel(field.inferredType)} · ${field.type || field.tagName}
                ${hasAiAnalysis ? `<span class="ai-badge ${confidenceClass}" title="${aiInfo.reason || ''}">🤖 ${Math.round((aiInfo.confidence || 0) * 100)}%</span>` : ''}
              </div>
            `}
          </div>
          <span class="field-preview">${escapeHtml(field.value || '—')}</span>
          ${showEdit ? `
            <button class="refresh-btn" data-key="${field.key}" title="重新生成">🔄</button>
          ` : ''}
        </div>
      `;
    }).join('');

    // 绑定刷新按钮
    elements.fieldsList.querySelectorAll('.refresh-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.key;
        const select = elements.fieldsList.querySelector(`.field-type-select[data-key="${key}"]`);
        const newType = select.value;
        const locale = getSelectedLocale();

        const response = await sendTabMessage({
          action: 'fill-single',
          key,
          type: newType,
          locale,
        });

        if (response?.success) {
          // 更新预览
          const fieldItem = elements.fieldsList.querySelector(`.field-item[data-key="${key}"]`);
          const preview = fieldItem.querySelector('.field-preview');
          preview.textContent = response.value || '—';
          btn.title = '已更新';
          setTimeout(() => btn.title = '重新生成', 1000);
        }
      });
    });
  }

  function getTypeLabel(type) {
    const labels = {
      name: '姓名', firstName: '名', lastName: '姓',
      email: '邮箱', phone: '电话', address: '地址',
      city: '城市', province: '省份', country: '国家',
      zipcode: '邮编', company: '公司', password: '密码',
      account: '账号', age: '年龄', birthday: '生日',
      date: '日期', url: 'URL', ip: 'IP',
      idCard: '身份证', gender: '性别', education: '学历',
      job: '职位', salary: '薪资', amount: '数量',
      price: '价格', desc: '描述', select: '下拉',
      checkbox: '复选', radio: '单选',
      bankCard: '银行卡', bankArea: '开户区域', bankName: '开户银行', bankBranch: '开户支行',
    };
    return labels[type] || type;
  }

  function showNoFields() {
    elements.scanStatus.classList.add('hidden');
    elements.fieldsContainer.classList.add('hidden');
    elements.noFields.classList.remove('hidden');
    elements.fillBtn.disabled = true;
    elements.clearBtn.disabled = true;
  }

  function renderMappings(mappings) {
    const typeLabels = {
      name: '姓名', email: '邮箱', phone: '电话', address: '地址',
      company: '公司', uuid: 'UUID', date: '日期', select: '下拉',
    };
    elements.mappingsList.innerHTML = Object.entries(mappings).map(([field, type]) => `
      <div class="mapping-item">
        <span class="field-name">${escapeHtml(field)}</span>
        <span class="mapping-type">${typeLabels[type] || type}</span>
        <button class="delete-btn" data-field="${escapeHtml(field)}" title="删除">✕</button>
      </div>
    `).join('');

    // 绑定删除按钮
    elements.mappingsList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const field = btn.dataset.field;
        const response = await sendMessage({ action: 'delete-mapping', key: field });
        if (response?.success) {
          currentConfig.customMappings = response.config.customMappings;
          renderMappings(currentConfig.customMappings);
          showToast('规则已删除', 'success');
        }
      });
    });
  }

  function getSelectedLocale() {
    const checked = document.querySelector('input[name="locale"]:checked');
    if (checked?.value === 'random') {
      return Math.random() > 0.5 ? 'zh_CN' : 'en_US';
    }
    return checked?.value || 'zh_CN';
  }

  function getFieldIcon(type) {
    const icons = {
      name: '👤', firstName: '👤', lastName: '👤',
      email: '📧', phone: '📱', address: '🏠',
      city: '🏙️', province: '🗺️', country: '🌍',
      zipcode: '📮', company: '🏢', password: '🔒',
      account: '🔑', age: '🎂', birthday: '🎂',
      date: '📅', url: '🔗', ip: '🌐',
      idCard: '🪪', gender: '⚧', education: '🎓',
      job: '💼', salary: '💰', amount: '#️⃣',
      price: '💲', desc: '📝', select: '📋',
      checkbox: '☑️', radio: '🔘',
      bankCard: '💳', bankArea: '📍', bankName: '🏦', bankBranch: '🏧',
    };
    return icons[type] || '📝';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 向 background 发送消息
  function sendMessage(message) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(message, resolve);
    });
  }

  // 向 content script 发送消息
  function sendTabMessage(message) {
    return new Promise(async resolve => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        resolve({ success: false, error: 'No active tab' });
        return;
      }
      chrome.tabs.sendMessage(tab.id, message, resolve);
    });
  }

  // Toast 通知
  let toastTimer;
  function showToast(message, type = '') {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.remove('hidden');
    toastTimer = setTimeout(() => {
      elements.toast.classList.add('hidden');
    }, 2500);
  }
});
