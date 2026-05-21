// === AutoData Content Script ===
(function() {
"use strict";

// --- data/faker-data.js ---
// data/faker-data.js - 纯本地测试数据生成（无需外部依赖）
// 支持中英文数据

// 中文人名
const CHINESE_LAST_NAMES = ['张','李','王','刘','陈','杨','赵','黄','周','吴','徐','孙','胡','朱','高','林','何','郭','马','罗','梁','宋','郑','谢','韩','唐','冯','于','董','萧','程','曹','袁','邓','许','傅','沈','曾','彭','吕','苏','卢','蒋','蔡','贾','丁','魏','薛','叶','阎','余','潘','杜','戴','夏','钟','汪','田','任','姜','范','方','石','姚','谭','廖','邹','熊','金','陆','郝','孔','白','崔','康','毛','邱','秦','江','史','顾','侯','邵','孟','龙','万','段','漕','钱','汤','尹','黎','易','常','武','乔','贺','赖','龚','文'];
const CHINESE_FIRST_NAMES = ['伟','芳','娜','秀英','敏','静','丽','强','磊','军','洋','勇','艳','杰','娟','涛','明','超','秀兰','霞','平','刚','桂英','芬','玲','国华','建军','志强','永强','建华','海','波','辉','婷','凤','莉','鹏','飞','红','云','华','玉兰','玉珍','英','梅','玉梅','玉芬','兰','兰英','婷','淑珍','淑英','建华','志明','志强','志刚','志国','志华','志远','志伟','志杰','志勇','志刚','志鹏','志飞','志红'];

// 英文人名
const ENGLISH_FIRST_NAMES = ['James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles','Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen','Emma','Olivia','Ava','Sophia','Isabella','Mia','Charlotte','Amelia','Harper','Evelyn','Abigail','Emily','Elizabeth'];
const ENGLISH_LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson'];

// 地址数据
const CHINESE_PROVINCES = ['北京市','上海市','天津市','重庆市','广东省','江苏省','浙江省','四川省','湖北省','湖南省','河南省','河北省','山东省','山西省','陕西省','福建省','安徽省','辽宁省','吉林省','黑龙江省','江西省','云南省','贵州省','甘肃省','青海省','内蒙古','广西','西藏','宁夏','新疆','海南省','台湾省','香港','澳门'];
const CHINESE_CITIES = ['北京','上海','广州','深圳','杭州','南京','成都','武汉','西安','苏州','天津','重庆','长沙','郑州','济南','青岛','大连','沈阳','厦门','福州','哈尔滨','长春','石家庄','合肥','昆明','贵阳','南昌','太原','兰州','呼和浩特','乌鲁木齐','银川','西宁','拉萨','南宁','海口'];
const CHINESE_STREETS = ['建国路','长安街','中山路','人民路','和平路','解放路','胜利路','友谊路','幸福路','光明路','振兴路','中华路','团结路','先锋路','建设路','文化路','胜利街','和平街','中山街','长安街'];
const ENGLISH_STREETS = ['Main St','Oak Ave','Maple Dr','Cedar Ln','Pine Rd','Elm St','Park Ave','Lake Blvd','Hill Rd','River Rd','Church St','Mill Rd','School St','Court St','Washington Ave'];
const ENGLISH_CITIES = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Seattle','Denver','Boston','Portland','Las Vegas','Detroit','Memphis'];
const ENGLISH_STATES = ['NY','CA','IL','TX','AZ','PA','FL','OH','NC','MI','WA','CO','MA','OR','NV','GA','DC'];

// 公司名称
const CHINESE_COMPANY_PREFIXES = ['华','中','国','金','银','龙','凤','盛','祥','腾','飞','宏','伟','新','科','创','智','云','海','天','地','人','和','同','正','明','大','安','泰','富','恒'];
const CHINESE_COMPANY_SUFFIXES = ['科技有限公司','信息技术有限公司','网络科技有限公司','电子有限公司','实业有限公司','贸易有限公司','传媒有限公司','咨询有限公司','管理有限公司','建筑工程有限公司'];
const ENGLISH_COMPANY_PREFIXES = ['Global','United','Pacific','Atlantic','Digital','Tech','Smart','Future','Prime','Elite','First','Top','Best','Pro','Advanced','Dynamic','Global','International','National','Apex'];
const ENGLISH_COMPANY_SUFFIXES = ['Corp','Inc','LLC','Ltd','Group','Solutions','Systems','Technologies','Services','Industries'];

// 银行卡 BIN 号（前6位）- 含 Luhn 校验的卡号生成
const BANK_CARD_BINS = {
  '工商银行': ['622202', '622203', '622208', '621226'],
  '建设银行': ['622700', '622280', '621700', '436742'],
  '农业银行': ['622848', '622845', '622849', '103000'],
  '中国银行': ['621661', '621660', '621658', '456351'],
  '交通银行': ['622260', '622261', '622258', '625913'],
  '招商银行': ['622580', '622588', '621286', '439188'],
  '浦发银行': ['622521', '622522', '622520', '84301'],
  '民生银行': ['622619', '622617', '622618', '421869'],
  '兴业银行': ['622901', '622902', '622900', '483492'],
  '光大银行': ['622663', '622662', '622660', '356837'],
  '华夏银行': ['622630', '622631', '622632'],
  '中信银行': ['622696', '622698', '622689', '433671'],
  '平安银行': ['622155', '622156', '622157', '409666'],
  '广发银行': ['622568', '622560', '622565', '685800'],
  '邮储银行': ['622188', '621799', '622150', '621098'],
};

// 银行区域 -> 银行 -> 支行 映射
const BANK_DATA = {
  '北京市': {
    '工商银行': ['工商银行北京分行营业部', '工商银行北京朝阳支行', '工商银行北京海淀支行', '工商银行北京西城支行', '工商银行北京东城支行', '工商银行北京丰台支行'],
    '建设银行': ['建设银行北京分行营业部', '建设银行北京朝阳支行', '建设银行北京海淀支行', '建设银行北京西直门支行', '建设银行北京东城支行'],
    '农业银行': ['农业银行北京分行营业部', '农业银行北京朝阳支行', '农业银行北京海淀支行', '农业银行北京西城支行'],
    '中国银行': ['中国银行北京分行营业部', '中国银行北京朝阳支行', '中国银行北京海淀支行', '中国银行北京东城支行'],
  },
  '上海市': {
    '工商银行': ['工商银行上海分行营业部', '工商银行上海浦东支行', '工商银行上海黄浦支行', '工商银行上海静安支行', '工商银行上海徐汇支行'],
    '建设银行': ['建设银行上海分行营业部', '建设银行上海浦东支行', '建设银行上海黄浦支行', '建设银行上海静安支行'],
    '农业银行': ['农业银行上海分行营业部', '农业银行上海浦东支行', '农业银行上海黄浦支行'],
    '中国银行': ['中国银行上海分行营业部', '中国银行上海浦东支行', '中国银行上海黄浦支行', '中国银行上海徐汇支行'],
    '招商银行': ['招商银行上海分行营业部', '招商银行上海浦东支行', '招商银行上海黄浦支行', '招商银行上海静安支行'],
  },
  '广东省': {
    '工商银行': ['工商银行广州分行营业部', '工商银行深圳分行营业部', '工商银行广州天河支行', '工商银行深圳福田支行', '工商银行东莞支行'],
    '建设银行': ['建设银行广州分行营业部', '建设银行深圳分行营业部', '建设银行广州天河支行', '建设银行深圳南山支行'],
    '农业银行': ['农业银行广州分行营业部', '农业银行深圳分行营业部', '农业银行广州天河支行'],
    '中国银行': ['中国银行广州分行营业部', '中国银行深圳分行营业部', '中国银行广州天河支行', '中国银行深圳福田支行'],
    '招商银行': ['招商银行广州分行营业部', '招商银行深圳分行营业部', '招商银行深圳福田支行'],
  },
  '江苏省': {
    '工商银行': ['工商银行南京分行营业部', '工商银行苏州分行营业部', '工商银行南京鼓楼支行', '工商银行苏州工业园区支行'],
    '建设银行': ['建设银行南京分行营业部', '建设银行苏州分行营业部', '建设银行南京鼓楼支行'],
    '农业银行': ['农业银行南京分行营业部', '农业银行苏州分行营业部', '农业银行南京鼓楼支行'],
    '中国银行': ['中国银行南京分行营业部', '中国银行苏州分行营业部', '中国银行苏州工业园区支行'],
  },
  '浙江省': {
    '工商银行': ['工商银行杭州分行营业部', '工商银行宁波分行营业部', '工商银行杭州西湖支行', '工商银行杭州萧山支行'],
    '建设银行': ['建设银行杭州分行营业部', '建设银行宁波分行营业部', '建设银行杭州西湖支行'],
    '农业银行': ['农业银行杭州分行营业部', '农业银行宁波分行营业部', '农业银行杭州西湖支行'],
    '中国银行': ['中国银行杭州分行营业部', '中国银行宁波分行营业部', '中国银行杭州西湖支行'],
  },
  '四川省': {
    '工商银行': ['工商银行成都分行营业部', '工商银行成都锦江支行', '工商银行成都武侯支行', '工商银行绵阳支行'],
    '建设银行': ['建设银行成都分行营业部', '建设银行成都锦江支行', '建设银行成都武侯支行'],
    '农业银行': ['农业银行成都分行营业部', '农业银行成都锦江支行'],
    '中国银行': ['中国银行成都分行营业部', '中国银行成都锦江支行', '中国银行成都武侯支行'],
  },
  '湖北省': {
    '工商银行': ['工商银行武汉分行营业部', '工商银行武汉武昌支行', '工商银行武汉汉口支行'],
    '建设银行': ['建设银行武汉分行营业部', '建设银行武汉武昌支行'],
    '农业银行': ['农业银行武汉分行营业部', '农业银行武汉武昌支行'],
    '中国银行': ['中国银行武汉分行营业部', '中国银行武汉武昌支行', '中国银行武汉汉口支行'],
  },
  '山东省': {
    '工商银行': ['工商银行济南分行营业部', '工商银行青岛分行营业部', '工商银行济南历下支行', '工商银行青岛市南支行'],
    '建设银行': ['建设银行济南分行营业部', '建设银行青岛分行营业部'],
    '农业银行': ['农业银行济南分行营业部', '农业银行青岛分行营业部', '农业银行济南历下支行'],
    '中国银行': ['中国银行济南分行营业部', '中国银行青岛分行营业部'],
  },
  '河南省': {
    '工商银行': ['工商银行郑州分行营业部', '工商银行郑州金水支行', '工商银行洛阳支行'],
    '建设银行': ['建设银行郑州分行营业部', '建设银行郑州金水支行'],
    '农业银行': ['农业银行郑州分行营业部', '农业银行郑州金水支行'],
    '中国银行': ['中国银行郑州分行营业部', '中国银行郑州金水支行'],
  },
  '福建省': {
    '工商银行': ['工商银行福州分行营业部', '工商银行厦门分行营业部', '工商银行福州鼓楼支行'],
    '建设银行': ['建设银行福州分行营业部', '建设银行厦门分行营业部'],
    '农业银行': ['农业银行福州分行营业部', '农业银行厦门分行营业部'],
    '中国银行': ['中国银行福州分行营业部', '中国银行厦门分行营业部'],
  },
};

// Luhn 校验算法生成银行卡号
function generateBankCardNumber(bankName) {
  const bins = BANK_CARD_BINS[bankName] || Object.values(BANK_CARD_BINS)[randomInt(0, Object.values(BANK_CARD_BINS).length - 1)];
  const bin = randomItem(bins);
  const length = 19;
  let base = bin;
  while (base.length < length - 1) {
    base += String(randomInt(0, 9));
  }
  // Luhn 校验位
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    let digit = parseInt(base[i]);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return base + String(checkDigit);
}

// 随机工具函数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  return `1${[3,5,7,8,9][randomInt(0,4)]}${String(randomInt(100000000, 999999999)).padStart(9,'0')}`;
}

function randomDate() {
  const year = randomInt(2020, 2026);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 核心数据生成函数
function generateData(fieldType, locale = 'zh_CN', customOptions = null) {
  const isZh = locale === 'zh_CN' || locale === 'random' && Math.random() > 0.5;

  // 自定义 select 选项
  if (customOptions && customOptions.startsWith('select:')) {
    const options = customOptions.replace('select:', '').split(',');
    return options[randomInt(0, options.length - 1)];
  }

  const generators = {
    name() {
      if (isZh) {
        return randomItem(CHINESE_LAST_NAMES) + randomItem(CHINESE_FIRST_NAMES);
      }
      return `${randomItem(ENGLISH_FIRST_NAMES)} ${randomItem(ENGLISH_LAST_NAMES)}`;
    },

    firstName() {
      return isZh ? randomItem(CHINESE_FIRST_NAMES) : randomItem(ENGLISH_FIRST_NAMES);
    },

    lastName() {
      return isZh ? randomItem(CHINESE_LAST_NAMES) : randomItem(ENGLISH_LAST_NAMES);
    },

    email() {
      const name = (isZh
        ? randomItem(CHINESE_LAST_NAMES) + randomItem(CHINESE_FIRST_NAMES)
        : `${randomItem(ENGLISH_FIRST_NAMES)}${randomItem(ENGLISH_LAST_NAMES)}`
      ).toLowerCase();
      const domains = ['example.com','test.com','demo.com','mail.com','example.org'];
      return `${name}${randomInt(1,99)}@${randomItem(domains)}`;
    },

    phone() {
      return randomPhone();
    },

    address() {
      if (isZh) {
        return `${randomItem(CHINESE_PROVINCES)}${randomItem(CHINESE_CITIES)}${randomItem(CHINESE_STREETS)}${randomInt(1,999)}号`;
      }
      return `${randomInt(1,9999)} ${randomItem(ENGLISH_STREETS)}, ${randomItem(ENGLISH_CITIES)}, ${randomItem(ENGLISH_STATES)}`;
    },

    city() {
      return isZh ? randomItem(CHINESE_CITIES) : randomItem(ENGLISH_CITIES);
    },

    province() {
      return isZh ? randomItem(CHINESE_PROVINCES) : randomItem(ENGLISH_STATES);
    },

    country() {
      return isZh ? '中国' : randomItem(['United States','Canada','United Kingdom','Australia','Germany','France','Japan']);
    },

    zipcode() {
      if (isZh) return String(randomInt(100000, 999999));
      return String(randomInt(10000, 99999));
    },

    company() {
      if (isZh) {
        return `${randomItem(CHINESE_COMPANY_PREFIXES)}${randomItem(CHINESE_COMPANY_SUFFIXES)}`;
      }
      return `${randomItem(ENGLISH_COMPANY_PREFIXES)} ${randomItem(ENGLISH_COMPANY_SUFFIXES)}`;
    },

    password() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
      let pass = '';
      for (let i = 0; i < 12; i++) pass += chars[randomInt(0, chars.length - 1)];
      return pass;
    },

    account() {
      const chars = 'abcdefghijkmnpqrstuvwxyz';
      return Array.from({length: randomInt(6,10)}, () => chars[randomInt(0, chars.length-1)]).join('') + randomInt(1,99);
    },

    age() {
      return String(randomInt(18, 65));
    },

    birthday() {
      const year = randomInt(1960, 2005);
      const month = String(randomInt(1,12)).padStart(2,'0');
      const day = String(randomInt(1,28)).padStart(2,'0');
      return `${year}-${month}-${day}`;
    },

    date() {
      return randomDate();
    },

    url() {
      return `https://www.${randomItem(['example','test','demo','site'])}${randomInt(1,99)}.com`;
    },

    ip() {
      return `${randomInt(1,255)}.${randomInt(0,255)}.${randomInt(0,255)}.${randomInt(1,254)}`;
    },

    idCard() {
      const areaCodes = ['110101','110102','310101','310104','440103','440305','500103','510104','420106','330102'];
      const area = randomItem(areaCodes);
      const year = String(randomInt(1970, 2005));
      const month = String(randomInt(1,12)).padStart(2,'0');
      const day = String(randomInt(1,28)).padStart(2,'0');
      const seq = String(randomInt(1,999)).padStart(3,'0');
      const base = area + year + month + day + seq;
      const weights = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
      const checkChars = '10X98765432';
      let sum = 0;
      for (let i = 0; i < 17; i++) sum += parseInt(base[i]) * weights[i];
      return base + checkChars[sum % 11];
    },

    gender() {
      return isZh ? randomItem(['男','女']) : randomItem(['Male','Female']);
    },

    education() {
      if (isZh) return randomItem(['高中','大专','本科','硕士','博士']);
      return randomItem(['High School','Associate','Bachelor','Master','PhD']);
    },

    job() {
      if (isZh) return randomItem(['软件工程师','产品经理','设计师','测试工程师','运营专员','市场经理','销售代表','HR专员','财务会计','行政助理']);
      return randomItem(['Software Engineer','Product Manager','Designer','QA Engineer','Marketing Manager','Sales Representative','HR Specialist']);
    },

    salary() {
      return String(randomInt(5000, 50000));
    },

    amount() {
      return String(randomInt(1, 100));
    },

    price() {
      return (Math.random() * 9999).toFixed(2);
    },

    desc() {
      if (isZh) return randomItem([
        '这是一段测试描述文本，用于演示表单填充功能。',
        '用户需要填写此字段以完成注册流程。',
        '请提供您的详细信息以便我们更好地为您服务。',
        '此信息将用于账户验证和安全检查。',
        '感谢您的配合，我们会保护您的隐私。'
      ]);
      return randomItem([
        'This is a test description for form filling demonstration.',
        'Please provide your details to complete the registration.',
        'Your information will be used for account verification.',
        'Thank you for your cooperation. We value your privacy.',
        'This field is required for account activation.'
      ]);
    },

    select() {
      return null; // 下拉框特殊处理
    },

    checkbox() {
      return true;
    },

    radio() {
      return null; // radio 特殊处理
    },

    bankCard() {
      const bankNames = Object.keys(BANK_CARD_BINS);
      return generateBankCardNumber(randomItem(bankNames));
    },

    bankArea() {
      return randomItem(Object.keys(BANK_DATA));
    },

    bankName() {
      const allBanks = Object.keys(BANK_CARD_BINS);
      return randomItem(allBanks);
    },

    bankBranch() {
      const area = randomItem(Object.keys(BANK_DATA));
      const banks = Object.keys(BANK_DATA[area]);
      const bank = randomItem(banks);
      const branches = BANK_DATA[area][bank];
      return randomItem(branches);
    },
  };

  const gen = generators[fieldType];
  return gen ? gen() : (isZh ? '测试数据' : 'Test Data');
}

// 为一组已识别的字段生成完整数据（支持关联分组一致性）
function generateBatchData(fields, locale = 'zh_CN', customMappings = {}, groups = []) {
  const result = {};
  const isZh = locale === 'zh_CN' || locale === 'random' && Math.random() > 0.5;

  // 收集各类型字段
  const typeMap = {};
  for (const field of fields) {
    typeMap[field.inferredType] = field;
  }

  // === 身份信息一致性 ===
  // 姓名 → 姓、名 → 性别 → 身份证号（含生日）→ 年龄
  const lastName = isZh ? randomItem(CHINESE_LAST_NAMES) : randomItem(ENGLISH_LAST_NAMES);
  const firstName = isZh ? randomItem(CHINESE_FIRST_NAMES) : randomItem(ENGLISH_FIRST_NAMES);
  const fullName = isZh ? (lastName + firstName) : (firstName + ' ' + lastName);
  const gender = isZh ? randomItem(['男', '女']) : randomItem(['Male', 'Female']);
  const genderMale = gender === '男' || gender === 'Male';

  // 生成身份证号（含与性别和生日一致的校验）
  const areaCodes = ['110101','110102','310101','310104','440103','440305','500103','510104','420106','330102'];
  const idArea = randomItem(areaCodes);
  const birthYear = String(randomInt(1970, 2005));
  const birthMonth = String(randomInt(1,12)).padStart(2,'0');
  const birthDay = String(randomInt(1,28)).padStart(2,'0');
  // 身份证第17位：奇数=男，偶数=女
  const genderSeq = genderMale ? randomInt(0,4) * 2 + 1 : randomInt(0,4) * 2 + 2;
  const idSeq = String(genderSeq).padStart(3, '0');
  const idBase = idArea + birthYear + birthMonth + birthDay + idSeq;
  const weights = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
  const checkChars = '10X98765432';
  let idSum = 0;
  for (let i = 0; i < 17; i++) idSum += parseInt(idBase[i]) * weights[i];
  const idCard = idBase + checkChars[idSum % 11];
  const birthday = `${birthYear}-${birthMonth}-${birthDay}`;
  const currentYear = new Date().getFullYear();
  const age = String(currentYear - parseInt(birthYear));

  // === 地址链一致性 ===
  const province = isZh ? randomItem(CHINESE_PROVINCES) : randomItem(ENGLISH_STATES);
  const city = isZh ? randomItem(CHINESE_CITIES) : randomItem(ENGLISH_CITIES);
  const zipcode = isZh ? String(randomInt(100000, 999999)) : String(randomInt(10000, 99999));
  const address = isZh
    ? `${province}${city}${randomItem(CHINESE_STREETS)}${randomInt(1,999)}号`
    : `${randomInt(1,9999)} ${randomItem(ENGLISH_STREETS)}, ${city}, ${province}`;

  // === 银行链一致性 ===
  const bankAreaField = fields.find(f => f.inferredType === 'bankArea');
  const bankNameField = fields.find(f => f.inferredType === 'bankName');
  const bankBranchField = fields.find(f => f.inferredType === 'bankBranch');

  let bankAreaValue = null;
  let bankNameValue = null;
  let bankBranchValue = null;
  let bankNameForCard = null;

  if (bankAreaField || bankNameField || bankBranchField) {
    const areas = Object.keys(BANK_DATA);
    bankAreaValue = bankAreaField ? (bankAreaField.options?.length > 0
      ? randomItem(bankAreaField.options.map(o => o.value || o.text))
      : randomItem(areas)) : randomItem(areas);

    const banks = Object.keys(BANK_DATA[bankAreaValue] || {});
    bankNameValue = bankNameField ? (bankNameField.options?.length > 0
      ? randomItem(bankNameField.options.map(o => o.value || o.text))
      : randomItem(banks)) : randomItem(banks);

    const branches = BANK_DATA[bankAreaValue]?.[bankNameValue] || [];
    bankBranchValue = bankBranchField ? (bankBranchField.options?.length > 0
      ? randomItem(bankBranchField.options.map(o => o.value || o.text))
      : randomItem(branches) || `${bankNameValue}支行`) : randomItem(branches) || `${bankNameValue}支行`;

    bankNameForCard = bankNameValue;
  }

  // === 联系方式一致性（邮箱前缀与姓名关联）===
  const emailPrefix = isZh
    ? (lastName + firstName).toLowerCase()
    : (firstName + lastName).toLowerCase();
  const emailDomain = randomItem(['example.com','test.com','demo.com','mail.com']);
  const emailValue = `${emailPrefix}${randomInt(1,99)}@${emailDomain}`;

  // === 公司信息一致性 ===
  const companyValue = isZh
    ? `${randomItem(CHINESE_COMPANY_PREFIXES)}${randomItem(CHINESE_COMPANY_SUFFIXES)}`
    : `${randomItem(ENGLISH_COMPANY_PREFIXES)} ${randomItem(ENGLISH_COMPANY_SUFFIXES)}`;

  // 一致性字段映射表：如果某个 inferredType 有预生成的一致性值，则使用
  const consistentValues = {
    name: fullName,
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    idCard: idCard,
    birthday: birthday,
    age: age,
    province: province,
    city: city,
    address: address,
    zipcode: zipcode,
    email: emailValue,
    company: companyValue,
  };

  for (const field of fields) {
    const mappingKey = Object.keys(customMappings).find(key =>
      (field.name && field.name.includes(key)) ||
      (field.id && field.id.includes(key)) ||
      (field.placeholder && field.placeholder.includes(key)) ||
      (field.label && field.label.includes(key))
    );

    if (mappingKey) {
      result[field.key] = generateData(customMappings[mappingKey], locale, customMappings[mappingKey]);
    } else if (field.inferredType === 'bankCard') {
      result[field.key] = generateBankCardNumber(bankNameForCard || '工商银行');
    } else if (field.inferredType === 'bankArea') {
      result[field.key] = bankAreaValue;
    } else if (field.inferredType === 'bankName') {
      result[field.key] = bankNameValue;
    } else if (field.inferredType === 'bankBranch') {
      result[field.key] = bankBranchValue;
    } else if (consistentValues[field.inferredType]) {
      // 使用一致性预生成值
      result[field.key] = consistentValues[field.inferredType];
    } else {
      result[field.key] = generateData(field.inferredType, locale);
    }
  }
  return result;
}

// 暴露到全局，供 formFiller.js 调用
self.generateData = generateData;
self.generateBatchData = generateBatchData;


// --- content/detectors/formDetector.js ---
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


// --- content/fillers/formFiller.js ---
// content/fillers/formFiller.js - 表单填充器

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 填充单个字段
async function fillField(field, value) {
  const element = typeof field === 'object' ? field.element : field;

  if (!element) {
    console.warn('[AutoData] Field element not found');
    return false;
  }

  const tagName = (element.tagName || '').toLowerCase();
  const type = (element.type || 'text').toLowerCase();

  // Vant UI 特殊处理
  if (field.uiLib === 'vant') {
    if (field.isVantDatePicker) {
      return await fillVantDatePicker(element, value);
    }
    if (field.isVantAreaPicker) {
      return await fillVantAreaPicker(element, value);
    }
  }

  try {
    if (tagName === 'input') {
      await fillInput(element, value, type);
    } else if (tagName === 'textarea') {
      await fillTextarea(element, value);
    } else if (tagName === 'select') {
      await fillSelect(element, value);
    } else if (element.getAttribute('contenteditable') === 'true') {
      await fillContentEditable(element, value);
    }
    return true;
  } catch (error) {
    console.error('[AutoData] Fill error:', error);
    return false;
  }
}

// 填充 input 元素
async function fillInput(input, value, type) {
  if (type === 'checkbox') {
    input.checked = true;
    dispatchEvent(input, 'change');
    return;
  }
  if (type === 'radio') {
    input.checked = true;
    dispatchEvent(input, 'change');
    return;
  }

  if (value === null || value === undefined) return;

  input.focus();

  // 清除现有值
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));

  // 设置新值
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(input, value);
  } else {
    input.value = value;
  }

  // 触发事件
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();
}

