import { cp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildRoot = join(projectRoot, 'dist');

// GitHub Pages is currently configured to publish the repository root.
// Mirror the Vite production output there while keeping source files in src/.
for (const entry of await readdir(buildRoot, { withFileTypes: true })) {
  const source = join(buildRoot, entry.name);
  const destination = join(projectRoot, entry.name);
  await cp(source, destination, { recursive: true, force: true });
}

console.log('Synced the production site into the repository root for branch-based GitHub Pages.');
