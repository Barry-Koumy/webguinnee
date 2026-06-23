const fs = require('fs');
const path = require('path');

// Comptes réels par catégorie (calculés)
const catCounts = {
  '_racine':     5,
  'bibliotheque': 862,
  'campboiro':   0,
  'colonial':    18,
  'courier':     4,
  'ctsai_erfj':  1,
  'culture':     69,
  'economie':    17,
  'islamique':   52,
  'Memoriam':    62,
  'pas':         58,
};

// 1. Supprimer les liens auto-référentiels dans courier et ctsai_erfj
function removeSelfLink(indexPath) {
  let html = fs.readFileSync(indexPath, 'utf8');
  const selfHref = indexPath.replace(/\\/g, '/').replace('public', '').replace('//','/')
    .replace(/^([^/])/, '/$1');
  // Supprimer tout <li>...<a href="...index.html ou selfHref...">...</a></li> qui pointe sur soi-même
  const liPattern = /<li>[\s\S]*?<a href="([^"]+)"[\s\S]*?<\/a>[\s\S]*?<\/li>/g;
  let changed = false;
  const newHtml = html.replace(liPattern, (match, href) => {
    // auto-lien si href = chemin de l'index lui-même
    const resolvedTarget = path.resolve(path.dirname(indexPath), href);
    const resolvedSelf = path.resolve(indexPath);
    if (resolvedTarget === resolvedSelf) {
      changed = true;
      return '';
    }
    // Aussi supprimer si href absolu === chemin /archives/cat/index.html
    const absSelf = '/' + indexPath.replace(/\\/g, '/').replace('public/', '');
    if (href === absSelf) {
      changed = true;
      return '';
    }
    return match;
  });
  if (changed) {
    fs.writeFileSync(indexPath, newHtml);
    console.log('Auto-lien supprimé: ' + indexPath);
  }
}

removeSelfLink('../archives-build/courier/index.html');
removeSelfLink('../archives-build/ctsai_erfj/index.html');

// 2. Mettre à jour les compteurs dans les index de catégorie
for (const [cat, count] of Object.entries(catCounts)) {
  const idxPath = path.join('../archives-build', cat, 'index.html');
  if (!fs.existsSync(idxPath)) continue;
  let html = fs.readFileSync(idxPath, 'utf8');

  // Remplacer le compteur dans le hero (<p>X documents</p> ou <p>Aucun document...</p>)
  const label = count === 0 ? 'Aucun document disponible' : count + ' documents';
  const newHtml = html
    .replace(/<p>\d+ documents<\/p>/, '<p>' + label + '</p>')
    .replace(/<p>Aucun document disponible<\/p>/, '<p>' + label + '</p>');

  if (newHtml !== html) {
    fs.writeFileSync(idxPath, newHtml);
    console.log('Compteur mis a jour: ' + cat + ' → ' + label);
  }
}

// 3. Mettre à jour le master index
const masterPath = '../archives-build/index.html';
let master = fs.readFileSync(masterPath, 'utf8');
const total = Object.values(catCounts).reduce((a, b) => a + b, 0);
const nbCats = Object.entries(catCounts).filter(([,n]) => n > 0).length;

// Mettre à jour les compteurs des cartes dans le master
for (const [cat, count] of Object.entries(catCounts)) {
  const label = count === 0 ? 'Aucun document disponible' : count + ' documents';
  // Chercher par url de catégorie
  master = master.replace(
    new RegExp('(href="/archives/' + cat + '/index\\.html"[\\s\\S]*?<div[^>]*>)([^<]+)(</div>\\s*</a>)'),
    (m, pre, old, post) => pre + label + post
  );
}

// Mettre à jour les stats globales
master = master.replace(/<div class="stat-n">\d+<\/div><div class="stat-l">Documents/, '<div class="stat-n">' + total + '</div><div class="stat-l">Documents');
master = master.replace(/<div class="stat-n">\d+<\/div><div class="stat-l">Catégories/, '<div class="stat-n">11</div><div class="stat-l">Catégories');

fs.writeFileSync(masterPath, master);
console.log('\nMaster index: ' + total + ' documents total');
