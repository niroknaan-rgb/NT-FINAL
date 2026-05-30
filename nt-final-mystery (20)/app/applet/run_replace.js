const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace standard perspective classes
content = content.replace(/perspective-\[800px\]/g, 'perspective-[100cqw]');
content = content.replace(/perspective-1000/g, 'perspective-[100cqw]');
content = content.replace(/perspective-\[1000px\]/g, 'perspective-[100cqw]');

// Replace style perspective values
content = content.replace(/perspective:\s*'1000px'/g, "perspective: '100cqw'");
content = content.replace(/perspective:\s*1000/g, "perspective: '100cqw'");
content = content.replace(/perspective:\s*'1200px'/g, "perspective: '120cqw'");

// Add containerType to App container
content = content.replace(
  /className="relative aspect-video w-\[95dvw\] max-w-\[calc\(95dvh\*16\/9\)\] max-h-\[95dvh\] bg-black overflow-hidden shadow-2xl rounded-lg" style=\{\{ perspective: '100cqw' \}\}/,
  'className="relative aspect-video w-[95dvw] max-w-[calc(95dvh*16/9)] max-h-[95dvh] bg-black overflow-hidden shadow-2xl rounded-lg @container" style={{ perspective: \\\'100cqw\\\' }}'
);
// note: wait, replacing perspective string earlier turned perspective: '1000px' into perspective: '100cqw'.
// So I will just replace the whole div.
content = content.replace(
  'className="relative aspect-video w-[95dvw] max-w-[calc(95dvh*16/9)] max-h-[95dvh] bg-black overflow-hidden shadow-2xl rounded-lg" style={{ perspective: \\\'100cqw\\\' }}',
  'className="relative aspect-video w-[95dvw] max-w-[calc(95dvh*16/9)] max-h-[95dvh] bg-black overflow-hidden shadow-2xl rounded-lg" style={{ perspective: \\\'100cqw\\\', containerType: \\\'size\\\' }}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated App.tsx');
