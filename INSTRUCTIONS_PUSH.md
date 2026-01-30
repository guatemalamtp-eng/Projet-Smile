# Instructions pour pousser le code vers GitHub

## Méthode la plus simple

### Étape 1 : Ouvrir PowerShell

1. Appuie sur `Windows + R`
2. Tape : `powershell`
3. Appuie sur `Entrée`

### Étape 2 : Exécuter ces commandes (copie-colle)

```powershell
cd C:\Users\Rumpl\Cursor
git push origin main
```

### Étape 3 : Si ça ne marche pas

```powershell
cd C:\Users\Rumpl\Cursor
git remote remove origin
git remote add origin https://github.com/guatemalamtp-eng/Projet-Smile.git
git push -u origin main
```

GitHub va demander tes identifiants.

---

## Alternative : Utiliser le script automatique

1. Double-clique sur le fichier `push-to-github.ps1` dans le dossier `C:\Users\Rumpl\Cursor`
2. Le script va essayer de pousser automatiquement

---

## Alternative : Via GitHub Desktop

1. Télécharge : https://desktop.github.com
2. Installe GitHub Desktop
3. Ouvre GitHub Desktop
4. File > Add Local Repository
5. Sélectionne : `C:\Users\Rumpl\Cursor`
6. Clique sur "Push origin"

---

## Alternative : Upload direct sur GitHub

1. Va sur : https://github.com/guatemalamtp-eng/Projet-Smile
2. Clique sur "Upload files"
3. Glisse-dépose tous les fichiers depuis `C:\Users\Rumpl\Cursor`
4. Commit directement

---

## Après le push réussi

1. Vercel va automatiquement détecter le push
2. Le build va démarrer
3. Une fois terminé, crée ton admin :
   - Ouvre : `https://ton-site.vercel.app/api/setup-admin`
4. Teste les connexions :
   - Admin : `https://ton-site.vercel.app/admin/login`
   - Client : `https://ton-site.vercel.app/login`
