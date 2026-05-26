import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace w-full max-w-* aspect-video with w-full h-full max-w-[calc(100vh*16/9)] max-h-[calc(100vw*9/16)]
content = content.replace(/w-full max-w-[a-z0-9]+ aspect-video/g, 'w-full h-full max-w-[calc(100vh*16/9)] max-h-[calc(100vw*9/16)]');

fs.writeFileSync('src/App.tsx', content);
console.log('Replaced aspect-video containers.');
