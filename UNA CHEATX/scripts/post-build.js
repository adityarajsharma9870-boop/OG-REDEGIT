import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');
const clientPath = path.join(distPath, 'client');
const serverPath = path.join(distPath, 'server');
const assetsPath = path.join(distPath, 'assets');

// Helper to copy directory recursively
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Post-build: Restructuring dist directory for GitHub Pages...');

  let mainJsFile = null;

  // 1. First, check if manifest in serverPath identifies the root entry script
  if (fs.existsSync(serverPath)) {
    const serverAssetsPath = path.join(serverPath, 'assets');
    if (fs.existsSync(serverAssetsPath)) {
      const serverFiles = fs.readdirSync(serverAssetsPath);
      const manifestFile = serverFiles.find(f => f.startsWith('_tanstack-start-manifest'));
      if (manifestFile) {
        const manifestContent = fs.readFileSync(path.join(serverAssetsPath, manifestFile), 'utf8');
        const match = manifestContent.match(/__root__[\s\S]*?src:\s*"\/OG-REDEGIT\/assets\/(index-[^"]+\.js)"/);
        if (match && match[1]) {
          mainJsFile = match[1];
          console.log(`✓ Detected main entry script from manifest: ${mainJsFile}`);
        }
      }
    }
  }

  // 2. Move client files to dist root
  if (fs.existsSync(clientPath)) {
    copyDirRecursive(clientPath, distPath);
    fs.rmSync(clientPath, { recursive: true, force: true });
    console.log('✓ Moved client files to dist root');
  }

  // 3. Remove the server directory (not needed for static hosting)
  if (fs.existsSync(serverPath)) {
    fs.rmSync(serverPath, { recursive: true, force: true });
    console.log('✓ Removed server directory');
  }

  // 4. Verify/find the main JS and CSS files
  if (fs.existsSync(assetsPath)) {
    const assetFiles = fs.readdirSync(assetsPath);
    const indexFiles = assetFiles.filter(f => f.startsWith('index-') && f.endsWith('.js'));
    const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
    const cssFile = cssFiles.length > 0 ? cssFiles[0] : null;

    // Fallback detection if manifest wasn't read: find the index-*.js containing createRoot or largest size
    if (!mainJsFile || !fs.existsSync(path.join(assetsPath, mainJsFile))) {
      for (const f of indexFiles) {
        const content = fs.readFileSync(path.join(assetsPath, f), 'utf8');
        if (content.includes('createRoot')) {
          mainJsFile = f;
          break;
        }
      }

      // If still not found, pick the largest index-*.js (the main bundle contains react/router)
      if (!mainJsFile && indexFiles.length > 0) {
        indexFiles.sort((a, b) => {
          return fs.statSync(path.join(assetsPath, b)).size - fs.statSync(path.join(assetsPath, a)).size;
        });
        mainJsFile = indexFiles[0];
      }
    }

    console.log(`✓ Main JS entry: ${mainJsFile}`);
    console.log(`✓ CSS file: ${cssFile}`);

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
    ${cssFile ? `<link rel="stylesheet" href="/OG-REDEGIT/assets/${cssFile}" />` : ''}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/OG-REDEGIT/assets/${mainJsFile}"></script>
  </body>
</html>
`;

      fs.writeFileSync(path.join(distPath, 'index.html'), indexHtml, 'utf8');
      console.log('✓ Generated dist/index.html');

      // SPA fallback for GitHub Pages (handles sub-routes like /login, /dashboard)
      fs.writeFileSync(path.join(distPath, '404.html'), indexHtml, 'utf8');
      console.log('✓ Generated dist/404.html (SPA routing support)');

      // .nojekyll to prevent GitHub Pages from bypassing files with underscores
      fs.writeFileSync(path.join(distPath, '.nojekyll'), '', 'utf8');
      console.log('✓ Generated dist/.nojekyll');
    } else {
      console.error('⚠ Could not find main JS entry file!');
      process.exit(1);
    }
  }

  console.log('✓ Post-build completed successfully');
} catch (error) {
  console.error('Post-build error:', error);
  process.exit(1);
}
