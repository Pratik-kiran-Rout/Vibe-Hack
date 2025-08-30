const fs = require('fs');
const path = require('path');

console.log('🔍 DevNote V2 Setup Verification\n');

// Check if all required files exist
const requiredFiles = [
  'package.json',
  'server/package.json',
  'server/server.js',
  'server/.env',
  'client/package.json',
  'client/src/App.tsx',
  'client/src/index.tsx',
  'client/public/index.html'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log('✅', file);
  } else {
    console.log('❌', file, '(MISSING)');
    allFilesExist = false;
  }
});

console.log('\n📁 Project Structure:');
console.log('✅ Backend (Node.js/Express) - server/');
console.log('✅ Frontend (React/TypeScript) - client/');
console.log('✅ Unified package.json with scripts');

console.log('\n🚀 Quick Start Commands:');
console.log('1. npm run install-all  # Install all dependencies');
console.log('2. npm run dev          # Start both frontend and backend');
console.log('3. Or simply run:       start.bat');

console.log('\n🌐 Application URLs:');
console.log('Frontend: http://localhost:3000');
console.log('Backend:  http://localhost:5000');

console.log('\n👤 Demo Credentials:');
console.log('Admin: admin@devnote.com / password123');

if (allFilesExist) {
  console.log('\n🎉 Setup Complete! Ready to run the application.');
} else {
  console.log('\n⚠️  Some files are missing. Please check the setup.');
}

console.log('\n📝 Next Steps:');
console.log('1. Make sure MongoDB is running (local or Atlas)');
console.log('2. Update server/.env with your MongoDB URI');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000');