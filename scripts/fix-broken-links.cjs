const fs = require('fs');
const path = require('path');

function findIndexes(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out.push(...findIndexes(p));
    else if (f === 'index.html') out.push(p);
  }
  return out;
}

const BASE = '../archives-build';
const indexes = findIndexes(BASE);
let totalFixed = 0;
let totalRemoved = 0;

for (const indexFile of indexes) {
  let html = fs.readFileSync(indexFile, 'utf8');
  const indexDir = path.dirname(indexFile);

  const liPattern = /<li>[\s\S]*?<a href="([^"]+)"[\s\S]*?<\/a>[\s\S]*?<\/li>/g;
  let changed = false;
  const newHtml = html.replace(liPattern, (match, href) => {
    if (href.startsWith('/') === false && href.startsWith('http') === false && href.startsWith('mailto') === false) {
      // lien relatif
      const targetPath = path.resolve(indexDir, href);
      if (!fs.existsSync(targetPath)) {
        changed = true;
        totalRemoved++;
        return '';
      }
      return match;
    }
    if (href.startsWith('/archives/')) {
      const targetPath = path.join('public', href);
      if (!fs.existsSync(targetPath)) {
        changed = true;
        totalRemoved++;
        return '';
      }
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(indexFile, newHtml);
    totalFixed++;
    const label = indexFile.replace('public' + path.sep + 'archives' + path.sep, '');
    console.log('Mis a jour: ' + label);
  }
}
console.log('\nTotal: ' + totalFixed + ' index mis a jour, ' + totalRemoved + ' liens supprimes');