// 填充 textarea
async function fillTextarea(textarea, value) {
  if (value === null || value === undefined) return;

  textarea.focus();
  textarea.value = '';
  textarea.dispatchEvent(new Event('input', { bubbles: true }));

  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(textarea, value);
  } else {
    textarea.value = value;
  }

  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.dispatchEvent(new Event('change', { bubbles: true }));
  textarea.blur();
}

// 填充 select 下拉框
async function fillSelect(select, value) {
  const options = select.options;
  if (!options || options.length === 0) return;

  if (value === null || value === undefined) {
    const startIndex = options[0].value === '' || options[0].textContent.trim() === '' ? 1 : 0;
    if (startIndex < options.length) {
      const randomIndex = startIndex + Math.floor(Math.random() * (options.length - startIndex));
      select.selectedIndex = randomIndex;
      dispatchEvent(select, 'change');
    }
    return;
  }

  let matched = false;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value || options[i].textContent.trim() === value) {
      select.selectedIndex = i;
      matched = true;
      break;
    }
  }

  if (!matched) {
    const startIndex = options[0].value === '' || options[0].textContent.trim() === '' ? 1 : 0;
    if (startIndex < options.length) {
      const randomIndex = startIndex + Math.floor(Math.random() * (options.length - startIndex));
      select.selectedIndex = randomIndex;
    }
  }

  dispatchEvent(select, 'change');
}

