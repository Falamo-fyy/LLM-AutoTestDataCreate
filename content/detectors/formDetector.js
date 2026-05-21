// content/detectors/formDetector.js - 表单元素检测器

// 字段名到数据类型的智能映射规则
const FIELD_PATTERNS = {
  name:      { regex: /(name|姓名|用户名|username|contact|联系人|证件姓名)/i, priority: 5 },
  firstName: { regex: /^(first.?name|名|given.?name)$/i, priority: 10 },
  lastName:  { regex: /^(last.?name|姓|surname|family.?name)$/i, priority: 10 },
  email:     { regex: /(email|mail|邮箱|e-mail)/i, priority: 10 },
  phone:     { regex: /(phone|mobile|tel|电话|手机|cell)/i, priority: 8 },
  address:   { regex: /(address|addr|地址|street|详细地址)/i, priority: 6 },
  city:      { regex: /^(city|城市|地区|city)$/i, priority: 8 },
  province:  { regex: /(province|prov|省|state|region|区域)/i, priority: 7 },
  country:   { regex: /(country|国家|nation)/i, priority: 7 },
  zipcode:   { regex: /(zip|postal|邮编|zipcode)/i, priority: 9 },
  company:   { regex: /(company|corp|organization|公司|企业|单位|企业名称)/i, priority: 6 },
  password:  { regex: /(pass|pwd|密码)/i, priority: 10 },
  account:   { regex: /^(account|账号|登录名|login)$/i, priority: 9 },
  age:       { regex: /^(age|年龄)$/i, priority: 10 },
  birthday:  { regex: /(birthday|birth|出生|生日|有效期)/i, priority: 8 },
  date:      { regex: /(date|日期|time|时间|有效期限)/i, priority: 3 },
  url:       { regex: /(url|website|网址|网站|homepage|主页)/i, priority: 7 },
  ip:        { regex: /^(ip|ip.?address|ip地址)$/i, priority: 10 },
  idCard:    { regex: /(id.?card|身份证|identity|信用代码)/i, priority: 8 },
  gender:    { regex: /(gender|sex|性别)/i, priority: 8 },
  education: { regex: /(education|学历|degree|学位)/i, priority: 8 },
  job:       { regex: /(job|position|职位|岗位|title|occupation|职业)/i, priority: 6 },
  salary:    { regex: /(salary|工资|薪水|income|收入|pay|薪资)/i, priority: 8 },
  amount:    { regex: /(amount|qty|quantity|数量|num|count|个数)/i, priority: 4 },
  price:     { regex: /(price|价格|fee|金额|money|费用|cost)/i, priority: 6 },
  desc:        { regex: /(desc|description|备注|remark|note|描述|说明|detail|详情|comment|评论)/i, priority: 2 },
  bankCard:    { regex: /(开户账号|银行卡|bank.?card|credit.?card|卡号|card.?num)/i, priority: 10 },
  bankArea:    { regex: /(开户区域|开户地区|所属区域|所属地区|地区|province|city|bank.?area)/i, priority: 9 },
  bankName:    { regex: /(开户银行|所属银行|银行名称|bank.?name|bank)$/i, priority: 9 },
  bankBranch:  { regex: /(开户支行|支行|分行|网点|bank.?branch|branch|sub.?branch)/i, priority: 9 },
};

// input type 到默认数据类型的映射
const INPUT_TYPE_MAP = {
  text:     'name',
  email:    'email',
  tel:      'phone',
  password: 'password',
  number:   'amount',
  date:     'date',
  url:      'url',
  search:   'name',
};

// 根据字段名/id/placeholder/label 推断数据类型
function inferFieldType(element) {
  const identifiers = [
    element.name || '',
    element.id || '',
    element.placeholder || '',
    element.getAttribute('aria-label') || '',
    element.getAttribute('autocomplete') || '',
    getAssociatedLabel(element),
  ].filter(Boolean);

  const combinedText = identifiers.join(' ').toLowerCase();

  const matches = [];
  for (const [type, { regex, priority }] of Object.entries(FIELD_PATTERNS)) {
    if (regex.test(combinedText)) {
      matches.push({ type, priority });
    }
  }

  if (matches.length > 0) {
    matches.sort((a, b) => b.priority - a.priority);
    return matches[0].type;
  }

  if (element.tagName === 'INPUT' && INPUT_TYPE_MAP[element.type]) {
    return INPUT_TYPE_MAP[element.type];
  }

  if (element.tagName === 'TEXTAREA') return 'desc';
  if (element.tagName === 'SELECT') return 'select';

  return 'name';
}

function getAssociatedLabel(element) {
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
  }
  const parentLabel = element.closest('label');
  if (parentLabel) {
    return parentLabel.textContent.replace(element.value || '', '').trim();
  }
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent.trim();
  }

  // Vant UI: 查找父级 .van-cell 中的 .label 元素
  const vantCell = element.closest('.van-cell');
  if (vantCell) {
    const labelEl = vantCell.querySelector('.label');
    if (labelEl) return labelEl.textContent.trim();
  }

  return '';
}

function isVisibleElement(el) {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;
  return true;
}

function getSelectOptions(select) {
  if (select.tagName !== 'SELECT') return [];
  return Array.from(select.options).map(opt => ({
    value: opt.value,
    text: opt.textContent.trim(),
  }));
}

function createFieldInfo(element, key, extra = {}) {
  return {
    key: `field_${key}`,
    tagName: (element.tagName || 'input').toLowerCase(),
    type: element.type || 'text',
    name: element.name || '',
    id: element.id || '',
    placeholder: element.placeholder || '',
    label: getAssociatedLabel(element),
    value: element.value || '',
    options: getSelectOptions(element),
    inferredType: inferFieldType(element),
    element: element,
    ...extra,
  };
}

