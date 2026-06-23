// Registre des livres de la bibliothèque intégrés au lecteur.
// Les métadonnées éditoriales (résumé, régions, thèmes, entités) sont curées ici ;
// le contenu des chapitres provient des JSON générés par scripts/extract-livre.mjs.
// Le contenu est chargé À LA DEMANDE (code-split par Vite via import.meta.glob).

import { livresGeneres } from './_generated.js'
import { withBase } from '../../utils/asset.js'

// Tous les JSON de contenu, chargés à la demande (1 chunk par livre)
const contentModules = import.meta.glob('./*.json')

// Fiches éditoriales CURÉES (1 entrée par œuvre) — priment sur les fiches générées
const livresCures = [
  {
    slug: 'atfdb',
    nbChapitres: 22,
    titre: 'A travers le Fouta-Diallon et le Bambouc',
    sousTitre: 'Soudan occidental',
    auteur: 'Ernest Noirot',
    auteurSlug: 'ernest-noirot',
    annee: '1882',
    editeur: 'Paris, Librairie Marpon et Flammarion — 248 p.',
    rubrique: 'Taariika',
    regions: ['Fouta Djallon', 'Basse Guinée'],
    cover: '/livres/atfdb/diplomatic_mission_1882.jpg',
    portrait: '/livres/atfdb/ernest-noirot-1851-1913-540-880.jpg',
    badge: 'RÉCIT',
    icon: '🧭',
    resume:
      "Récit de la mission envoyée en 1881 par le gouvernement français pour signer un traité de protectorat sur le Fouta-Djallon. Dirigée par le docteur Bayol et secondée par Noirot, l'expédition remonte du Rio Nunez jusqu'à Timbo, puis gagne le pays aurifère du Bambouc — une plongée dans le Fouta théocratique peu avant la conquête coloniale.",
    themes: ['Colonisation française', 'Islam & Foi', 'Institutions', 'Traditions'],
    lieux: ['fouta-djallon', 'timbo', 'fougoumba', 'labe', 'pita', 'timbi', 'rio-nunez', 'boke', 'tinguilinta', 'bambouc', 'paris'],
    personnages: ['ernest-noirot', 'bayol', 'mahamadou-saidou', 'ibrahima-sory', 'thierno-madiou', 'bokar-biro'],
  },
  {
    slug: 'harris_kfd',
    nbChapitres: 12,
    titre: 'The Kingdom of Fouta-Diallon',
    sousTitre: 'Une histoire de la théocratie peule (1965)',
    auteur: 'Joseph E. Harris',
    auteurSlug: 'joseph-harris',
    annee: '1965',
    editeur: 'Evanston, Illinois — Ph.D. Dissertation, 180 p.',
    rubrique: 'History',
    regions: ['Fouta Djallon'],
    cover: null,
    portrait: null,
    badge: 'HISTOIRE',
    icon: '📜',
    resume:
      "Première grande histoire universitaire du Fouta-Djallon, de l'origine et des migrations des Foula (Peuls) à l'établissement de la théocratie, puis au protectorat français de 1897. La thèse de Joseph E. Harris s'appuie sur des sources orales et le traité de protectorat, et inclut la liste des almamy et des chefs du Labé.",
    themes: ['Islam & Foi', 'Institutions', 'Colonisation française', 'Résistance'],
    lieux: ['fouta-djallon', 'timbo', 'fougoumba', 'labe'],
    personnages: ['joseph-harris', 'karamoko-alfa', 'ibrahima-sory'],
  },
  {
    slug: 'watt',
    nbChapitres: 10,
    titre: 'Journal de James Watt — Expédition à Timbo (1794)',
    sousTitre: 'Expedition to and from Timbo in 1794',
    auteur: 'James Watt',
    auteurSlug: 'james-watt',
    annee: '1794',
    editeur: "Éd. Bruce L. Mouser, University of Wisconsin-Madison, 1994 — 97 p.",
    rubrique: 'History',
    regions: ['Fouta Djallon', 'Basse Guinée'],
    cover: null, portrait: null, badge: 'JOURNAL', icon: '🧭',
    resume:
      "Journal de la première expédition anglaise documentée vers l'intérieur du Fouta-Djallon : parti de Sierra Leone début 1794, James Watt remonte par le Rio Nunez jusqu'à Timbo pour négocier le commerce avec les almamy. Un témoignage de premier ordre sur le Fouta pré-colonial, édité par Bruce L. Mouser.",
    themes: ['Exploration & commerce', 'Islam & Foi', 'Institutions'],
    lieux: ['fouta-djallon', 'timbo', 'labe', 'rio-nunez', 'sierra-leone'],
    personnages: ['james-watt'],
  },
  {
    slug: 'demougeot',
    nbChapitres: 10,
    titre: "Notes sur l'Organisation Politique et Administrative du Labé",
    sousTitre: 'Mémoires de l\'IFAN nº 6',
    auteur: 'Antoine Demougeot',
    auteurSlug: 'antoine-demougeot',
    annee: '1944',
    editeur: 'IFAN nº 6, Librairie Larose, Paris, 1944 — 84 p.',
    rubrique: 'Histoire',
    regions: ['Fouta Djallon'],
    cover: null, portrait: null, badge: 'ÉTUDE', icon: '📋',
    resume:
      "Étude descriptive de l'organisation politique et administrative de la province du Labé — la plus vaste et la plus peuplée du Fouta-Djallon — telle que la colonisation française l'a remodelée. Une source clé sur les structures de pouvoir peules (diiwe, chefferies) au début du XXᵉ siècle.",
    themes: ['Colonisation française', 'Institutions'],
    lieux: ['labe', 'fouta-djallon'],
    personnages: ['antoine-demougeot'],
  },
  {
    slug: 'pmarty_islam',
    nbChapitres: 15,
    titre: "L'Islam au Fouta-Djallon",
    sousTitre: 'Études sur l\'islam ouest-africain',
    auteur: 'Paul Marty',
    auteurSlug: 'paul-marty',
    annee: '1921',
    editeur: 'Éditions Ernest Leroux, Paris, 1921 — 588 p.',
    rubrique: 'Diina',
    regions: ['Fouta Djallon'],
    cover: null, portrait: null, badge: 'ISLAM', icon: '🕌',
    resume:
      "Enquête de terrain détaillée sur l'organisation sociale et religieuse de l'islam au Fouta-Djallon au tournant des XIXᵉ-XXᵉ siècles : confréries, écoles coraniques, mosquées, dignitaires religieux. L'ouvrage de référence de Paul Marty sur la théocratie peule.",
    themes: ['Islam & Foi', 'Institutions', 'Traditions'],
    lieux: ['fouta-djallon', 'timbo', 'labe', 'fougoumba'],
    personnages: ['paul-marty', 'karamoko-alfa'],
  },
  {
    slug: 'oreilly_gv',
    nbChapitres: 12,
    titre: "Gilbert Vieillard. Mon ami l'Africain",
    sousTitre: 'Un portrait par Patrick O\'Reilly',
    auteur: "Patrick O'Reilly",
    auteurSlug: 'patrick-oreilly',
    annee: '1942',
    editeur: 'Édition privée, Dijon, 1942 — 167 p.',
    rubrique: 'Bibliothèque',
    regions: ['Fouta Djallon'],
    cover: null, portrait: null, badge: 'BIOGRAPHIE', icon: '🪶',
    resume:
      "Portrait intime de Gilbert Vieillard (1899-1940), administrateur et ethnographe amoureux du monde peul, par son ami Patrick O'Reilly. Au fil des souvenirs (Mamou, Dalaba, Paris, Dakar) se dessine une figure attachante des études foula, disparue au combat en 1940.",
    themes: ['Ethnographie', 'Traditions'],
    lieux: ['mamou', 'dalaba', 'fouta-djallon', 'paris'],
    personnages: ['gilbert-vieillard', 'patrick-oreilly'],
  },
  {
    slug: 'tauxier_hpfd',
    nbChapitres: 8,
    titre: 'Mœurs et histoire des Peuls',
    sousTitre: 'Les Peuls du Fouta-Djallon (extraits)',
    auteur: 'Louis Tauxier',
    auteurSlug: 'louis-tauxier',
    annee: '1937',
    editeur: 'Payot, Paris, 1937',
    rubrique: 'Histoire',
    regions: ['Fouta Djallon'],
    cover: null, portrait: null, badge: 'HISTOIRE', icon: '📚',
    resume:
      "Étude historiographique de Louis Tauxier sur les Peuls : examen critique des sources et des renseignements disponibles jusqu'au début du XXᵉ siècle (notamment les synthèses de Guébhard et d'André Arcin) sur l'histoire du Fouta-Djallon et l'origine des Foulahs.",
    themes: ['Institutions', 'Colonisation française', 'Traditions'],
    lieux: ['fouta-djallon', 'labe', 'timbo'],
    personnages: ['louis-tauxier'],
  },
  {
    slug: 'bubakar_bokarbiro',
    nbChapitres: 5,
    titre: 'Bokar Biro, le dernier grand almamy du Fouta-Djallon',
    sousTitre: 'Collection Grandes Figures Africaines',
    auteur: 'Boubacar Barry',
    auteurSlug: 'boubacar-barry',
    annee: '',
    editeur: 'Éditions ABC (Paris-Dakar-Abidjan) — 92 p.',
    rubrique: 'Histoire',
    regions: ['Fouta Djallon'],
    cover: null, portrait: null, badge: 'BIOGRAPHIE', icon: '⚔️',
    resume:
      "Biographie et analyse du rôle historique de Bokar Biro, dernier almamy souverain du Fouta-Djallon, vaincu et tué par les Français à Poredaka en 1896. L'ouvrage situe sa chute dans le jeu des deux lignées Soriya et Alfaya et la pression coloniale.",
    themes: ['Résistance', 'Institutions', 'Colonisation française'],
    lieux: ['timbo', 'fougoumba', 'fouta-djallon'],
    personnages: ['boubacar-barry', 'bokar-biro'],
  },
  {
    slug: 'bik_cerno',
    nbChapitres: 24,
    titre: 'Cerno Abdourahmane Bah — Éléments biographiques',
    sousTitre: 'Une figure savante de Labé',
    auteur: 'Elhadj Ibrahima Kaba Bah',
    auteurSlug: 'ibrahima-kaba-bah',
    annee: '1998',
    editeur: 'Defte Cernoya, Labé, 1998 — 150 p.',
    rubrique: 'Culture',
    regions: ['Fouta Djallon'],
    cover: null, portrait: null, badge: 'BIOGRAPHIE', icon: '📿',
    resume:
      "Portrait biographique de Cerno Abdourahmane Bah, grand érudit, poète et théologien de Labé : enfance, formation auprès des maîtres du Fouta, vie dans la cité et rayonnement intellectuel. Un témoignage sur la culture islamique pular du XXᵉ siècle.",
    themes: ['Islam & Foi', 'Traditions', 'Ethnographie'],
    lieux: ['labe', 'diari', 'fouta-djallon'],
    personnages: ['cerno-abdourahmane', 'ibrahima-kaba-bah', 'tierno-aliou', 'gilbert-vieillard'],
  },
]

// Fusion : fiches curées + fiches générées (les curées priment, par slug)
const slugsCures = new Set(livresCures.map((l) => l.slug))
export const livres = [
  ...livresCures,
  ...livresGeneres.filter((g) => !slugsCures.has(g.slug)),
].map((l) => ({
  ...l,
  // Préfixe les chemins d'images par la base de déploiement (GitHub Pages)
  cover: withBase(l.cover),
  portrait: withBase(l.portrait),
}))

export const livreBySlug = Object.fromEntries(livres.map((l) => [l.slug, l]))

// Métadonnées seules (synchrone)
export function getLivre(slug) {
  return livreBySlug[slug] || null
}

// Contenu des chapitres (asynchrone, code-split via import.meta.glob)
export async function loadLivreContent(slug) {
  const loader = contentModules[`./${slug}.json`]
  if (!loader) return { chapitres: [], nbChapitres: 0 }
  const mod = await loader()
  const data = mod.default || mod
  return { chapitres: data.chapitres || [], nbChapitres: data.nbChapitres || 0 }
}
