# Guide pour pousser vers GitHub

## ⚠️ Important : Tu dois être dans le bon dossier !

## Commande à exécuter dans PowerShell :

```powershell
# 1. Aller dans le dossier du projet
cd C:\Users\Rumpl\Cursor

# 2. Vérifier que tu es dans le bon dossier
git status

# 3. Pousser vers GitHub
git push origin main
```

## Si ça ne marche toujours pas :

### Option A : Push simple
```powershell
cd C:\Users\Rumpl\Cursor
git push
```

### Option B : Vérifier le remote
```powershell
cd C:\Users\Rumpl\Cursor
git remote -v
git push -u origin main
```

### Option C : Si le token GitHub est expiré
```powershell
cd C:\Users\Rumpl\Cursor
git remote remove origin
git remote add origin https://github.com/guatemalamtp-eng/Projet-Smile.git
git push -u origin main
```

## Vérification rapide :

```powershell
# Vérifier que tu es dans le bon dossier
cd C:\Users\Rumpl\Cursor
ls
# Tu devrais voir : app, prisma, scripts, package.json, etc.

# Vérifier l'état Git
git status
# Tu devrais voir : "Your branch is ahead of 'origin/main' by X commits"
```