function isVisibleInput(input) {
  const type = (input.type || 'text').toLowerCase();
  if (['hidden', 'submit', 'reset', 'button', 'image', 'file'].includes(type)) {
    return false;
  }
  return isVisibleElement(input);
}

// 扫描页面上所有可填充的表单元素
function scanFormElements() {
  const elements = [];
  let keyCounter = 0;

  // 1. 原生 input 元素
  document.querySelectorAll('input').forEach(input => {
    if (isVisibleInput(input)) {
      elements.push(createFieldInfo(input, keyCounter++));
    }
  });

  // 2. textarea 元素
  document.querySelectorAll('textarea').forEach(textarea => {
    if (isVisibleElement(textarea)) {
      elements.push(createFieldInfo(textarea, keyCounter++));
    }
  });

  // 3. select 下拉框
  document.querySelectorAll('select').forEach(select => {
    if (isVisibleElement(select)) {
      elements.push(createFieldInfo(select, keyCounter++));
    }
  });

  // 4. contenteditable 元素
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    if (isVisibleElement(el)) {
      elements.push(createFieldInfo(el, keyCounter++));
    }
  });

  // 5. UI 组件库的自定义输入框
  detectUILibInputs(elements, keyCounter);

  return elements;
}

function detectUILibInputs(elements, startKey) {
  let key = startKey;

  // === Vant UI 支持 ===
  // Vant 的输入框在 .van-field__control 中
  document.querySelectorAll('.van-field__control').forEach(input => {
    if (!elements.find(e => e.element === input)) {
      // 检查是否是可见的
      const vanField = input.closest('.van-field');
      const parentCell = input.closest('.van-cell');
      const opacityEl = parentCell?.querySelector('.opacity');

      // 如果父级有 opacity 类，检查实际的 input
      if (opacityEl && vanField && vanField.classList.contains('opacity')) {
        // 这是一个隐藏的输入框，跳过或标记
        return;
      }

      if (isVisibleElement(input)) {
        const label = getVantFieldLabel(input);
        const inferredType = inferFieldType({ ...input, placeholder: input.placeholder });

        elements.push(createFieldInfo(input, key++, {
          uiLib: 'vant',
          label: label,
          isVantDatePicker: isVantDatePicker(input),
          isVantAreaPicker: isVantAreaPicker(input),
        }));
      }
    }
  });

  // === Ant Design ===
  document.querySelectorAll('.ant-input, .ant-input-affix-wrapper input').forEach(input => {
    if (isVisibleElement(input) && !elements.find(e => e.element === input)) {
      const wrapper = input.closest('.ant-input-affix-wrapper') || input.closest('.ant-input-number');
      if (wrapper && isVisibleElement(wrapper)) {
        elements.push(createFieldInfo(wrapper.tagName === 'INPUT' ? wrapper : input, key++));
      } else if (input.classList.contains('ant-input')) {
        elements.push(createFieldInfo(input, key++));
      }
    }
  });

  // === Element UI ===
  document.querySelectorAll('.el-input__inner').forEach(input => {
    if (isVisibleElement(input) && !elements.find(e => e.element === input)) {
      const wrapper = input.closest('.el-input');
      if (wrapper) {
        elements.push(createFieldInfo(input, key++));
      }
    }
  });

  // === iView ===
  document.querySelectorAll('.ivu-input').forEach(input => {
    if (isVisibleElement(input) && !elements.find(e => e.element === input)) {
      elements.push(createFieldInfo(input, key++));
    }
  });
}

// 获取 Vant 字段的标签
function getVantFieldLabel(input) {
  // 方法1: 查找 .van-cell 中的 .label
  const vanCell = input.closest('.van-cell');
  if (vanCell) {
    const labelEl = vanCell.querySelector('.label');
    if (labelEl) return labelEl.textContent.trim();

    // 方法2: 查找前一个兄弟元素
    const prevSibling = vanCell.previousElementSibling;
    if (prevSibling && prevSibling.classList.contains('label')) {
      return prevSibling.textContent.trim();
    }
  }

  // 方法3: 查找父级结构中的标签
  const line = input.closest('.line');
  if (line) {
    const labelEl = line.querySelector('.label');
    if (labelEl) return labelEl.textContent.trim();
  }

  return '';
}

// 判断是否是 Vant 日期选择器
function isVantDatePicker(input) {
  const vanCell = input.closest('.van-cell');
  if (!vanCell) return false;

  // 日期选择器通常有 .value-item 或包含日期格式文本
  const valueItem = vanCell.querySelector('.value-item');
  if (valueItem) {
    const text = valueItem.textContent.trim();
    // 检查是否是日期格式
    if (/\d{4}[-/]\d{2}[-/]\d{2}/.test(text) || text.includes('请选择') || text === '长期') {
      return true;
    }
  }

  // 检查是否包含箭头（表示可点击）
  const arrow = vanCell.querySelector('.arrow-right-outside');
  return !!arrow;
}

// 判断是否是 Vant 地区选择器
function isVantAreaPicker(input) {
  const vanCell = input.closest('.van-cell');
  if (!vanCell) return false;

  // 地区选择器通常有 .text 类
  const textEl = vanCell.querySelector('.text');
  if (textEl) {
    const text = textEl.textContent.trim();
    if (text && !text.includes('请选择')) {
      return true;
    }
  }

  return false;
}

// 导出给全局
self.scanFormElements = scanFormElements;
self.isVisibleElement = isVisibleElement;
self.getAssociatedLabel = getAssociatedLabel;