// 填充 Vant 日期选择器
async function fillVantDatePicker(input, value) {
  try {
    // 找到点击触发器（通常是 .van-cell 或 .value）
    const vanCell = input.closest('.van-cell');
    const valueContainer = vanCell?.querySelector('.value');
    const arrowOutside = vanCell?.querySelector('.arrow-right-outside');

    // 点击触发器打开日期选择器
    if (arrowOutside) {
      arrowOutside.click();
    } else if (valueContainer) {
      valueContainer.click();
    } else if (vanCell) {
      vanCell.click();
    }

    // 等待日期选择器弹出
    await delay(500);

    // 查找日期选择器弹出层
    const picker = document.querySelector('.van-picker, .van-popup.van-popup--bottom');

    if (picker) {
      // 查找确认按钮并点击
      const confirmBtn = picker.querySelector('.van-picker__confirm, .van-button.van-button--primary');
      if (confirmBtn) {
        // 先尝试设置日期值
        await setVantDateValue(value);
        await delay(200);
        confirmBtn.click();
        await delay(200);
        return true;
      }
    }

    // 如果没有找到确认按钮，说明可能是 Vant 的日期选择器组件
    // 尝试直接操作 picker
    await setVantDateValue(value);
    return true;

  } catch (error) {
    console.error('[AutoData] Vant date picker error:', error);
    return false;
  }
}

