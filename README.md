# Smile - Site d'artiste peintre

Site web pour un artiste peintre avec interface publique et interface admin.

## 🚀 Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma** + **PostgreSQL** (Neon)
- **Tailwind CSS**
- **Vercel** (déploiement)

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Neon (PostgreSQL)
- Compte Vercel (pour le déploiement)

## 🛠️ Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/guatemalamtp-eng/Projet-Smile.git
cd Projet-Smile
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Crée un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
AUTH_COOKIE_NAME="smile_session"
AUTH_SECRET="une_chaine_longue_et_aleatoire"
```

### 4. Créer la base de données

```bash
npx prisma migrate dev --name init
```

### 5. Créer un utilisateur admin

```bash
npm run prisma:seed
```

Par défaut, l'admin est créé avec :
- Email: `dasilva.jeanclaude@yahoo.fr`
- Mot de passe: `Jprout140617`

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
app/
├── (public)/          # Pages publiques
│   ├── page.tsx       # Accueil
│   ├── gallery/       # Galerie
│   └── artworks/      # Détail œuvre
├── (auth)/            # Authentification
│   └── login/         # Page de connexion
└── admin/             # Interface admin (protégée)
    ├── dashboard/     # Tableau de bord
    ├── artworks/      # CRUD œuvres
    └── messages/      # Gestion messages

components/
└── gallery/           # Composants galerie

lib/
├── prisma.ts          # Client Prisma
├── auth.ts            # Authentification
├── artworks.ts        # Fonctions œuvres
└── messages.ts        # Fonctions messages

prisma/
└── schema.prisma      # Schéma de base de données
```

## 🌐 Déploiement sur Vercel

### 1. Connecter le repo GitHub à Vercel

1. Va sur [Vercel](https://vercel.com)
2. Importe ton repo GitHub
3. Vercel détectera automatiquement Next.js

### 2. Configurer les variables d'environnement

Dans **Settings > Environment Variables**, ajoute :

- `DATABASE_URL` : Ton URL Neon PostgreSQL
- `AUTH_SECRET` : Une clé aléatoire (génère avec `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `AUTH_COOKIE_NAME` : `smile_session` (optionnel)
- `NEXT_PUBLIC_SITE_URL` : L'URL de ton site Vercel (pour le sitemap) - optionnel mais recommandé

### 3. Déployer

Vercel déploiera automatiquement à chaque push sur `main`.

### 4. Créer l'admin en production

Une fois déployé, connecte-toi à ta base Neon et crée un utilisateur admin manuellement, ou utilise Prisma Studio :

```bash
npx prisma studio
```

## 🔐 Créer un utilisateur admin

### Option 1 : Script seed (recommandé)

```bash
npm run prisma:seed
```

### Option 2 : Prisma Studio

```bash
npx prisma studio
```

Puis crée un utilisateur dans l'interface avec :
- `email` : ton email
- `password` : hash bcrypt (génère avec `node -e "console.log(require('bcryptjs').hashSync('ton_mot_de_passe', 10))"`)
- `role` : `ADMIN`

### Option 3 : Via SQL direct

```sql
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  'clx...',
  'dasilva.jeanclaude@yahoo.fr',
  '$2a$10$...', -- hash bcrypt de ton mot de passe (génère avec bcryptjs)
  'ADMIN',
  NOW(),
  NOW()
);
```

## 📝 Fonctionnalités

### Interface publique

- ✅ Page d'accueil immersive
- ✅ Galerie des œuvres (grille responsive)
- ✅ Page détail œuvre avec toutes les infos
- ✅ Système de likes (protégé contre les abus)
- ✅ Formulaire de contact par œuvre

### Interface admin

- ✅ Authentification sécurisée
- ✅ Dashboard avec statistiques
- ✅ CRUD complet des œuvres
- ✅ Gestion des messages visiteurs
- ✅ Feedback utilisateur (toasts)

## 🎨 Personnalisation

- **Couleurs** : Modifie `tailwind.config.js` et les classes dans les composants
- **Contenu** : Modifie les textes dans `app/(public)/page.tsx`
- **Logo/Branding** : Remplace "SMILE" dans les headers

## 🐛 Dépannage

### Erreur "DATABASE_URL not found"

Vérifie que la variable est bien configurée dans `.env` (local) ou dans Vercel (production).

### Erreur de build sur Vercel

Assure-toi que :
1. `DATABASE_URL` est configurée dans Vercel
2. `AUTH_SECRET` est configurée
3. Les migrations Prisma sont appliquées

### Impossible de se connecter

Vérifie que l'utilisateur admin existe dans la base de données et que le mot de passe est correct.

## 📚 Scripts disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run start` : Serveur de production
- `npm run prisma:migrate` : Appliquer les migrations
- `npm run prisma:generate` : Générer le client Prisma
- `npm run prisma:studio` : Ouvrir Prisma Studio
- `npm run prisma:seed` : Créer un admin par défaut

## 📄 Licence

Projet privé - Tous droits réservés
