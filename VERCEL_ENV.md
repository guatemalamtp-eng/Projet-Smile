# Variables d'environnement pour Vercel

Configure ces variables dans **Vercel > Settings > Environment Variables** :

## Variables requises

### 1. `DATABASE_URL`
**Type:** Production, Preview, Development  
**Valeur:** Ton URL de connexion Neon PostgreSQL

```
postgresql://neondb_owner:TON_MOT_DE_PASSE@ep-snowy-sun-ageifnrm-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

⚠️ Remplace `TON_MOT_DE_PASSE` par ton vrai mot de passe Neon.

### 2. `AUTH_SECRET`
**Type:** Production, Preview, Development  
**Valeur:** Une chaîne aléatoire longue et sécurisée (minimum 32 caractères)

Tu peux générer une clé avec cette commande :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ou utilise un générateur en ligne : https://generate-secret.vercel.app/32

Exemple de valeur :
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## Variables optionnelles

### 3. `AUTH_COOKIE_NAME`
**Type:** Production, Preview, Development (optionnel)  
**Valeur par défaut:** `smile_session`

Si tu veux changer le nom du cookie de session, tu peux définir cette variable. Sinon, elle utilisera `smile_session` par défaut.

---

## Comment les ajouter dans Vercel

1. Va sur ton projet dans Vercel
2. Clique sur **Settings**
3. Clique sur **Environment Variables**
4. Ajoute chaque variable :
   - **Key:** Le nom de la variable (ex: `DATABASE_URL`)
   - **Value:** La valeur
   - **Environment:** Sélectionne Production, Preview, et Development (ou seulement Production si tu veux)
5. Clique sur **Save**
6. Redéploie ton projet pour que les changements prennent effet

---

## Vérification

Après avoir ajouté les variables, vérifie que le build passe et que l'application fonctionne correctement.
