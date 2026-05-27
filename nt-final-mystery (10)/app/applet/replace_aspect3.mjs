import fs from 'fs';

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace perspective utility classes
content = content.replace(/perspective-\[800px\]/g, 'perspective-[100cqw]');
content = content.replace(/perspective-1000/g, 'perspective-[100cqw]');
content = content.replace(/perspective-\[1000px\]/g, 'perspective-[100cqw]');

// Replace style perspective values
content = content.replace(/perspective:\s*'1000px'/g, "perspective: '100cqw'");
content = content.replace(/perspective:\s*1000/g, "perspective: '100cqw'");
content = content.replace(/perspective:\s*'1200px'/g, "perspective: '120cqw'");

content = content.replace(
  /style=\{\{ perspective: '100cqw' \}\}/,
  "style={{ perspective: '100cqw', containerType: 'size' }}"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
