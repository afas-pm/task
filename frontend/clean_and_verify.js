import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const viteCache = path.resolve('node_modules/.vite');
if (fs.existsSync(viteCache)) {
    console.log('Removing .vite cache...');
    fs.rmSync(viteCache, { recursive: true, force: true });
}

console.log('Loading package.json...');
const pkg = require('./package.json');
console.log('Dependencies:', pkg.dependencies);
console.log('DevDependencies:', pkg.devDependencies);
