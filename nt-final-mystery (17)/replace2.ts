import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/<button[^>]*onClick={onClose}[^>]*className="absolute bottom-6 left-6 w-\[50px\] h-\[50px\][^>]*>[\s\S]*?<\/button>/g, '<ReturnButton onClick={onClose} />');
fs.writeFileSync('src/App.tsx', content);
