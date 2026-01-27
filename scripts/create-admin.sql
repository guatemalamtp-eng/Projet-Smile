-- Script SQL pour créer l'admin directement dans la base de données
-- 
-- ÉTAPE 1: Génère le hash bcrypt avec:
--   node scripts/generate-hash.js "Jprout140617"
--
-- ÉTAPE 2: Remplace $2a$10$... ci-dessous par le hash généré
--
-- ÉTAPE 3: Exécute ce script dans ton interface Neon ou via psql

INSERT INTO "User" (id, email, password, "name", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'dasilva.jeanclaude@yahoo.fr',
  '$2a$10$REMPLACE_PAR_LE_HASH_GENERE', -- Remplace par le hash généré avec generate-hash.js
  'Administrateur',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
