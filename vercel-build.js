import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Vercel build process...');

// Ensure we're in the right directory
process.chdir(__dirname);
console.log(`📂 Working directory: ${process.cwd()}`);

// Clean up previous build
console.log('🧹 Cleaning up previous build...');
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
} catch (error) {
  console.warn('⚠️  Could not clean dist directory:', error.message);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install --prefer-offline --no-audit --progress=false', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
} catch (error) {
  console.error('❌ Failed to install dependencies:', error);
  process.exit(1);
}

// Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      VITE_APP_VERSION: process.env.VERCEL_GIT_COMMIT_SHA || 'local'
    }
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Verify build output
console.log('🔍 Verifying build output...');
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error(`❌ Build output not found at: ${distPath}`);
  process.exit(1);
}

console.log('✨ Vercel build process completed successfully!');
