// popup/popup.js - Popup 交互逻辑

// SVG 图标库
const ICONS = {
  name: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  firstName: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  lastName: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  address: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  city: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 11h16M9 21h6M9 3v8M15 3v8M9 11v10"/></svg>`,
  province: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  country: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  zipcode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4"/></svg>`,
  company: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6"/></svg>`,
  password: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  account: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4zM8 8v2a4 4 0 0 0 8 0V8"/><circle cx="12" cy="16" r="2"/></svg>`,
  age: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  birthday: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01"/></svg>`,
  date: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  url: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  ip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
  idCard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>`,
  gender: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
  education: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  job: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  salary: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  amount: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  price: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  desc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  select: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 11 12 14 15 11"/></svg>`,
  checkbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  radio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`,
  bankCard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  bankArea: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  bankName: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>`,
  bankBranch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M5 10v11M19 10v11M8 14v3M12 14v3M16 14v3"/></svg>`,
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V12h3l4 4v-4h3v4l4-4v-2.6c-1.2-.6-2-1.9-2-3.4a4 4 0 0 1 4-4 4 4 0 0 0-8 0"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

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
    aiProgress:    document.getElementById('aiProgress'),
    progressStatus: document.getElementById('progressStatus'),
    progressWarning: document.getElementById('progressWarning'),
  };

  let currentFields = [];
  let currentConfig = {};
  let fieldOverrides = {};
  let isEditing = false;
  let aiAnalysisResults = {};
  let aiGeneratedData = {};
  let aiGroups = [];

  // 初始化
  init();

  async function init() {
    const config = await sendMessage({ action: 'get-config' });
    if (config?.success) {
      currentConfig = config.config;
      renderMappings(currentConfig.customMappings || {});

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

  elements.scanBtn.addEventListener('click', async () => {
    elements.scanBtn.disabled = true;
    elements.scanBtn.innerHTML = `${ICONS.refresh} 扫描中...`;

    const response = await sendTabMessage({ action: 'scan-fields' });
    if (response?.success) {
      currentFields = response.fields;
      aiAnalysisResults = {};
      aiGeneratedData = {};
      aiGroups = [];

      if (currentConfig.aiEnabled) {
        showAiProgress();
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
        } finally {
          hideAiProgress();
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
    elements.scanBtn.innerHTML = `${ICONS.refresh} 扫描页面`;
  });

  elements.fillBtn.addEventListener('click', async () => {
    elements.fillBtn.disabled = true;
    const locale = getSelectedLocale();

    const response = Object.keys(aiAnalysisResults).length > 0
      ? await sendTabMessage({
          action: 'fill-with-types',
          locale,
          typeOverrides: {},
          customMappings: currentConfig.customMappings || {},
          aiResults: aiAnalysisResults,
          aiData: aiGeneratedData,
          aiGroups: aiGroups,
        })
      : await sendTabMessage({
          action: 'fill-all',
          locale,
          customMappings: currentConfig.customMappings || {},
        });

    if (response?.success) {
      const filled = response.results.filter(r => r.success).length;
      showToast(`已填充 ${filled} 个字段`, 'success');
      isEditing = true;
      fieldOverrides = {};
      elements.fillBtn.classList.add('hidden');
      elements.applyBtn.classList.remove('hidden');
      await refreshFieldList();
    } else {
      showToast('填充失败', 'error');
    }
    elements.fillBtn.disabled = false;
  });

  elements.applyBtn.addEventListener('click', async () => {
    const typeOverrides = {};
    elements.fieldsList.querySelectorAll('.field-type-select').forEach(select => {
      const key = select.dataset.key;
      const newType = select.value;
      if (newType !== currentFields.find(f => f.key === key)?.inferredType) {
        typeOverrides[key] = newType;
      }
    });

    if (Object.keys(typeOverrides).length > 0 || Object.keys(fieldOverrides).length > 0) {
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

  elements.clearBtn.addEventListener('click', async () => {
    const response = await sendTabMessage({ action: 'clear-all' });
    if (response?.success) {
      showToast('已清空所有字段', 'success');
      await elements.scanBtn.click();
    }
  });

  elements.highlightToggle.addEventListener('change', async (e) => {
    await sendTabMessage({ action: 'toggle-highlight', enabled: e.target.checked });
  });

  elements.settingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.remove('hidden');
  });
  elements.closeSettings.addEventListener('click', () => {
    elements.settingsPanel.classList.add('hidden');
  });
  elements.closeSettingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.add('hidden');
  });

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

  elements.resetBtn.addEventListener('click', async () => {
    const response = await sendMessage({ action: 'reset-config' });
    if (response?.success) {
      currentConfig = response.config;
      renderMappings(currentConfig.customMappings);
      showToast('已恢复默认设置', 'success');
    }
  });

  elements.aiToggle.addEventListener('change', (e) => {
    elements.aiEnabled.checked = e.target.checked;
    saveAiSettings();
  });

  elements.aiProvider.addEventListener('change', (e) => {
    updateProviderDefaults(e.target.value, true);
    saveAiSettings();
  });

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
      const showEdit = isEditing && field.value;

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
                ${hasAiAnalysis ? `<span class="ai-badge ${confidenceClass}" title="${aiInfo.reason || ''}">${ICONS.ai} ${Math.round((aiInfo.confidence || 0) * 100)}%</span>` : ''}
              </div>
            `}
          </div>
          <span class="field-preview">${escapeHtml(field.value || '—')}</span>
          ${showEdit ? `
            <button class="refresh-btn" data-key="${field.key}" title="重新生成" aria-label="重新生成">
              ${ICONS.refresh}
            </button>
          ` : ''}
        </div>
      `;
    }).join('');

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
        <button class="delete-btn" data-field="${escapeHtml(field)}" title="删除" aria-label="删除">
          ${ICONS.close}
        </button>
      </div>
    `).join('');

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
    return ICONS[type] || ICONS.default;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function sendMessage(message) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(message, resolve);
    });
  }

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

  // AI 进度条
  let progressTimer = null;
  let warningTimer = null;
  const PROGRESS_MESSAGES = [
    '正在分析字段类型',
    '正在识别字段关联',
    '正在生成测试数据',
    '正在校验数据一致性',
  ];

  function showAiProgress() {
    elements.scanStatus.classList.add('hidden');
    elements.fieldsContainer.classList.add('hidden');
    elements.noFields.classList.add('hidden');
    elements.aiProgress.classList.remove('hidden');
    elements.progressWarning.classList.add('hidden');
    elements.progressStatus.textContent = PROGRESS_MESSAGES[0];

    let msgIndex = 0;
    progressTimer = setInterval(() => {
      msgIndex = (msgIndex + 1) % PROGRESS_MESSAGES.length;
      elements.progressStatus.textContent = PROGRESS_MESSAGES[msgIndex];
    }, 3000);

    warningTimer = setTimeout(() => {
      elements.progressWarning.classList.remove('hidden');
    }, 5000);
  }

  function hideAiProgress() {
    clearInterval(progressTimer);
    clearTimeout(warningTimer);
    progressTimer = null;
    warningTimer = null;
    elements.aiProgress.classList.add('hidden');
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
