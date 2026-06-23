// Personnages réels cités dans les livres de la bibliothèque.
// Remplace les fausses « personnalités » virtuelles (personnalites.js).
// Alimente les popovers info et la détection d'entités dans le texte.
//   slug, nom, avatar, role, region, description (1–2 phrases),
//   aliases (formes dans le texte), livres (slugs)

export const personnages = [
  {
    slug: 'ernest-noirot',
    nom: 'Ernest Noirot',
    avatar: '🧭',
    role: 'Explorateur, administrateur',
    region: 'France',
    description:
      "Voyageur français (1851-1913), attaché à la mission Bayol de 1881 au Fouta-Djallon. Auteur d'« A travers le Fouta-Diallon et le Bambouc » (1882), il deviendra ensuite administrateur colonial.",
    aliases: ['Ernest Noirot', 'Noirot'],
    livres: ['atfdb'],
  },
  {
    slug: 'bayol',
    nom: 'Docteur Bayol',
    avatar: '⚕️',
    role: 'Chef de la mission française',
    region: 'France',
    description:
      "Jean-Marie Bayol (1849-1905), médecin de marine, chef de la mission diplomatique de 1881 chargée de signer un traité de protectorat avec les almamy du Fouta. Premier gouverneur des Rivières du Sud.",
    aliases: ['docteur Bayol', 'Docteur Bayol', 'Dr Bayol', 'Bayol'],
    livres: ['atfdb'],
  },
  {
    slug: 'mahamadou-saidou',
    nom: 'Modi Mahamadou-Saïdou',
    avatar: '🎓',
    role: "Chef de l'ambassade peule",
    region: 'Fouta Djallon',
    description:
      "Conseiller de l'almamy Ibrahima Sory, il dirigea l'ambassade peule envoyée à Paris en 1882. Noirot le décrit comme un homme d'une grande intelligence et d'un jugement remarquable.",
    aliases: ['Mahamadou-Saïdou', 'Mahamadou-Saidou', 'Modi Mouhammadou Saidou', 'Mohamadou-Saidou'],
    livres: ['atfdb'],
  },
  {
    slug: 'ibrahima-sory',
    nom: 'Almamy Ibrahima Sory',
    avatar: '👑',
    role: 'Almamy (lignée Soriya)',
    region: 'Fouta Djallon',
    description:
      "Souverain du Fouta-Djallon issu de la famille Soriya, l'une des deux lignées (avec les Alfaya) qui se partageaient le trône par alternance. Il accueillit la mission Bayol-Noirot.",
    aliases: ['Almamy Ibrahima Sory', 'Ibrahima Sory', 'Ibrahima-Sory', 'Almamy Ibrahima'],
    livres: ['atfdb'],
  },
  {
    slug: 'thierno-madiou',
    nom: 'Thierno Mahadiou',
    avatar: '📖',
    role: 'Lettré et hôte peul',
    region: 'Fouta Djallon',
    description:
      "Dignitaire religieux (thierno) du Fouta qui reçut la mission sur la route de Timbo ; le chapitre VIII du livre lui est consacré.",
    aliases: ['Thierno Mahadiou', 'Thierno-Mahadiou', 'Thierno Madiou'],
    livres: ['atfdb'],
  },
  {
    slug: 'bokar-biro',
    nom: 'Bokar Biro',
    avatar: '⚔️',
    role: 'Futur dernier almamy',
    region: 'Fouta Djallon',
    description:
      "Bôkar Biro Barry, mentionné enfant/jeune à l'époque de la mission, deviendra le dernier almamy du Fouta-Djallon, tué en 1896 à Poredaka face aux Français.",
    aliases: ['Bokar-Biro', 'Bokar Biro', 'Bôkar Biro'],
    livres: ['atfdb'],
  },
  {
    slug: 'joseph-harris',
    nom: 'Joseph E. Harris',
    avatar: '🎓',
    role: 'Historien',
    region: 'États-Unis',
    description:
      "Joseph Earl Harris, historien africaniste afro-américain. Sa thèse « The Kingdom of Fouta-Diallon » (Northwestern University, 1965) est une des premières histoires universitaires de la théocratie peule.",
    aliases: ['Joseph E. Harris', 'Joseph Earl Harris', 'Joseph Harris'],
    livres: ['harris_kfd'],
  },
  {
    slug: 'karamoko-alfa',
    nom: 'Karamoko Alfa',
    avatar: '🕌',
    role: 'Fondateur de la théocratie',
    region: 'Fouta Djallon',
    description:
      "Ibrâhîma Sambêgou, dit Karamoko Alfa mo Labé, chef religieux qui lança vers 1727 le djihad fondant l'État théocratique du Fouta-Djallon ; premier almamy de Timbo.",
    aliases: ['Karamoko Alfa', 'Karamoko Alpha', 'Karamokho Alfa'],
    livres: ['harris_kfd', 'pmarty_islam'],
  },
  {
    slug: 'james-watt',
    nom: 'James Watt',
    avatar: '🧭',
    role: 'Explorateur britannique',
    region: 'Sierra Leone',
    description:
      "Officier de la Sierra Leone Company qui conduisit en 1794 la première expédition anglaise documentée jusqu'à Timbo, pour nouer des relations commerciales avec les almamy du Fouta. Son journal, édité par Bruce L. Mouser, est une source historique majeure.",
    aliases: ['James Watt'],
    livres: ['watt'],
  },
  {
    slug: 'paul-marty',
    nom: 'Paul Marty',
    avatar: '✒️',
    role: 'Administrateur & islamologue',
    region: 'France',
    description:
      "Administrateur colonial et islamologue français (1882-1938), spécialiste de l'islam ouest-africain. Son « L'Islam au Fouta-Djallon » (1921) décrit en détail l'organisation religieuse de la théocratie peule.",
    aliases: ['Paul Marty'],
    livres: ['pmarty_islam'],
  },
  {
    slug: 'antoine-demougeot',
    nom: 'Antoine Demougeot',
    avatar: '📋',
    role: 'Administrateur colonial',
    region: 'France',
    description:
      "Administrateur colonial français, auteur des « Notes sur l'organisation politique et administrative du Labé » (IFAN, 1944), description de la plus vaste province du Fouta-Djallon sous la colonisation.",
    aliases: ['Demougeot', 'Antoine Demougeot'],
    livres: ['demougeot'],
  },
  {
    slug: 'gilbert-vieillard',
    nom: 'Gilbert Vieillard',
    avatar: '🪶',
    role: 'Administrateur-ethnographe',
    region: 'Fouta Djallon',
    description:
      "Gilbert Pierre Vieillard (1899-1940), administrateur colonial et ethnographe passionné du monde peul, fin connaisseur de la langue pular et collecteur de traditions foula ; mort au combat en 1940.",
    aliases: ['Gilbert Vieillard', 'Gilbert Pierre Vieillard'],
    livres: ['oreilly_gv'],
  },
  {
    slug: 'patrick-oreilly',
    nom: "Patrick O'Reilly",
    avatar: '✍️',
    role: 'Ethnologue & bibliographe',
    region: 'France',
    description:
      "Patrick O'Reilly (1900-1988), ethnologue et bibliographe français de l'Océanie, ami de Gilbert Vieillard dont il publia en 1942 le portrait « Mon ami l'Africain ».",
    aliases: ["Patrick O'Reilly", "O'Reilly"],
    livres: ['oreilly_gv'],
  },
  {
    slug: 'louis-tauxier',
    nom: 'Louis Tauxier',
    avatar: '📚',
    role: 'Administrateur-ethnographe',
    region: 'France',
    description:
      "Louis Tauxier (1871-1942), administrateur colonial et ethnographe français, auteur de nombreuses monographies sur les peuples ouest-africains, dont « Mœurs et histoire des Peuls » (Payot, 1937).",
    aliases: ['Louis Tauxier', 'Tauxier'],
    livres: ['tauxier_hpfd'],
  },
  {
    slug: 'boubacar-barry',
    nom: 'Boubacar Barry',
    avatar: '🖋️',
    role: 'Historien',
    region: 'Sénégal',
    description:
      "Boubacar Barry, historien sénégalais de la Sénégambie ; il a consacré à Bokar Biro une biographie dans la collection « Grandes Figures Africaines » (Éditions ABC).",
    aliases: ['Boubacar Barry', 'Bubakar Barry'],
    livres: ['bubakar_bokarbiro'],
  },
  {
    slug: 'cerno-abdourahmane',
    nom: 'Cerno Abdourahmane Bah',
    avatar: '📿',
    role: 'Érudit et poète de Labé',
    region: 'Fouta Djallon',
    description:
      "Tierno (Cerno) Abdourahmane Bah (1916-1991), grand érudit, poète et théologien de Labé, figure majeure de la culture islamique pular du Fouta-Djallon au XXᵉ siècle.",
    aliases: ['Cerno Abdurahmane', 'Cerno Abdourahmane', 'Tierno Abdourahmane', 'Cerno Abdurahmane Bah'],
    livres: ['bik_cerno'],
  },
  {
    slug: 'ibrahima-kaba-bah',
    nom: 'Elhadj Ibrahima Kaba Bah',
    avatar: '🖊️',
    role: 'Auteur & éditeur',
    region: 'Fouta Djallon',
    description:
      "Elhadj Ibrahima Kaba Bah, auteur et éditeur (Defte Cernoya, Labé) des éléments biographiques consacrés à Cerno Abdourahmane Bah.",
    aliases: ['Elhadj Ibrahima Kaba Bah', 'Ibrahima Kaba Bah'],
    livres: ['bik_cerno'],
  },
  {
    slug: 'tierno-aliou',
    nom: 'Tierno Aliou Bhuubha Ndiyan',
    avatar: '🕌',
    role: 'Savant et résistant',
    region: 'Fouta Djallon',
    description:
      "Tierno Aliou Bhuubha Ndiyan (Cerno Aliyyu Buuba Ndiyan), savant religieux du Fouta-Djallon, figure de l'opposition à la colonisation, associé à la révolte de 1911.",
    aliases: ['Tierno Aliou Bhuubha Ndiyan', 'Tierno Aliou', 'Cerno Aliyyu Bhuubha Ndiyan'],
    livres: ['bik_cerno'],
  },
]

export const personnageBySlug = Object.fromEntries(personnages.map((p) => [p.slug, p]))
