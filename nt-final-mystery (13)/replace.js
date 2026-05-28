import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/hover:scale-110 transition-transform/g, 'hover:scale-110 active:scale-95 transition-transform duration-100');
fs.writeFileSync('src/App.tsx', code);
console.log('Replaced successfully');
