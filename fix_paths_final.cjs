const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(filePath));
            }
        } else {
            if (filePath.endsWith('.vue') || filePath.endsWith('.js')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk('src');

for (const file of files) {
    if (file.includes('config' + path.sep + 'index.js')) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('import { CONFIG }')) {
        const parts = file.split(/[\\\/]/);
        const srcIndex = parts.indexOf('src');
        if (srcIndex === -1) continue;
        
        // stepsBack is the number of levels deep from src
        // e.g. path = src/views/Blogs.vue -> parts = ['src', 'views', 'Blogs.vue']
        // srcIndex = 0. length = 3. 
        // 3-1 = 2 (depth including file).
        // we want to reach src/config/index.js.
        // we are at src/views/. we need '../config/index.js'.
        // formula: levelsUnderSrc = (parts.length - 1) - (srcIndex + 1)
        // 3 - 1 - 1 = 1. -> '../'. Correct.
        
        const stepsBack = (parts.length - 1) - (srcIndex + 1);
        const relativeToSrc = '../'.repeat(stepsBack) || './';
        const correctedPath = relativeToSrc + 'config/index.js';
        
        const newContent = content.replace(/import { CONFIG } from '.*config\/index\.js';/g, "import { CONFIG } from '" + correctedPath + "';");
        if (newContent !== content) {
            console.log(`Fixed ${file} to ${correctedPath}`);
            fs.writeFileSync(file, newContent);
        }
    }
}
console.log('Done');
