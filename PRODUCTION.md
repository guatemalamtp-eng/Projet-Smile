# Guide de déploiement en production

## 🚀 Déploiement sur Vercel

### 1. Variables d'environnement Vercel

Dans **Vercel > Settings > Environment Variables**, configure :

- `DATABASE_URL` : Ton URL Neon PostgreSQL
- `AUTH_SECRET` : `bcad126ea1bcb988f544b7c1d5b2b118`
- `AUTH_COOKIE_NAME` : `smile_session` (optionnel)
- `NEXT_PUBLIC_SITE_URL` : L'URL de ton site Vercel (ex: `https://ton-projet.vercel.app`)

### 2. Activer Vercel Blob Storage

1. Va dans **Vercel > Storage**
2. Active **Blob Storage**
3. L'upload d'images fonctionnera automatiquement

### 3. Créer l'admin en production

#### Option A : Script Node.js (recommandé)

```bash
npm run create-admin
```

Assure-toi que `DATABASE_URL` dans ton `.env` pointe vers ta base de production.

#### Option B : Via SQL direct dans Neon

1. Génère le hash bcrypt :
```bash
npm run generate-hash "Jprout140617"
```

2. Copie le hash généré

3. Connecte-toi à ta base Neon et exécute le script `scripts/create-admin.sql` en remplaçant le hash

#### Option C : Via Prisma Studio

```bash
npx prisma studio
```

Puis crée l'utilisateur manuellement dans l'interface avec :
- `email` : `dasilva.jeanclaude@yahoo.fr`
- `password` : hash bcrypt (génère avec `npm run generate-hash "Jprout140617"`)
- `name` : `Administrateur`
- `role` : `ADMIN`

### 4. Vérifier le déploiement

- ✅ Le build passe sur Vercel
- ✅ Le site est accessible
- ✅ La connexion admin fonctionne
- ✅ L'upload d'images fonctionne
- ✅ Les fonctionnalités publiques fonctionnent

## 🔐 Identifiants admin

- **Email** : `dasilva.jeanclaude@yahoo.fr`
- **Mot de passe** : `Jprout140617`

⚠️ **Change le mot de passe après la première connexion en production !**

## 📝 Commandes utiles

```bash
# Créer l'admin en production
npm run create-admin

# Générer un hash bcrypt
npm run generate-hash "ton-mot-de-passe"

# Ouvrir Prisma Studio
npx prisma studio
```

## 🔄 Workflow de déploiement

1. Pousser le code sur GitHub :
```bash
git add .
git commit -m "feat: ajout scripts production"
git push origin main
```

2. Vercel déploie automatiquement

3. Créer l'admin en production avec `npm run create-admin`

4. Tester toutes les fonctionnalités
