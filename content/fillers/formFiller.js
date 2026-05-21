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
