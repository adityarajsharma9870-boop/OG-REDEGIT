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

  // Clean up old asset files (keep only the ones we'll reference)
  if (fs.existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    console.log('Cleaning up old asset bundles...');

    // Find the SMALLEST client-side bundle (exclude the SSR bundle which is 617KB)
    const mainJsFiles = files.filter(f => f.startsWith('index-') && f.endsWith('.js'));
    let mainJsFile = null;
    let smallestSize = Infinity;
    
    mainJsFiles.forEach(file => {
      const filePath = path.join(assetsPath, file);
      const size = fs.statSync(filePath).size;
      if (size < smallestSize) {
        smallestSize = size;
        mainJsFile = file;
      }
    });

    console.log('Client bundles found:', mainJsFiles.map(f => {
      const filePath = path.join(assetsPath, f);
      const size = fs.statSync(filePath).size;
      return `${f} (${(size / 1024).toFixed(1)}KB)`;
    }));
    console.log('Selected:', mainJsFile);

    // Get the latest of each other type
    const adminFiles = files.filter(f => f.startsWith('admin-') && f.endsWith('.js'));
    const cssFiles = files.filter(f => f.endsWith('.css'));
    const authFiles = files.filter(f => f.includes('auth.callback-') && f.endsWith('.js'));
    const brandFiles = files.filter(f => f.startsWith('brand-') && f.endsWith('.js'));
    const dashboardFiles = files.filter(f => f.startsWith('dashboard-') && f.endsWith('.js'));
    const loginFiles = files.filter(f => f.startsWith('login-') && f.endsWith('.js'));
    const otherFiles = files.filter(f => !['admin-', 'index-', 'auth.callback-', 'brand-', 'dashboard-', 'login-'].some(prefix => f.startsWith(prefix)) && !f.endsWith('.css') && f !== 'logo-mark-SLElYU2K.png');

    // Build the keep set
    const filesToKeep = new Set();
    
    if (mainJsFile) filesToKeep.add(mainJsFile);
    [adminFiles, cssFiles, authFiles, brandFiles, dashboardFiles, loginFiles].forEach(group => {
      if (group.length > 0) {
        filesToKeep.add(group[group.length - 1]);
      }
    });
    filesToKeep.add('logo-mark-SLElYU2K.png');
    otherFiles.forEach(f => filesToKeep.add(f));

    // Find all index files to be deleted and ones to keep
    const deletedIndexFiles = mainJsFiles.filter(f => f !== mainJsFile);
    
    // Before deleting, replace import statements in kept chunks
    if (deletedIndexFiles.length > 0 && mainJsFile) {
      console.log('Updating import references in kept chunks...');
      
      // Get all JS files that will be kept (excluding index files we're deleting)
      const keptJsFiles = Array.from(filesToKeep).filter(f => f.endsWith('.js') && !deletedIndexFiles.includes(f));
      
      keptJsFiles.forEach(jsFile => {
        const jsPath = path.join(assetsPath, jsFile);
        let content = fs.readFileSync(jsPath, 'utf8');
        let modified = false;
        
        // Replace all deleted index file references with the kept one
        deletedIndexFiles.forEach(deletedFile => {
          const regex = new RegExp(`"\./${deletedFile}"`, 'g');
          if (regex.test(content)) {
            content = content.replace(regex, `"./${mainJsFile}"`);
            modified = true;
            console.log(`  ✓ Updated imports in ${jsFile} (${deletedFile} → ${mainJsFile})`);
          }
        });
        
        // CRITICAL: Remove self-referential imports (e.g., index-ABC.js importing from "./index-ABC.js")
        // These cause circular dependencies and break the app
        if (jsFile.startsWith('index-') && jsFile.endsWith('.js')) {
          const selfRefRegex = new RegExp(`"\./${jsFile}"`, 'g');
          if (selfRefRegex.test(content)) {
            // Self-referential imports must be removed - they indicate broken chunk splitting
            content = content.replace(selfRefRegex, '');
            modified = true;
            console.log(`  ✓ Removed self-referential import in ${jsFile}`);
          }
        }
        
        if (modified) {
          fs.writeFileSync(jsPath, content, 'utf8');
        }
      });
    }

    // Delete old files not in the keep list
    files.forEach(file => {
      if (!filesToKeep.has(file)) {
        fs.unlinkSync(path.join(assetsPath, file));
        console.log(`  ✗ Removed ${file}`);
      }
    });
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



