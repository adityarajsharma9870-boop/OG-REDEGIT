import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');
const clientPath = path.join(distPath, 'client');
const serverPath = path.join(distPath, 'server');
const assetsPath = path.join(distPath, 'assets');

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

  // Generate proper index.html with correct asset references
  if (fs.existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    console.log('Available asset files:', files);
    
    const mainJsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
    const cssFile = files.find(f => f.endsWith('.css'));

    console.log('Main JS:', mainJsFile, 'CSS:', cssFile);

    if (mainJsFile) {
      const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="UNA CHEATX - React + Vite Application"
    />
    <title>UNA CHEATX</title>
    ${cssFile ? `    <link rel="stylesheet" href="/OG-REDEGIT/assets/${cssFile}" />` : ''}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/OG-REDEGIT/assets/${mainJsFile}"></script>
  </body>
</html>`;

      fs.writeFileSync(path.join(distPath, 'index.html'), indexHtml);
      console.log(`✓ Generated index.html pointing to ${mainJsFile}`);
    } else {
      console.log('⚠ Could not find main JS file');
    }
  }

  console.log('✓ Post-build completed successfully');
} catch (error) {
  console.error('Post-build error:', error);
  process.exit(1);
}