// 设置 Vant 日期选择器的值
async function setVantDateValue(value) {
  if (!value) {
    value = '2025-01-01';
  }

  // 解析日期
  const dateMatch = value.match(/(\d{4})[-/]?(\d{2})[-/]?(\d{2})?/);
  if (!dateMatch) {
    value = '2025-01-01';
  }

  const pickerColumns = document.querySelectorAll('.van-picker-column');
  if (pickerColumns.length >= 3) {
    // 年、月、日选择器
    const year = dateMatch ? dateMatch[1] : '2025';
    const month = dateMatch ? dateMatch[2] : '01';
    const day = dateMatch ? (dateMatch[3] || '01') : '01';

    // 点击列来选择值
    await scrollToValue(pickerColumns[0], year);
    await delay(100);
    await scrollToValue(pickerColumns[1], month);
    await delay(100);
    await scrollToValue(pickerColumns[2], day);
    await delay(100);
  }
}

// 在 Vant picker 列中滚动到指定值
async function scrollToValue(column, value) {
  const options = column.querySelectorAll('.van-ellipsis, .van-picker-column__item');
  for (const opt of options) {
    if (opt.textContent.includes(value)) {
      opt.click();
      return true;
    }
  }
  // 如果没找到，点击中间选项
  if (options.length > 0) {
    options[Math.floor(options.length / 2)].click();
  }
  return false;
}

