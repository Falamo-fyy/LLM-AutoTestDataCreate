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
