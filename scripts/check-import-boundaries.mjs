import fs from 'node:fs';
import path from 'node:path';

const clientRoot = path.resolve('src/client');
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const layerIndex = new Map(layers.map((layer, index) => [layer, index]));
const sourceExtensions = new Set(['.ts', '.tsx']);
const violations = [];

const walk = (directory) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
};

for (const file of walk(clientRoot).filter((item) => sourceExtensions.has(path.extname(item)))) {
  const relative = path.relative(clientRoot, file);
  const importerLayer = relative.split(path.sep)[0];
  const importerIndex = layerIndex.get(importerLayer);
  if (importerIndex === undefined) continue;

  const source = fs.readFileSync(file, 'utf8');
  const imports = [...source.matchAll(/from\s+['"]@client\/([^/'"]+)/g)].map((match) => match[1]);
  for (const importedLayer of imports) {
    const importedIndex = layerIndex.get(importedLayer);
    if (importedIndex === undefined) continue;
    if (importedIndex < importerIndex) {
      violations.push(`${relative}: ${importerLayer} must not import higher layer ${importedLayer}`);
    }
  }
}

if (violations.length > 0) {
  console.error('Client architecture boundary violations:\n' + violations.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log('Client import boundaries are valid.');
