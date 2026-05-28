import fs from 'fs';
const code = fs.readFileSync('src/App.tsx', 'utf-8');
const images = Array.from(new Set([...code.matchAll(/https:\/\/(?:i\.postimg\.cc|media\.giphy\.com)[^\s"]+\.(?:png|gif|jpe?g)/g)].map(m => {
  let url = m[0];
  if (url.endsWith("'")) url = url.slice(0, -1);
  return url;
}))).sort();

const newPreload = `const PRELOAD_IMAGES = [\n${images.map(img => `  "${img}",`).join('\n')}\n];`;

const newCode = code.replace(/const PRELOAD_IMAGES = \[[^\]]*\];/, newPreload);
fs.writeFileSync('src/App.tsx', newCode, 'utf-8');
console.log('Updated PRELOAD_IMAGES in src/App.tsx');