// 填充 Vant 地区选择器
async function fillVantAreaPicker(input, value) {
  try {
    const vanCell = input.closest('.van-cell');
    const arrowOutside = vanCell?.querySelector('.arrow-right-outside');

    // 点击触发器打开地区选择器
    if (arrowOutside) {
      arrowOutside.click();
    } else if (vanCell) {
      vanCell.click();
    }

    await delay(500);

    // 查找地区选择器弹出层
    const picker = document.querySelector('.van-area-picker, .van-popup.van-popup--bottom');

    if (picker) {
      const confirmBtn = picker.querySelector('.van-picker__confirm, .van-button.van-button--primary');
      if (confirmBtn) {
        // 选择随机地区
        await selectRandomArea(picker);
        await delay(200);
        confirmBtn.click();
        await delay(200);
        return true;
      }
    }

    return true;
  } catch (error) {
    console.error('[AutoData] Vant area picker error:', error);
    return false;
  }
}

// 选择随机地区
async function selectRandomArea(picker) {
  const columns = picker.querySelectorAll('.van-picker-column');
  for (const column of columns) {
    const options = column.querySelectorAll('.van-ellipsis, .van-picker-column__item');
    if (options.length > 1) {
      // 跳过第一项（通常是"请选择"）
      const randomIndex = 1 + Math.floor(Math.random() * (options.length - 1));
      options[randomIndex].click();
      await delay(200);
    }
  }
}

