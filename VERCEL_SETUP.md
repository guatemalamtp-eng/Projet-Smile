# Guide de résolution : DEPLOYMENT_NOT_FOUND sur Vercel

## 🔍 1. Analyse de l'erreur

L'erreur `DEPLOYMENT_NOT_FOUND` signifie que Vercel ne trouve pas de déploiement pour ton projet. Cela arrive généralement quand :

- Le projet n'est pas encore connecté à Vercel
- Le déploiement n'a pas été déclenché après le push GitHub
- Le projet existe mais aucun déploiement n'a réussi

## ✅ 2. Solution : Connecter le projet à Vercel

### Option A : Via l'interface Vercel (RECOMMANDÉ)

1. **Va sur https://vercel.com**
2. **Connecte-toi** avec ton compte GitHub
3. **Clique sur "Add New Project"**
4. **Importe le repo** : `guatemalamtp-eng/Projet-Smile`
5. **Configure les variables d'environnement** :
   - `DATABASE_URL` : Ton URL Neon PostgreSQL
   - `AUTH_SECRET` : génère une clé avec `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NEXT_PUBLIC_SITE_URL` : Sera rempli automatiquement après le premier déploiement
6. **Clique sur "Deploy"**

### Option B : Via Vercel CLI

```powershell
# Installer Vercel CLI globalement
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
vercel

# Pour la production
vercel --prod
```

## 🔧 3. Vérifications après connexion

Une fois connecté, vérifie :

1. **Le build passe** : Vérifie les logs de build sur Vercel
2. **Les variables d'environnement** : Settings > Environment Variables
3. **Le déploiement est actif** : Tu devrais voir une URL comme `https://projet-smile.vercel.app`

## 📝 4. Commandes à exécuter maintenant

```powershell
# 1. Pousser le code vers GitHub
git push origin main

# 2. Aller sur Vercel et connecter le projet
# (suis les étapes de l'Option A ci-dessus)

# 3. Une fois déployé, créer l'admin
# Ouvre dans ton navigateur :
# https://ton-site.vercel.app/api/setup-admin
```

## ⚠️ 5. Points importants

- **Premier déploiement** : Vercel doit d'abord importer le projet depuis GitHub
- **Variables d'environnement** : Configure-les AVANT le premier déploiement si possible
- **Build** : Assure-toi que `npm run build` fonctionne localement avant de déployer
