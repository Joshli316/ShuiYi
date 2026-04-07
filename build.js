const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  // Bundle TypeScript
  await esbuild.build({
    entryPoints: ['src/app.ts'],
    bundle: true,
    outfile: 'dist/app.js',
    format: 'iife',
    target: 'es2020',
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
  });

  // Copy static files to dist
  const staticFiles = ['index.html', 'manifest.json'];
  for (const file of staticFiles) {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
    }
  }

  // Copy assets directory
  if (fs.existsSync('assets')) {
    copyDir('assets', path.join('dist', 'assets'));
  }

  // Copy service worker
  if (fs.existsSync('sw.js')) {
    fs.copyFileSync('sw.js', path.join('dist', 'sw.js'));
  }

  // Copy print CSS
  if (fs.existsSync('src/styles/print.css')) {
    fs.mkdirSync(path.join('dist', 'styles'), { recursive: true });
    fs.copyFileSync('src/styles/print.css', path.join('dist', 'styles', 'print.css'));
  }

  console.log('Build complete!');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