// 填充 contenteditable 元素
async function fillContentEditable(div, value) {
  if (value === null || value === undefined) return;

  div.focus();
  div.innerHTML = '';
  div.textContent = value;
  dispatchEvent(div, 'input');
  div.blur();
}

// 分发事件
function dispatchEvent(element, eventType) {
  element.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event(`react:${eventType}`, { bubbles: true, cancelable: true }));
}

// 批量填充
async function fillFields(fields, data, delayMs = 200) {
  const results = [];

  for (const field of fields) {
    const value = data[field.key];
    if (value !== undefined && value !== null) {
      const success = await fillField(field, value);
      results.push({ field: field.key, success, value });
      if (delayMs > 0) await delay(delayMs);
    }
  }

  return results;
}

// 填充所有检测到的字段
async function fillAllFields(fields, locale, customMappings) {
  const results = [];

  for (const field of fields) {
    let value;

    // 1. 先检查自定义映射
    const mappingKey = Object.keys(customMappings || {}).find(key =>
      (field.name && field.name.includes(key)) ||
      (field.id && field.id.includes(key)) ||
      (field.placeholder && field.placeholder.includes(key)) ||
      (field.label && field.label.includes(key))
    );

    if (mappingKey) {
      value = self.generateData(customMappings[mappingKey], locale, customMappings[mappingKey]);
    } else {
      value = self.generateData(field.inferredType, locale);
    }

    if (value !== null && value !== undefined) {
      const success = await fillField(field, value);
      results.push({ field: field.key, label: field.label || field.name, success, value });
    }

    await delay(200);
  }

  return results;
}

// 清除所有字段值
async function clearAllFields(fields) {
  const results = [];

  for (const field of fields) {
    const el = field.element;
    if (el) {
      if (el.tagName === 'INPUT' && el.type === 'checkbox') {
        el.checked = false;
        dispatchEvent(el, 'change');
      } else if (el.tagName === 'INPUT' && el.type === 'radio') {
        el.checked = false;
        dispatchEvent(el, 'change');
      } else {
        el.value = '';
        dispatchEvent(el, 'input');
        dispatchEvent(el, 'change');
      }
      results.push({ field: field.key, success: true });
    }
  }

  return results;
}

// 暴露给全局
self.fillField = fillField;
self.fillFields = fillFields;
self.fillAllFields = fillAllFields;
self.clearAllFields = clearAllFields;


// --- content/content-script.js ---
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


})();