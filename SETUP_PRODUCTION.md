# 🚀 Setup Production - Guide Rapide

## ✅ Étape 1 : Créer l'admin en production

### Option A : Via SQL direct dans Neon (RECOMMANDÉ)

1. Va sur ton dashboard Neon : https://console.neon.tech
2. Sélectionne ta base de données
3. Va dans l'onglet **SQL Editor**
4. Copie-colle le contenu du fichier `scripts/create-admin-production-direct.sql`
5. Clique sur **Run** ou **Execute**

**Identifiants admin :**
- Email : `dasilva.jeanclaude@yahoo.fr`
- Mot de passe : `Jprout140617`

### Option B : Via script Node.js (si connexion fonctionne)

```powershell
npm run create-admin
```

---

## ✅ Étape 2 : Créer un utilisateur client de test (optionnel)

### Via SQL dans Neon :

```sql
-- Génère d'abord le hash avec: npm run generate-hash "motdepasse123"
-- Puis exécute dans Neon SQL Editor:

INSERT INTO "User" (id, email, password, "role", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'client@test.com',
    '$2a$10$HASH_GENERÉ_ICI', -- Remplace par le hash généré
    'CLIENT',
    NOW(),
    NOW()
);
```

### Via script Node.js :

```powershell
npm run create-client "client@test.com" "motdepasse123"
```

---

## ✅ Étape 3 : Vérifier les variables d'environnement Vercel

Dans **Vercel > Settings > Environment Variables**, assure-toi d'avoir :

- ✅ `DATABASE_URL` : URL de ta base Neon (production)
- ✅ `AUTH_SECRET` : `bcad126ea1bcb988f544b7c1d5b2b118`
- ✅ `NEXT_PUBLIC_SITE_URL` : URL de ton site Vercel

---

## ✅ Étape 4 : Tester les connexions

Après déploiement sur Vercel :

**Admin :**
- URL : `https://ton-site.vercel.app/admin/login`
- Email : `dasilva.jeanclaude@yahoo.fr`
- Mot de passe : `Jprout140617`

**Client :**
- URL : `https://ton-site.vercel.app/login`
- Email : celui que tu as créé

---

## 📝 Commandes utiles

```powershell
# Générer un hash bcrypt
npm run generate-hash "ton-mot-de-passe"

# Créer l'admin (si connexion fonctionne)
npm run create-admin

# Créer un client
npm run create-client "email@test.com" "motdepasse"
```

---

## ⚠️ Important

- Le script SQL `create-admin-production-direct.sql` est prêt à l'emploi avec le hash généré
- Exécute-le directement dans Neon SQL Editor
- Change le mot de passe admin après la première connexion en production !
