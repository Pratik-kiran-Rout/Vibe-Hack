const fs = require('fs');
const path = require('path');

console.log('🔍 DevNote V2 - Structure Verification\n');

const requiredFiles = [
  // Root files
  'package.json',
  'README.md',
  'GITHUB-SETUP.md',
  '.gitignore',
  
  // Server files
  'server/package.json',
  'server/.env.example',
  'server/server.js',
  'server/seed.js',
  'server/models/User.js',
  'server/models/Blog.js',
  'server/routes/auth.js',
  'server/routes/blogs.js',
  'server/routes/admin.js',
  'server/middleware/auth.js',
  'server/utils/email.js',
  'server/controllers/.gitkeep',
  
  // Client files
  'client/package.json',
  'client/.env.example',
  'client/tsconfig.json',
  'client/public/index.html',
  'client/src/index.tsx',
  'client/src/App.tsx',
  'client/src/types.ts',
  'client/src/components/Header.tsx',
  'client/src/components/BlogCard.tsx',
  'client/src/pages/Home.tsx',
  'client/src/pages/Login.tsx',
  'client/src/pages/AdminDashboard.tsx',
  'client/src/context/AuthContext.tsx',
  'client/src/data/.gitkeep',
  'client/src/services/.gitkeep',
  'client/src/utils/.gitkeep'
];

let allFilesExist = true;
let missingFiles = [];

console.log('📁 Checking file structure...\n');

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log('✅', file);
  } else {
    console.log('❌', file, '(MISSING)');
    allFilesExist = false;
    missingFiles.push(file);
  }
});

console.log('\n📊 Summary:');
console.log(`✅ Found: ${requiredFiles.length - missingFiles.length} files`);
console.log(`❌ Missing: ${missingFiles.length} files`);

if (allFilesExist) {
  console.log('\n🎉 All files present! Ready for Git commit.');
} else {
  console.log('\n⚠️ Missing files detected. Please check the structure.');
  console.log('\nMissing files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
}

console.log('\n📝 Next steps for GitHub users:');
console.log('1. git clone <repository>');
console.log('2. npm run install-all');
console.log('3. Copy .env.example files to .env');
console.log('4. npm run dev');