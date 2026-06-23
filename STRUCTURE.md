# Structure du projet WebGuinée

Application React (Vite) qui présente une bibliothèque d'œuvres sur le Fouta-Djallon,
reconstruites à partir du miroir webFuuta.

## Arborescence

```
WEB GUINEE/
├── futta/              ← miroir HTTrack ORIGINAL (source de vérité, NE PAS MODIFIER)
├── archives-build/     ← miroir réhabillé au style WebGuinée (SOURCE DE BUILD, hors prod)
│                          généré depuis futta/ par scripts/build-archives.js
├── CATALOGUE-BIBLIOTHEQUE.md
└── webguinee/          ← l'application
    ├── public/
    │   └── livres/<slug>/   ← images des livres SERVIES en prod (couvertures, figures)
    ├── scripts/             ← outils de build/maintenance (Node, hors runtime)
    │   ├── build-archives.js     futta/ → archives-build/ (réhabillage HTML)
    │   ├── build-all-livres.mjs  archives-build/ → src/data/livres/*.json (tous les fonds)
    │   ├── extract-livre.mjs     extraction d'un livre depuis archives-build/
    │   ├── count-docs.cjs        comptage des documents
    │   ├── fix-broken-links.cjs  réparation de liens internes
    │   └── update-counters.cjs   compteurs des index de catégorie
    └── src/
        ├── main.jsx         routes
        ├── pages/           une page par route (Home, Explorer, Bibliotheque,
        │                    Livre, Region, Theme, Chronologie, Recits, Profil, IA)
        │   └── <Page>/sections/   sous-composants de la page
        ├── components/      composants partagés (Layout, InfoPopover)
        ├── hooks/           hooks réutilisables (useToast, useFadeUp)
        ├── utils/           utilitaires (entities.js : popovers d'entités)
        └── data/            DONNÉES (dérivées du registre, pas de valeurs en dur)
            ├── livres/
            │   ├── index.js       registre : 9 fiches curées + fiches générées
            │   ├── _generated.js  53 fiches générées
            │   └── <slug>.json    contenu des chapitres (chargé à la demande)
            ├── stats.js, documents.js, categories.js, regions.js,
            │   recommandations.js, personnages.js, personnalites.js,
            │   themes.js, livreDuJour.js, ...   ← tout dérive de livres/index.js
            └── ...
```

## Principes

- **`futta/` est intouchable** : c'est l'archive originale. `archives-build/` en est dérivé
  et régénérable ; ni l'un ni l'autre n'est expédié dans le bundle de production.
- **Données dérivées, pas en dur** : `src/data/*.js` calcule stats, catégories, régions,
  recommandations… à partir du registre `livres/index.js`. Ajouter un livre met tout à jour.
- **Code-splitting par livre** : chaque `livres/<slug>.json` est un chunk chargé à la demande.

## Régénérer les données des livres

```bash
node scripts/build-archives.js     # futta/ → archives-build/  (si besoin)
node scripts/build-all-livres.mjs  # archives-build/ → src/data/livres/*.json
npm run build                      # vérifier
```
