import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');
const clientPath = path.join(distPath, 'client');
const serverPath = path.join(distPath, 'server');

// Function to move all files from src to dest recursively
function moveFilesRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const files = fs.readdirSync(src);

  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile, { recursive: true });
      }
      moveFilesRecursive(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

try {
  console.log('Post-build: Restructuring dist directory for GitHub Pages...');

  // Move client files to root of dist
  if (fs.existsSync(clientPath)) {
    moveFilesRecursive(clientPath, distPath);
    // Remove the client directory
    fs.rmSync(clientPath, { recursive: true, force: true });
    console.log('✓ Moved client files to dist root');
  }

  // Remove the server directory (not needed for static hosting)
  if (fs.existsSync(serverPath)) {
    fs.rmSync(serverPath, { recursive: true, force: true });
    console.log('✓ Removed server directory');
  }

  console.log('✓ Post-build completed successfully');
} catch (error) {
  console.error('Post-build error:', error);
  process.exit(1);
}
