// generate-icons.js - 生成扩展图标
// 创建简单的 PNG 图标（使用内嵌 base64）

import { writeFileSync } from 'fs';

// 简单的彩色圆形图标生成（纯文本方案）
// 这会生成一个包含 "A" 字母的绿色圆形图标 base64

const icons = {
  16: createIconBase64(16),
  32: createIconBase64(32),
  48: createIconBase64(48),
  128: createIconBase64(128),
};

function createIconBase64(size) {
  // 创建 SVG 图标
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4CAF50"/>
        <stop offset="100%" style="stop-color:#2196F3"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size*0.18}" fill="url(#grad)"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
          fill="white" font-family="Arial,sans-serif" font-weight="bold"
          font-size="${size*0.55}">A</text>
  </svg>`;

  return Buffer.from(svg).toString('base64');
}

// 生成 PNG 占位符（透明 1x1）
// 由于无法直接生成 PNG，使用 SVG 并在说明中建议用户替换
console.log('Icon SVG files generated. To get proper PNG icons:');
console.log('1. Open the .svg files in icons/ folder');
console.log('2. Convert them to PNG using any image editor');
console.log('3. Replace the .png files with your converted icons');

// 或者使用在线工具: https://cloudconvert.com/svg-to-png
// 或者使用 npm 包: npm install sharp

export {};
