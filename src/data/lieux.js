// Lieux réels cités dans les livres de la bibliothèque.
// Chaque entrée alimente les popovers info (InfoPopover) et la détection
// d'entités dans le texte des chapitres (linkifyEntities).
//   slug        : identifiant stable
//   nom         : libellé affiché
//   type        : 'region' | 'ville' | 'province' | 'cours-eau' | 'pays'
//   region      : rattachement aux 4 régions de regions.js (ou null)
//   emoji       : pastille
//   description : 1–2 phrases de contexte historique
//   aliases     : formes rencontrées dans le texte (pour la détection)
//   livres      : slugs des livres où le lieu apparaît

export const lieux = [
  {
    slug: 'fouta-djallon',
    nom: 'Fouta-Djallon',
    type: 'region',
    region: 'Fouta Djallon',
    emoji: '🏔️',
    description:
      "Massif montagneux du centre de la Guinée, « château d'eau » de l'Afrique de l'Ouest. Au XVIIIᵉ siècle s'y établit une théocratie peule (almamiat) dirigée depuis Timbo.",
    aliases: ['Fouta-Diallon', 'Fouta-Djallon', 'Fouta Djallon', 'Fouta', 'Fuuta-Jalon', 'Fuuta-Jaloo'],
    livres: ['atfdb'],
  },
  {
    slug: 'timbo',
    nom: 'Timbo',
    type: 'ville',
    region: 'Fouta Djallon',
    emoji: '🕌',
    description:
      "Capitale politique de la théocratie du Fouta-Djallon, résidence des almamy. Centre du pouvoir des deux familles rivales Soriya et Alfaya.",
    aliases: ['Timbo'],
    livres: ['atfdb'],
  },
  {
    slug: 'fougoumba',
    nom: 'Fougoumba',
    type: 'ville',
    region: 'Fouta Djallon',
    emoji: '🕌',
    description:
      "Cité religieuse du Fouta-Djallon où étaient intronisés (« couronnés ») les almamy. Siège du Conseil des Anciens qui élisait le souverain.",
    aliases: ['Fougoumba', 'Fugumba'],
    livres: ['atfdb'],
  },
  {
    slug: 'labe',
    nom: 'Labé',
    type: 'province',
    region: 'Fouta Djallon',
    emoji: '🏘️',
    description:
      "Plus vaste des diiwe (provinces) du Fouta-Djallon, au nord du massif. Grand foyer commercial et religieux peul.",
    aliases: ['Labé', 'Labe'],
    livres: ['atfdb'],
  },
  {
    slug: 'pita',
    nom: 'Pita',
    type: 'province',
    region: 'Fouta Djallon',
    emoji: '🏘️',
    description: "Province (diiwal) centrale du Fouta-Djallon, réputée pour ses plateaux et ses chutes.",
    aliases: ['Pita'],
    livres: ['atfdb'],
  },
  {
    slug: 'timbi',
    nom: 'Timbi',
    type: 'province',
    region: 'Fouta Djallon',
    emoji: '🏘️',
    description: "Province du Fouta-Djallon (Timbi-Madina / Timbi-Touni), sur la route de la côte vers Timbo.",
    aliases: ['Timbi'],
    livres: ['atfdb'],
  },
  {
    slug: 'rio-nunez',
    nom: 'Rio Nunez',
    type: 'cours-eau',
    region: 'Basse Guinée',
    emoji: '🌊',
    description:
      "Estuaire de la côte guinéenne (actuel Tinguilinta), porte d'entrée des comptoirs européens vers le Fouta. Point de départ de la mission Bayol-Noirot vers l'intérieur.",
    aliases: ['Rio Nunez', 'Rio-Nunez'],
    livres: ['atfdb'],
  },
  {
    slug: 'boke',
    nom: 'Boké',
    type: 'ville',
    region: 'Basse Guinée',
    emoji: '⚓',
    description: "Poste colonial français de la côte (fortin de Boké), étape de la mission avant la montée vers le Fouta.",
    aliases: ['Boké', 'Boke'],
    livres: ['atfdb'],
  },
  {
    slug: 'tinguilinta',
    nom: 'Tinguilinta',
    type: 'cours-eau',
    region: 'Basse Guinée',
    emoji: '🌊',
    description: "Vallée et cours d'eau de la Basse-Guinée traversés par la mission au début de son voyage vers l'intérieur.",
    aliases: ['Tinguilinta'],
    livres: ['atfdb'],
  },
  {
    slug: 'bambouc',
    nom: 'Bambouc',
    type: 'region',
    region: null,
    emoji: '⛏️',
    description:
      "Pays aurifère entre Sénégal et Falémé (« pays de l'or »), longtemps en conflit avec le Fouta. Seconde grande étape du voyage de Noirot.",
    aliases: ['Bambouc', 'Bambouk'],
    livres: ['atfdb'],
  },
  {
    slug: 'paris',
    nom: 'Paris',
    type: 'ville',
    region: null,
    emoji: '🗼',
    description:
      "Capitale française où une ambassade peule du Fouta-Djallon fut reçue en janvier 1882, point de départ du récit de Noirot.",
    aliases: ['Paris'],
    livres: ['atfdb', 'oreilly_gv'],
  },
  {
    slug: 'sierra-leone',
    nom: 'Sierra Leone',
    type: 'pays',
    region: null,
    emoji: '🌊',
    description:
      "Colonie britannique côtière (Freetown), base de départ des expéditions anglaises vers le Fouta-Djallon à la fin du XVIIIᵉ siècle, dont celle de James Watt en 1794.",
    aliases: ['Sierra Leone', 'Sierra-Leone'],
    livres: ['watt'],
  },
  {
    slug: 'mamou',
    nom: 'Mamou',
    type: 'ville',
    region: 'Fouta Djallon',
    emoji: '🚉',
    description:
      "Ville carrefour du sud du Fouta-Djallon, « porte du Fouta » sur l'axe Conakry-Niger ; nœud ferroviaire et commercial.",
    aliases: ['Mamou'],
    livres: ['oreilly_gv'],
  },
  {
    slug: 'dalaba',
    nom: 'Dalaba',
    type: 'ville',
    region: 'Fouta Djallon',
    emoji: '⛰️',
    description:
      "Ville d'altitude du Fouta-Djallon, réputée pour son climat frais et ses plateaux ; station de villégiature à l'époque coloniale.",
    aliases: ['Dalaba'],
    livres: ['oreilly_gv'],
  },
  {
    slug: 'diari',
    nom: 'Diari',
    type: 'ville',
    region: 'Fouta Djallon',
    emoji: '🏘️',
    description:
      "Localité de la région de Labé, au Fouta-Djallon, réputée comme foyer d'enseignement religieux ; étape dans la formation des lettrés peuls.",
    aliases: ['Diari'],
    livres: ['bik_cerno'],
  },
]

export const lieuBySlug = Object.fromEntries(lieux.map((l) => [l.slug, l]))
