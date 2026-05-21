// 字段名到数据类型的智能映射规则
export const FIELD_PATTERNS = {
  name:      { regex: /(name|姓名|用户名|username|contact|联系人)/i, priority: 5 },
  firstName: { regex: /^(first.?name|名|given.?name)$/i, priority: 10 },
  lastName:  { regex: /^(last.?name|姓|surname|family.?name)$/i, priority: 10 },
  email:     { regex: /(email|mail|邮箱|e-mail)/i, priority: 10 },
  phone:     { regex: /(phone|mobile|tel|电话|手机|cell)/i, priority: 8 },
  address:   { regex: /(address|addr|地址|street)/i, priority: 6 },
  city:      { regex: /^(city|城市|地区)$/i, priority: 8 },
  province:  { regex: /(province|prov|省|state|region|区域)/i, priority: 7 },
  country:   { regex: /(country|国家|nation)/i, priority: 7 },
  zipcode:   { regex: /(zip|postal|邮编|zipcode)/i, priority: 9 },
  company:   { regex: /(company|corp|organization|公司|企业|单位)/i, priority: 6 },
  password:  { regex: /(pass|pwd|密码|密码)/i, priority: 10 },
  account:   { regex: /^(account|账号|登录名|login)$/i, priority: 9 },
  age:       { regex: /^(age|年龄)$/i, priority: 10 },
  birthday:  { regex: /(birthday|birth|出生|生日)/i, priority: 8 },
  date:      { regex: /(date|日期|time|时间)/i, priority: 3 },
  url:       { regex: /(url|website|网址|网站|homepage|主页)/i, priority: 7 },
  ip:        { regex: /^(ip|ip.?address|ip地址)$/i, priority: 10 },
  idCard:    { regex: /(id.?card|身份证|identity|证件)/i, priority: 8 },
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
export const INPUT_TYPE_MAP = {
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
export function inferFieldType(element) {
  const identifiers = [
    element.name || '',
    element.id || '',
    element.placeholder || '',
    element.getAttribute('aria-label') || '',
    element.getAttribute('autocomplete') || '',
    getAssociatedLabel(element),
  ].filter(Boolean);

  const combinedText = identifiers.join(' ').toLowerCase();

  // 先匹配高优先级的特定模式
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

  // 回退到 input type 映射
  if (element.tagName === 'INPUT' && INPUT_TYPE_MAP[element.type]) {
    return INPUT_TYPE_MAP[element.type];
  }

  if (element.tagName === 'TEXTAREA') return 'desc';
  if (element.tagName === 'SELECT') return 'select';

  return 'name';
}

function getAssociatedLabel(element) {
  // 通过 label[for] 查找
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
  }
  // 通过父级 label 查找
  const parentLabel = element.closest('label');
  if (parentLabel) {
    return parentLabel.textContent.replace(element.value || '', '').trim();
  }
  // 通过 aria-labelledby 查找
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent.trim();
  }
  return '';
}
