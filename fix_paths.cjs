const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/**/*.{vue,js}', { ignore: ['src/config/index.js', 'src/api/index.js'] });

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('import { CONFIG }')) {
        const dir = path.dirname(file);
        // Normalize path and split
        const parts = dir.split(/[\\\/]/);
        // We are at 'src/folders/file.vue'
        // From frontend root: file is 'src/folders/file.vue'
        // dirname is 'src/folders'
        // To get to 'src/config/index.js'
        // If dirname is 'src/stores', parts = ['src', 'stores']. Need '../config/index.js'
        // If dirname is 'src/views/profile', parts = ['src', 'views', 'profile']. Need '../../config/index.js'
        
        const levelsFromSrc = parts.length - 1;
        let relativeToSrc = '../'.repeat(levelsFromSrc);
        if (!relativeToSrc) relativeToSrc = './';
        const correctedPath = relativeToSrc + 'config/index.js';
        
        content = content.replace(/import { CONFIG } from '.*config\/index\.js';/g, "import { CONFIG } from '" + correctedPath + "';");
        fs.writeFileSync(file, content);
    }
}
console.log('Done path fixing');
