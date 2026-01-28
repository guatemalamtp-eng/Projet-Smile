-- Script SQL pour créer l'admin directement dans Neon
-- Exécute ce script dans Neon SQL Editor

-- Génère le hash bcrypt pour le mot de passe "Jprout140617"
-- (Génère-le avec: npm run generate-hash "Jprout140617")

-- Assure-toi que le rôle CLIENT existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');
    ELSIF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'CLIENT' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Role')) THEN
        ALTER TYPE "Role" ADD VALUE 'CLIENT';
    END IF;
END $$;

-- Vérifie si l'admin existe déjà
DO $$
DECLARE
    admin_exists BOOLEAN;
    password_hash TEXT;
BEGIN
    -- Génère le hash bcrypt (remplace par le hash généré avec generate-hash.js)
    -- Exemple de hash pour "Jprout140617": $2a$10$...
    password_hash := '$2a$10$VxKJ8QZ9Y5Z5Z5Z5Z5Z5Zu5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z'; -- REMPLACE PAR LE VRAI HASH
    
    -- Vérifie si un admin existe
    SELECT EXISTS(SELECT 1 FROM "User" WHERE role = 'ADMIN') INTO admin_exists;
    
    IF admin_exists THEN
        RAISE NOTICE 'Un administrateur existe déjà.';
    ELSE
        -- Crée l'admin
        INSERT INTO "User" (id, email, password, "role", "createdAt", "updatedAt")
        VALUES (
            gen_random_uuid()::text,
            'dasilva.jeanclaude@yahoo.fr',
            password_hash,
            'ADMIN',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Administrateur créé avec succès !';
        RAISE NOTICE 'Email: dasilva.jeanclaude@yahoo.fr';
        RAISE NOTICE 'Mot de passe: Jprout140617';
    END IF;
END $$;
