# Déployer ArtsTigenn sur Vercel – guide pas à pas

Suivre **exactement** ces étapes. Tout se fait sur Vercel et GitHub, plus besoin de faire tourner le projet en local pour voir le site.

---

## 1. Préparer le code sur GitHub

1. Ouvre ton repo : **https://github.com/guatemalamtp-eng/Projet-Smile**
2. Vérifie que tout le code à déployer est bien poussé :
   ```powershell
   cd C:\Users\Rumpl\Cursor
   git add .
   git status
   git commit -m "fix: config Vercel et corrections galerie/œuvres"
   git push origin main
   ```
   (Si le projet n’est pas encore un repo git, crée-le sur GitHub puis `git remote add origin ...` et `git push -u origin main`.)

---

## 2. Créer le projet sur Vercel

1. Va sur **https://vercel.com** et connecte-toi (avec GitHub si possible).
2. Clique sur **Add New** → **Project**.
3. **Import** le repo **Projet-Smile** (guatemalamtp-eng/Projet-Smile).
4. **Ne clique pas encore sur Deploy.** On configure les variables d’environnement avant.

---

## 3. Neon : base de données

1. Va sur **https://console.neon.tech** et connecte-toi.
2. Crée un **projet** (ou utilise un existant) et une **base**.
3. Dans le projet, ouvre **Connection details** / **Connection string**.
4. Choisis **Pooled connection** (obligatoire pour Vercel, évite les coupures). L’URL ressemble à :
   ```
   postgresql://USER:PASSWORD@ep-XXX-pooler.REGION.aws.neon.tech/neondb?sslmode=require
   ```
5. Copie cette URL : c’est ta **DATABASE_URL**.

---

## 4. Variables d’environnement Vercel

Dans la page de configuration du projet Vercel, section **Environment Variables** :

| Nom | Valeur | Environnement |
|-----|--------|----------------|
| `DATABASE_URL` | L’URL **pooled** Neon copiée ci-dessus | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | L’URL du site (ex: `https://ton-projet.vercel.app`) | Production (recommandé) |

- **DATABASE_URL** : obligatoire. Sans elle, le build (migrations) et le site échouent.
- **AUTH_SECRET** : optionnel.

Clique sur **Save** pour chaque variable, puis **Deploy**.

---

## 5. Premier déploiement

1. Clique sur **Deploy**.
2. Attends la fin du build (1 à 3 min). Si une erreur s’affiche, note le message exact.
3. Quand c’est vert, tu as une URL du type : **https://projet-smile-xxx.vercel.app**.

---

## 6. Remplir la base de données (Neon) (admin + Léa + œuvres)

Le site tourne mais la base est vide. Il faut exécuter le **seed** **une fois** avec la base **Neon de production**.

**Option A – En local avec la base de prod**

1. Dans un fichier `.env` **local** (dans `C:\Users\Rumpl\Cursor`), mets **uniquement** :
   ```env
   DATABASE_URL="la_même_url_que_celle_utilisée_sur_Vercel"
   ```
2. Dans un terminal :
   ```powershell
   cd C:\Users\Rumpl\Cursor
   npm run prisma:seed
   ```
3. Quand c’est terminé, tu peux supprimer ou commenter `DATABASE_URL` dans `.env` si tu ne veux plus toucher à la prod depuis ta machine.

**Option B – Depuis un autre PC / sans seed**

- Tu peux créer l’admin à la main avec un script (voir `SETUP_PRODUCTION.md` ou `PRODUCTION.md`) ou via Prisma Studio en pointant vers la même `DATABASE_URL`.

---

## 7. Vérifier que tout marche sur Vercel

1. Ouvre l’URL de ton déploiement (ex: **https://projet-smile-xxx.vercel.app**).
2. Vérifie :
   - **/** : page d’accueil
   - **/gallery** : galerie avec les œuvres (si le seed a été fait)
   - **/artistes** : liste des artistes (Léa si seed fait)
   - **/artistes/[id]** : profil de Léa, puis clic sur une œuvre → page détail
   - **/admin/login** : connexion admin (après avoir créé l’admin)

Si une page affiche une erreur, ouvre la console du navigateur (F12) et note le message pour le corriger.

---

## 8. Après la première fois

- Chaque **push sur `main`** déclenche un nouveau déploiement sur Vercel.
- Les variables (ex: `DATABASE_URL`) sont déjà enregistrées ; pas besoin de les ressaisir.
- Pour modifier une variable : Vercel → ton projet → **Settings** → **Environment Variables** → modifier puis **Redeploy**.

---

## En résumé

| Étape | Où | Action |
|-------|-----|--------|
| 1 | GitHub | Push du code (main) |
| 2 | Neon | Créer projet + base, copier l’URL **pooled** |
| 3–4 | Vercel | Import du repo + `DATABASE_URL` (URL Neon pooled) + `NEXT_PUBLIC_SITE_URL` |
| 5 | Vercel | Deploy |
| 6 | En local (une fois) | `npm run prisma:seed` avec la même `DATABASE_URL` (Neon) |
| 7 | Navigateur | Tester l’URL Vercel (/, /gallery, /artistes, /admin/login) |

Tout le site est alors sur **Vercel** ; tu n’as plus besoin que ça tourne sur `localhost` pour le voir.
