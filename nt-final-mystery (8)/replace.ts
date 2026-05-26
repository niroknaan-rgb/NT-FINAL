import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/<button onClick={onClose} className="absolute bottom-6 left-6 w-\[50px\] h-\[50px\] flex items-center justify-center p-0 text-white hover:bg-white\/10 rounded-full transition-all duration-300 z-50 bg-black\/50 backdrop-blur-sm border border-white\/20 shadow-lg">\s*<Undo2 size={24} \/>\s*<\/button>/g, '<ReturnButton onClick={onClose} />');
content = content.replace(/<button \s*onClick={onClose} \s*className="absolute bottom-6 left-6 w-\[50px\] h-\[50px\] flex items-center justify-center p-0 text-white hover:bg-white\/10 rounded-full transition-all duration-300 z-50 bg-black\/50 backdrop-blur-sm border border-white\/20 shadow-lg"\s*>\s*<Undo2 size={24} \/>\s*<\/button>/g, '<ReturnButton onClick={onClose} />');
fs.writeFileSync('src/App.tsx', content);
