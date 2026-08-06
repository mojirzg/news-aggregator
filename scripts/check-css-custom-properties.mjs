import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/client', import.meta.url));

const collectCssFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collectCssFiles(path);
      return extname(entry.name) === '.css' ? [path] : [];
    }),
  );
  return files.flat();
};

const files = await collectCssFiles(root);
const sources = await Promise.all(
  files.map(async (file) => ({ file, source: await readFile(file, 'utf8') })),
);

const defined = new Set();
for (const { source } of sources) {
  for (const match of source.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)) {
    defined.add(match[1]);
  }
}

const errors = [];
for (const { file, source } of sources) {
  for (const match of source.matchAll(/var\(\s*(--[a-z0-9-]+)([^)]*)\)/gim)) {
    const [, property, remainder] = match;
    const hasFallback = remainder.includes(',');
    if (!defined.has(property) && !hasFallback) {
      const line = source.slice(0, match.index).split('\n').length;
      errors.push(`${relative(process.cwd(), file)}:${line} ${property}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Undefined CSS custom properties:\n' + errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`CSS custom-property check passed (${files.length} files).`);
}
