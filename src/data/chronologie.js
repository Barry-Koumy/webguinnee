// Frise horizontale de la page d'accueil
export const chronoStrip = [
  { emoji: '👑', periode: 'Avant XIXe s.', nom: 'Royaumes & Empires', left: 'hidden' },
  { emoji: '📖', periode: 'XIXe siècle', nom: 'Théocratie du Fouta' },
  { emoji: '⚔️', periode: '1850 – 1958', nom: 'Colonisation & Résistance' },
  { emoji: '🏳️', periode: '1958', nom: 'Indépendance' },
  { emoji: '🌍', periode: "Aujourd'hui", nom: 'Guinée Moderne', right: 'hidden' },
]

// Frise verticale détaillée de la page Chronologie
export const eras = [
  {
    emoji: '👑', periode: 'Avant le XIXe siècle', titre: 'Royaumes & Empires',
    events: [
      { date: 'XIIIe s.', txt: "La région intègre l'aire d'influence de l'empire du Mali." },
      { date: 'XVe–XVIIe s.', txt: 'Migrations peules vers le massif du Fouta Djallon.' },
    ],
  },
  {
    emoji: '📖', periode: 'XVIIIe – XIXe siècle', titre: 'Théocratie du Fouta',
    events: [
      { date: '1725', txt: 'Le djihad de Karamoko Alpha fonde la confédération théocratique du Fouta Djallon.' },
      { date: '1896', txt: 'Bokar Biro, dernier almami, résiste à la pénétration française.' },
    ],
  },
  {
    emoji: '⚔️', periode: '1850 – 1958', titre: 'Colonisation & Résistance',
    events: [
      { date: '1898', txt: 'Capture de Samory Touré ; la Guinée devient colonie française.' },
      { date: '1905', txt: "Déportation d'Alpha Yaya Diallo, figure de la résistance peule." },
    ],
  },
  {
    emoji: '🏳️', periode: '1958', titre: 'Indépendance',
    events: [
      { date: '28 sept. 1958', txt: 'Le « Non » au référendum : la Guinée choisit l\'indépendance immédiate.' },
      { date: '2 oct. 1958', txt: 'Proclamation de la République de Guinée ; Sékou Touré président.' },
    ],
  },
  {
    emoji: '🌍', periode: "Aujourd'hui", titre: 'Guinée Moderne',
    events: [
      { date: '1984', txt: 'Décès de Sékou Touré ; transition politique.' },
      { date: '2010', txt: 'Première élection présidentielle pluraliste.' },
    ],
  },
]
