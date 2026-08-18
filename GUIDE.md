# Site Erwan Badir — guide complet

Bienvenue 👋 Ce dossier contient **tout ton site**. Il est pensé pour être **facile
à tenir à jour** : une fois en ligne, tu ajoutes et modifies tes projets depuis une
**interface d'administration visuelle** (un formulaire + glisser-déposer d'images),
sans jamais toucher au code.

Ce guide est écrit pour débutant : suis les étapes dans l'ordre.

---

## 1. Ce qu'il y a dans le dossier

```
erwanbadir-site/
├── src/                     ← le site (ce que tu édites)
│   ├── projects/            ← 1 fichier = 1 projet
│   ├── images/projects/     ← les images
│   ├── images/logo.svg      ← ton logo (à remplacer)
│   ├── _data/               ← page Infos + réglages généraux
│   ├── admin/               ← l'interface d'administration
│   └── assets/              ← styles + effets (couleurs, curseur, scroll)
├── GUIDE.md                 ← ce fichier
└── (fichiers techniques : package.json, .eleventy.js, netlify.toml)
```

Tu n'as **pas besoin** de comprendre les fichiers techniques.

---

## 2. Voir le site sur ton ordinateur (facultatif)

Utile pour tester avant de publier. Si tu préfères, saute directement à l'étape 3.

1. Installe **Node.js** (version LTS) depuis <https://nodejs.org>.
2. Ouvre l'app **Terminal**, puis tape ces lignes une par une :
   ```
   cd ~/Downloads/erwanbadir-site
   npm install
   npm start
   ```
3. Ouvre ton navigateur sur **http://localhost:8080**. Le site s'affiche.
4. Pour arrêter : reviens au Terminal et fais `Ctrl + C`.

---

## 3. Mettre le site en ligne (gratuit) — la partie importante

On utilise **GitHub** (pour stocker le site) + **Netlify** (pour l'héberger et
fournir ton interface d'admin). Les deux sont **gratuits**.

### Étape A — Créer le dépôt GitHub
1. Crée un compte sur <https://github.com> (gratuit).
2. Clique **New repository** (bouton vert). Nomme-le par ex. `erwanbadir-site`,
   laisse-le **Public** ou **Private**, clique **Create repository**.
3. Sur la page du dépôt, clique **uploading an existing file**.
4. Glisse **tout le contenu** de ce dossier (sauf `node_modules` s'il existe) puis
   clique **Commit changes**.

### Étape B — Déployer sur Netlify
1. Crée un compte sur <https://netlify.com> en cliquant **Sign up with GitHub**.
2. Clique **Add new site → Import an existing project → GitHub**, autorise, puis
   choisis ton dépôt `erwanbadir-site`.
3. Netlify détecte tout seul la configuration (grâce au fichier `netlify.toml`).
   Laisse les réglages tels quels et clique **Deploy**.
4. Après ~1 minute, ton site est en ligne à une adresse du type
   `https://un-nom-au-hasard.netlify.app`. 🎉

### Étape C — Activer ton interface d'administration
C'est ce qui te permet d'ajouter des projets sans code.
1. Dans Netlify, ouvre ton site → **Integrations** (ou **Site configuration**) →
   cherche **Identity** et clique **Enable Identity**.
2. Toujours dans Identity → **Registration** : mets **Invite only**
   (personne d'autre ne pourra créer de compte).
3. Descends jusqu'à **Services → Git Gateway** et clique **Enable Git Gateway**.
4. Onglet **Identity** en haut → **Invite users** → entre **ton e-mail** → **Send**.
5. Tu reçois un e-mail « You've been invited… ». Clique le lien, **choisis un mot de
   passe**. C'est ton compte admin.

### Étape D — Utiliser l'admin
- Va sur **`https://ton-site.netlify.app/admin/`** et connecte-toi.
- Tu peux maintenant tout gérer (voir section 4). Chaque enregistrement met le site
  à jour automatiquement en ~1 minute.

---

## 4. Gérer ton site depuis l'admin

Rends-toi sur **`/admin/`** de ton site.

### Ajouter un projet
1. **Projets → New Projet**.
2. Remplis : **Titre**, **Ordre d'affichage** (petit nombre = affiché en premier),
   **Catégorie** (ex. « Identité visuelle »), **Client**, **Année**.
3. **Image de couverture** : c'est l'image de l'accueil. Mets une image **en
   couleur** — le site l'affiche en noir & blanc et la repasse en couleur au survol.
4. **Page développée (avec texte) ?** :
   - **Activé** = la page projet montre tes textes *Contexte* et *Parti pris*.
   - **Désactivé** = page simple, images seules.
5. **Images du projet** : ajoute autant d'images que tu veux. Pour chacune, la case
   **Image horizontale (pleine largeur)** :
   - **Cochée** = l'image prend toute la largeur.
   - **Décochée** = image verticale, placée deux par deux.
6. Clique **Publish**. ✅

### Modifier / supprimer / réordonner
- Ouvre un projet dans **Projets**, modifie, **Publish**.
- Pour changer l'ordre sur l'accueil, change le champ **Ordre d'affichage**.

### Modifier la page Infos
- **Pages → Page Infos** : présentation, liste de clients, e-mail, téléphone,
  réseaux, mentions légales.

### Changer le logo
- **Pages → Général (logo, titres) → Logo** : téléverse ton **SVG**.
  Conseil : un logo d'**une seule couleur** rendra le mieux (il s'inverse
  automatiquement selon l'image derrière). Laisse vide pour réafficher ton nom en
  texte.

---

## 5. Mettre ton nom de domaine (erwanbadir.com)

Dans Netlify : **Domain management → Add a domain → erwanbadir.com**, puis suis les
instructions (Netlify t'indique les réglages à copier chez ton fournisseur de
domaine). Le certificat HTTPS est automatique et gratuit.

---

## 6. Bon à savoir

- **Réglages visuels** (couleurs de fond, amplitude de la dérive au scroll, taille du
  curseur licorne) : dans `src/assets/css/style.css` et `src/assets/js/scroll.js`.
  Demande-moi si tu veux ajuster, je te dis exactement quelle ligne changer.
- **Images** : pour un site rapide, exporte tes images en largeur ~2000 px max,
  format **.jpg** (photos) ou **.webp**. Les images placeholder actuelles sont à
  remplacer par les tiennes.
- **Rien n'est jamais perdu** : chaque modification est enregistrée dans GitHub, tu
  peux revenir en arrière.

Bon lancement ! 🚀
