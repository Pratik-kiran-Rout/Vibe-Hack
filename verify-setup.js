const fs = require('fs');
const path = require('path');

console.log('🔍 DevNote V2 Setup Verification\n');

// Check required files
const requiredFiles = [
  'package.json',
  'server/package.json',
  'client/package.json',
  'server/.env',
  'client/.env',
  'server/server.js',
  'client/src/App.tsx',
  'client/tailwind.config.js',
  'client/postcss.config.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log('✅', file);
  } else {
    console.log('❌', file, '(MISSING)');
    allFilesExist = false;
  }
});

console.log('\n📋 Environment Variables Check:');

// Check server .env
try {
  const serverEnv = fs.readFileSync(path.join(__dirname, 'server/.env'), 'utf8');
  const hasMongoUri = serverEnv.includes('MONGODB_URI');
  const hasJwtSecret = serverEnv.includes('JWT_SECRET');
  
  console.log(hasMongoUri ? '✅ MONGODB_URI configured' : '❌ MONGODB_URI missing');
  console.log(hasJwtSecret ? '✅ JWT_SECRET configured' : '❌ JWT_SECRET missing');
} catch (error) {
  console.log('❌ Cannot read server/.env file');
}

// Check client .env
try {
  const clientEnv = fs.readFileSync(path.join(__dirname, 'client/.env'), 'utf8');
  const hasApiUrl = clientEnv.includes('REACT_APP_API_URL');
  
  console.log(hasApiUrl ? '✅ REACT_APP_API_URL configured' : '❌ REACT_APP_API_URL missing');
} catch (error) {
  console.log('❌ Cannot read client/.env file');
}

console.log('\n🚀 Setup Status:');
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('✅ Ready to start development!');
  console.log('\nTo start the application:');
  console.log('1. Run: npm run install-all');
  console.log('2. Run: npm run dev');
  console.log('3. Or use: start-dev.bat');
} else {
  console.log('❌ Some files are missing. Please check the setup.');
}

console.log('\n📚 Quick Commands:');
console.log('npm run dev        - Start both frontend and backend');
console.log('npm run server     - Start backend only');
console.log('npm run client     - Start frontend only');
console.log('npm run install-all - Install all dependencies');