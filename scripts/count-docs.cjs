const fs = require('fs');
const path = require('path');

function walk(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p));
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

const all = walk('../archives-build');

// Exclure master index et les cat/index.html directs
const docs = all.filter(f => {
  const rel = f.split(path.sep).slice(2).join('/'); // après ../archives-build/
  if (rel === 'index.html') return false;
  const parts = rel.split('/');
  if (parts.length === 2 && parts[1] === 'index.html') return false;
  return true;
});

console.log('Total documents: ' + docs.length);

const byCat = {};
for (const f of docs) {
  const rel = f.split(path.sep).slice(2).join('/');
  const cat = rel.split('/')[0];
  byCat[cat] = (byCat[cat] || 0) + 1;
}

for (const [cat, n] of Object.entries(byCat).sort()) {
  console.log('  ' + cat + ': ' + n);
}
