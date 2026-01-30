# 🎯 GUIDE COMPLET : Connexion Admin + Login Client

## ⚠️ POURQUOI ÇA NE MARCHE PAS ENCORE ?

**Le problème :** 
- ✅ Le code est prêt sur ton ordinateur
- ❌ Le code n'est PAS encore sur GitHub
- ❌ Vercel déploie encore l'ANCIEN code (sans les pages de connexion)

**La solution :** Il faut pousser le code vers GitHub pour que Vercel le déploie.

---

## 📋 ÉTAPE PAR ÉTAPE - FAIS EXACTEMENT ÇA

### ÉTAPE 1 : Ouvrir PowerShell dans le bon dossier

1. Appuie sur `Windows + R`
2. Tape : `powershell`
3. Appuie sur `Entrée`
4. Tape exactement ça :
```powershell
cd C:\Users\Rumpl\Cursor
```

### ÉTAPE 2 : Vérifier que tu es au bon endroit

Tape ça :
```powershell
git status
```

Tu dois voir : `Your branch is ahead of 'origin/main' by 6 commits`

### ÉTAPE 3 : Pousser vers GitHub

**Option A : Si le token fonctionne**
```powershell
git push origin main
```

**Option B : Si ça ne marche pas (token expiré)**
```powershell
# Supprimer l'ancien remote
git remote remove origin

# Ajouter le nouveau remote
git remote add origin https://github.com/guatemalamtp-eng/Projet-Smile.git

# Pousser (GitHub demandera tes identifiants)
git push -u origin main
```

### ÉTAPE 4 : Attendre que Vercel déploie

1. Va sur https://vercel.com
2. Connecte-toi
3. Va sur ton projet
4. Regarde les "Deployments"
5. Attends que le build passe (vert ✅)

### ÉTAPE 5 : Créer ton compte admin

Une fois le déploiement terminé, ouvre cette URL dans ton navigateur :
```
https://ton-site.vercel.app/api/setup-admin
```

Tu verras un message JSON qui confirme la création.

### ÉTAPE 6 : Tester la connexion admin

Va sur :
```
https://ton-site.vercel.app/admin/login
```

Connecte-toi avec :
- Email : `dasilva.jeanclaude@yahoo.fr`
- Mot de passe : `Jprout140617`

### ÉTAPE 7 : Tester la connexion client

Va sur :
```
https://ton-site.vercel.app/login
```

---

## 🔍 VÉRIFICATION : Où sont les liens de connexion ?

### Sur le site public :

1. Va sur `https://ton-site.vercel.app`
2. En haut à droite, tu dois voir un lien **"Connexion"**
3. Ce lien mène vers `/login` (connexion client)

### Pour l'admin :

1. Va directement sur : `https://ton-site.vercel.app/admin/login`
2. C'est la page de connexion admin

---

## 📝 RÉSUMÉ DES URLS

| Type | URL | Identifiants |
|------|-----|--------------|
| **Admin** | `https://ton-site.vercel.app/admin/login` | dasilva.jeanclaude@yahoo.fr / Jprout140617 |
| **Client** | `https://ton-site.vercel.app/login` | (créer avec `/api/setup-client`) |
| **Créer Admin** | `https://ton-site.vercel.app/api/setup-admin` | (ouvre dans navigateur) |
| **Créer Client** | `https://ton-site.vercel.app/api/setup-client?email=test@test.com&password=test123` | (ouvre dans navigateur) |

---

## ❓ SI ÇA NE MARCHE TOUJOURS PAS

Dis-moi :
1. As-tu réussi le `git push` ?
2. Quel est le dernier commit sur GitHub ? (va sur https://github.com/guatemalamtp-eng/Projet-Smile)
3. Le build Vercel passe-t-il ? (vert ✅ ou rouge ❌)
4. Quelle URL exacte tu essaies d'ouvrir ?
