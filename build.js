// build.js - 构建脚本
// 将源码打包为浏览器扩展可用格式

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = join(ROOT, 'dist');

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function read(file) {
  return readFileSync(join(ROOT, file), 'utf-8');
}

function build() {
  console.log('Building AutoData extension...');

  // 清理并创建 dist 目录
  ensureDir(join(DIST, 'content'));
  ensureDir(join(DIST, 'background'));
  ensureDir(join(DIST, 'popup'));
  ensureDir(join(DIST, 'icons'));
  ensureDir(join(DIST, 'styles'));
  ensureDir(join(DIST, '_locales', 'zh_CN'));
  ensureDir(join(DIST, '_locales', 'en'));

  // === 打包 content-script ===
  console.log('  Bundling content-script...');

  const contentScript = [
    '// === AutoData Content Script ===',
    '(function() {',
    '"use strict";',
    '',
    '// --- data/faker-data.js ---',
    read('data/faker-data.js'),
    '',
    '// --- content/detectors/formDetector.js ---',
    read('content/detectors/formDetector.js'),
    '',
    '// --- content/fillers/formFiller.js ---',
    read('content/fillers/formFiller.js'),
    '',
    '// --- content/content-script.js ---',
    read('content/content-script.js'),
    '',
    '})();',
  ].join('\n');

  writeFileSync(join(DIST, 'content', 'content-script.js'), contentScript);

  // === 打包 background service-worker ===
  console.log('  Bundling background...');

  const backgroundScript = [
    '// === AutoData Background Service Worker ===',
    '(function() {',
    '"use strict";',
    read('background/service-worker.js'),
    '})();',
  ].join('\n');

  writeFileSync(join(DIST, 'background', 'service-worker.js'), backgroundScript);

  // === 复制 popup 文件 ===
  console.log('  Copying popup files...');
  writeFileSync(join(DIST, 'popup', 'popup.html'), read('popup/popup.html'));
  writeFileSync(join(DIST, 'popup', 'popup.css'), read('popup/popup.css'));
  writeFileSync(join(DIST, 'popup', 'popup.js'), read('popup/popup.js'));

  // === 复制样式 ===
  writeFileSync(join(DIST, 'styles', 'highlight.css'), read('styles/highlight.css'));

  // === 复制本地化文件 ===
  writeFileSync(join(DIST, '_locales', 'zh_CN', 'messages.json'), read('_locales/zh_CN/messages.json'));
  writeFileSync(join(DIST, '_locales', 'en', 'messages.json'), read('_locales/en/messages.json'));

  // === 生成 manifest.json ===
  const manifest = JSON.parse(read('manifest.json'));
  manifest.content_scripts[0].js = ['content/content-script.js'];
  manifest.background.service_worker = 'background/service-worker.js';
  delete manifest.background.type;
  writeFileSync(join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // === 生成图标 ===
  generateIcons();

  console.log('Build complete!');
  console.log('Load from: dist/ folder');
}

function generateIcons() {
  const sizes = [16, 32, 48, 128];
  sizes.forEach(size => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4CAF50"/>
          <stop offset="100%" stop-color="#2196F3"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size*0.18}" fill="url(#g)"/>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
            fill="white" font-family="Arial,sans-serif" font-weight="bold"
            font-size="${size*0.55}">A</text>
    </svg>`;
    writeFileSync(join(DIST, 'icons', `icon-${size}.svg`), svg);
  });

  // 更新 manifest 使用 svg
  const manifestPath = join(DIST, 'manifest.json');
  let manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  manifest.icons = {
    "16": `icons/icon-${16}.svg`,
    "32": `icons/icon-${32}.svg`,
    "48": `icons/icon-${48}.svg`,
    "128": `icons/icon-${128}.svg`,
  };
  manifest.action.default_icon = {
    "16": "icons/icon-16.svg",
    "32": "icons/icon-32.svg",
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

build();
