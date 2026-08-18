// Données appliquées automatiquement à TOUS les projets du dossier.
// Évite d'avoir à répéter layout/permalink dans chaque fichier
// (et garde l'admin Decap propre : l'utilisateur ne voit que le contenu).
module.exports = {
  layout: "projet.njk",
  permalink: "/projets/{{ page.fileSlug }}/",
};
