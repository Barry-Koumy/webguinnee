// Gestion du chemin de base (GitHub Pages sert l'app sous /webguinnee/).
// import.meta.env.BASE_URL vaut '/webguinnee/' en prod, '/' en local.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '') // '/webguinnee' ou ''

// Préfixe un chemin absolu commençant par '/' avec la base de déploiement.
export function withBase(path) {
  if (!path || !path.startsWith('/')) return path
  return BASE + path
}

// Réécrit les chemins d'assets absolus (/livres/…) dans du HTML brut de chapitre,
// pour qu'ils pointent bien sous la base de déploiement.
export function rewriteHtmlAssets(html) {
  return html.replace(/(src|href)="\/livres\//g, `$1="${BASE}/livres/`)
}
