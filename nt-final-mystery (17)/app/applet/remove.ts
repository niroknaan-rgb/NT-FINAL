import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace w-full h-full max-w-[calc(100vh*16/9)] max-h-[calc(100vw*9/16)] with w-full h-full
content = content.replace(/w-full h-full max-w-\[calc\(100vh\*16\/9\)\] max-h-\[calc\(100vw\*9\/16\)\]/g, 'w-full h-full');

fs.writeFileSync('src/App.tsx', content);
console.log('Removed 16:9 constraints from close-ups.');
