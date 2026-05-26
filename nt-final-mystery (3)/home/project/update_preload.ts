import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
const urls = [...content.matchAll(/https:\/\/(?:i\.postimg\.cc|media\.giphy\.com)[^"'\s]+\.(?:png|gif)/g)].map(m => m[0]);
const uniqueUrls = [...new Set(urls)];
const urlsStr = uniqueUrls.map(u => '  "' + u + '"').join(',\n');
const newArray = 'const PRELOAD_IMAGES = [\n' + urlsStr + '\n];';

content = content.replace(/const PRELOAD_IMAGES = \[[^\]]*\];/, newArray);
fs.writeFileSync('src/App.tsx', content);
console.log('Done replacing images! Total images:', uniqueUrls.length);
