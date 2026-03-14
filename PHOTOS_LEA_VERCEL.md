# Photos de Léa Martineau — tout faire fonctionner sur Vercel

Toutes les photos utilisent **Picsum** (`https://picsum.photos/...`), qui charge correctement en production.

---

## Ce qui est déjà en place dans le code

- **Profil Léa** : photo de profil + 3 images dans la galerie du profil (Picsum).
- **9 œuvres** : chacune a 1 image principale + 2 photos dans « Autres vues » (Picsum).
- **Page détail œuvre** : affiche l’image principale + la section « Autres vues » avec les 2 photos en plus.
- **Migration** : la colonne `galleryUrls` existe dans le schéma et une migration l’ajoute en base.

---

## Étapes à faire (dans l’ordre)

### 1. Vérifier la base Neon (celle de Vercel)

- Va sur **https://console.neon.tech**.
- Récupère l’URL **Pooled** de ta base (Connection string).
- Tu en auras besoin pour l’étape 3.

---

### 2. Pousser le code sur GitHub

Dans le dossier du projet :

```powershell
cd C:\Users\Rumpl\Cursor
git add .
git status
git commit -m "fix: photos Léa (Picsum) + galleryUrls œuvres"
git push origin main
```

Vercel va redéployer. Le build exécute `prisma migrate deploy`, donc la colonne `galleryUrls` sera créée si ce n’est pas déjà fait.

---

### 3. Lancer le seed **une fois** avec la base de prod

Le seed remplit la base (admin, Léa, 9 œuvres avec toutes les photos). Il doit pointer vers **la même base que Vercel** (Neon prod).

1. Dans **C:\Users\Rumpl\Cursor**, crée ou édite le fichier **`.env`**.
2. Mets **uniquement** (ou au minimum) :
   ```env
   DATABASE_URL="postgresql://...ta_url_neon_pooled..."
   ```
   Colle l’URL **Pooled** copiée depuis Neon (étape 1).
3. Dans un terminal :
   ```powershell
   cd C:\Users\Rumpl\Cursor
   npm run prisma:seed
   ```
4. Tu dois voir :
   - Admin existe déjà (ou créé)
   - Léa mise à jour
   - Profil artiste Léa mis à jour
   - 9 œuvres créées pour Léa
   - 3 services créés pour Léa

Si une erreur s’affiche (ex. « column galleryUrls does not exist »), c’est que la migration n’a pas encore été appliquée sur cette base. Dans ce cas : push déjà fait (étape 2), attendre un déploiement Vercel réussi, puis refaire l’étape 3.

---

### 4. Vérifier sur le site Vercel

Ouvre l’URL de ton site (ex. `https://ton-projet.vercel.app`) et vérifie :

| Où | Ce que tu dois voir |
|----|----------------------|
| **/artistes** → clic sur **Léa Martineau** | Photo de profil + galerie (3 images) + liste des 9 œuvres avec vignettes. |
| **Clic sur une œuvre** (ex. « Mère et enfant ») | Grande image + section **« Autres vues »** avec 2 petites photos. |
| **/gallery** | Les 9 œuvres de Léa avec images. |
| **Page d’accueil** (à droite) | Une œuvre en avant avec image. |

Si une image ne s’affiche pas : recharge la page (F5) ou ouvre en navigation privée. Les URLs Picsum sont stables (même seed = même image).

---

## En résumé

| Étape | Action |
|-------|--------|
| 1 | Récupérer l’URL **Pooled** Neon (console.neon.tech). |
| 2 | `git push origin main` pour déclencher le déploiement Vercel (et les migrations). |
| 3 | Mettre `DATABASE_URL` (Neon prod) dans `.env` local, puis lancer `npm run prisma:seed`. |
| 4 | Contrôler sur l’URL Vercel : profil Léa, galerie, page détail des œuvres. |

Toutes les URLs d’images sont en **https://picsum.photos/seed/...** : pas de dépendance à Unsplash, ça fonctionne sur Vercel.
