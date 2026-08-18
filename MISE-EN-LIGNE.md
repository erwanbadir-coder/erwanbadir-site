# Mettre le site en ligne — guide pas à pas

Ce guide te fait passer du site sur ton ordinateur à une **adresse de test en ligne**
(gratuite, du type `erwanbadir.netlify.app`). On ne touche **pas** encore à ton
domaine `erwanbadir.com` chez Gandi : ton site actuel reste en ligne, intact.
On branchera le vrai domaine plus tard, une fois que tu auras tout testé.

---

## D'abord, c'est quoi GitHub et Netlify ?

Deux services gratuits, complémentaires :

- **GitHub** = un « coffre-fort » en ligne où vit le code de ton site. Chaque fois
  que tu modifies quelque chose (ou que ton admin enregistre un projet), la
  nouvelle version est rangée là. C'est aussi ce qui permet à ton admin `/admin`
  d'enregistrer tes modifications.

- **Netlify** = l'hébergeur. Il regarde ton coffre GitHub, fabrique le site et le
  publie sur une adresse web. Dès que le coffre change, Netlify republie tout seul,
  en ~30 secondes. C'est aussi Netlify qui gère la **connexion à ton admin**
  (identité + mot de passe).

En clair : **tu écris/modifies → GitHub garde → Netlify publie.** Tu n'as jamais à
toucher au code pour ça une fois que c'est branché.

---

## Étape 1 — Créer un compte GitHub (5 min)

1. Va sur **github.com** → **Sign up**.
2. Mets ton e-mail, un mot de passe, un nom d'utilisateur (ex. `erwanbadir`).
3. Valide l'e-mail de confirmation. C'est tout, reste sur la page.

## Étape 2 — Créer le dépôt (le « coffre ») et y déposer le site

Le plus simple sans ligne de commande :

1. Sur GitHub, clique le **+** en haut à droite → **New repository**.
2. Nom : `erwanbadir-site`. Laisse en **Public** (ou Private, au choix). Ne coche
   rien d'autre. Clique **Create repository**.
3. Sur la page qui s'ouvre, clique le lien **« uploading an existing file »**.
4. **Décompresse** le zip que je t'ai envoyé sur ton ordinateur. Tu obtiens un
   dossier `erwanbadir-site` avec plein de fichiers.
5. Ouvre ce dossier, **sélectionne tout ce qu'il y a dedans** (les fichiers ET les
   sous-dossiers `src`, etc. — mais **PAS** le dossier `node_modules` ni `_site`
   s'ils sont présents : inutiles et lourds) et **glisse-les** dans la zone de
   dépôt de GitHub.
6. En bas, clique **Commit changes**. Attends la fin de l'envoi.

> Astuce : si le glisser-déposer ne prend pas les sous-dossiers, tu peux glisser
> directement le contenu dossier par dossier. L'important est de retrouver, à la
> racine du dépôt, les fichiers `package.json`, `netlify.toml`, `.eleventy.js` et
> le dossier `src`.

## Étape 3 — Créer un compte Netlify et brancher le dépôt (5 min)

1. Va sur **netlify.com** → **Sign up** → choisis **« Sign up with GitHub »**
   (le plus simple : ça relie directement les deux). Autorise l'accès.
2. Dans Netlify : **Add new site** → **Import an existing project** →
   **Deploy with GitHub**.
3. Choisis le dépôt `erwanbadir-site`.
4. Netlify lit tout seul les réglages (grâce au fichier `netlify.toml` déjà inclus) :
   - Build command : `npm run build`
   - Publish directory : `_site`
   Ne change rien. Clique **Deploy**.
5. Attends ~1 minute. Netlify te donne une adresse type
   `https://random-nom-1234.netlify.app`. **Ton site de test est en ligne !**

> Tu peux renommer cette adresse : **Site configuration → Change site name** →
> mets `erwanbadir` → l'adresse devient `https://erwanbadir.netlify.app`.

## Étape 4 — Activer ton admin `/admin` en ligne (important)

Pour pouvoir ajouter/modifier tes projets depuis le site en ligne (sans code) :

1. Dans Netlify : **Site configuration → Identity** → **Enable Identity**.
2. Toujours dans Identity → **Registration** : mets **Invite only**
   (personne ne peut créer de compte, seulement toi).
3. Descends à **Services → Git Gateway** → **Enable Git Gateway**.
4. Remonte en haut de l'onglet **Identity** → **Invite users** → mets **ton
   e-mail** → **Send**. Tu reçois un mail « You've been invited… ».
5. Clique le lien du mail (il t'amène sur ton site), choisis un **mot de passe**.
   Désormais : `https://erwanbadir.netlify.app/admin/` → tu te connectes avec cet
   e-mail + mot de passe, et tu peux tout éditer en visuel.

À chaque enregistrement dans l'admin, Netlify republie le site tout seul.

---

## Étape 5 — Tester tranquillement

Vérifie sur l'adresse de test, sur ordinateur **et** téléphone :

- l'accueil et son double-scroll ;
- l'ouverture des projets, le mode sombre, le menu burger ;
- l'admin : crée un projet bidon, ajoute une image, enregistre, vérifie qu'il
  apparaît, puis supprime-le.

Prends ton temps. Tant qu'on est sur `.netlify.app`, **rien n'affecte
erwanbadir.com**.

---

## Étape 6 — Plus tard : brancher erwanbadir.com (on le fera ensemble)

Quand tu seras sûr, on connectera ton domaine Gandi. Le principe (je te guiderai
le moment venu, écran par écran) :

1. Dans Netlify : **Domain management → Add a domain** → `erwanbadir.com`.
2. Netlify te donnera soit des **serveurs DNS** (nameservers), soit des
   **enregistrements A/CNAME** à recopier chez **Gandi** (onglet DNS de ton domaine).
3. On garde les **mêmes adresses de pages** que ton site actuel autant que possible,
   pour ne pas perdre ton référencement. Dis-moi la liste de tes pages actuelles et
   je préparerai les redirections nécessaires (fichier `_redirects`, déjà prévu).
4. Le certificat HTTPS (le cadenas) est automatique et gratuit chez Netlify.

Le basculement DNS prend de quelques minutes à quelques heures. On peut le faire un
soir pour que ce soit transparent.

---

## En cas de souci

- **Le build échoue sur Netlify** : ouvre l'onglet **Deploys → dernier deploy → voir
  les logs**, copie-moi le message d'erreur, je corrige.
- **L'admin ne se connecte pas** : re-vérifie qu'**Identity** ET **Git Gateway** sont
  bien activés (Étape 4), et que tu as accepté l'invitation par mail.
- **Une image ne s'affiche pas** : vérifie qu'elle a bien été envoyée dans le dépôt
  (dossier `src/images`).

Tu me dis quand tu es prêt et je reste avec toi à chaque étape.
