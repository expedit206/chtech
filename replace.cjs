const fs = require('fs');
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
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace baseURL: 'http://localhost:8000/'
  content = content.replace(/baseURL:\s*'http:\/\/localhost:8000\/?'/g, "baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/'");

  // Replace "http://localhost:8000/storage/"
  content = content.replace(/"http:\/\/localhost:8000\/storage\/"/g, '(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000") + "/storage/"');

  // Replace `http://localhost:8000/storage/
  content = content.replace(/`http:\/\/localhost:8000\/storage\//g, "`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/");

  fs.writeFileSync(file, content);
}
console.log('Done replacement');
