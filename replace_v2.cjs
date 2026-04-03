const fs = require('fs');
const path = require('path');

const files = [
  'src/views/Wishlist.vue',
  'src/views/Settings.vue',
  'src/views/profile/PublicProfile.vue',
  'src/views/profile/MyOrders.vue',
  'src/views/Orders.vue',
  'src/views/DetailProduit.vue',
  'src/views/Dashboard.vue',
  'src/views/Blogs.vue',
  'src/stores/products.js',
  'src/stores/messages.js',
  'src/components/Header.vue',
  'src/api/index.js'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure CONFIG is imported in .vue files if we are using it
  if (file.endsWith('.vue') || file.endsWith('.js')) {
    if (!content.includes('import { CONFIG }') && !file.includes('config/index.js') && !file.includes('api/index.js')) {
      // Add import after other imports
      content = content.replace(/import {/, "import { CONFIG } from '@/config/index.js';\nimport {");
      // If no import { exists, try after first import
      if (!content.includes('CONFIG }')) {
         content = content.replace(/import .*\n/, (match) => match + "import { CONFIG } from '@/config/index.js';\n");
      }
    }
  }

  // Use @ if possible, but let's check relative path
  const depth = file.split('/').length - 1;
  const relPath = '../'.repeat(depth) + 'config/index.js';
  
  // Clean up existing import if it's there
  content = content.replace(/import { CONFIG } from '.*config\/index\.js';/g, '');
  
  // Add proper import
  if (file.endsWith('.vue')) {
      content = content.replace('<script setup>', `<script setup>\nimport { CONFIG } from '${relPath}';`);
  } else if (!file.includes('config/index.js') && !file.includes('api/index.js')) {
      content = "import { CONFIG } from '" + relPath + "';\n" + content;
  }

  // 2. Perform replacements
  // Storage URLs
  content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL \|\| ['"]http:\/\/localhost:8000\/?['"]/g, 'CONFIG.API_BASE_URL');
  content = content.replace(/\$\{import\.meta\.env\.VITE_API_BASE_URL \|\| ['"]http:\/\/localhost:8000['"]\}\/storage\//g, '${CONFIG.STORAGE_URL}');
  content = content.replace(/\(import\.meta\.env\.VITE_API_BASE_URL \|\| "http:\/\/localhost:8000"\) \+ "\/storage\/"/g, 'CONFIG.STORAGE_URL');
  
  // Single quotes variants
  content = content.replace(/\$\{import\.meta\.env\.VITE_API_BASE_URL \|\| 'http:\/\/localhost:8000'\}\/storage\//g, '${CONFIG.STORAGE_URL}');

  // Just generic replacement for the messy ones I created
  content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL/g, 'CONFIG.API_BASE_URL');

  // Specific fixes for the template literals
  content = content.replace(/`\${CONFIG\.STORAGE_URL}(.*)`/g, "CONFIG.STORAGE_URL + $1");
  // wait, \${CONFIG.STORAGE_URL} is already a string start.
  // if it was `${CONFIG.STORAGE_URL}${p.photos[0]}` it's valid.

  fs.writeFileSync(filePath, content);
}
console.log('Done replacement v2');
