-- Script SQL pour créer l'admin directement dans Neon
-- Copie-colle ce script dans Neon SQL Editor et exécute-le

-- 1. Assure-toi que le rôle CLIENT existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');
    ELSIF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'CLIENT' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Role')) THEN
        ALTER TYPE "Role" ADD VALUE 'CLIENT';
    END IF;
END $$;

-- 2. Vérifie si l'admin existe déjà, sinon le crée
DO $$
DECLARE
    admin_exists BOOLEAN;
    password_hash TEXT := '$2a$10$tj7jBmiZIXa8x1cFRVfJDO4SZBbEtzsFCV37DCA13dyY/g65Yg/u2';
BEGIN
    -- Vérifie si un admin existe
    SELECT EXISTS(SELECT 1 FROM "User" WHERE role = 'ADMIN') INTO admin_exists;
    
    IF admin_exists THEN
        RAISE NOTICE '✅ Un administrateur existe déjà.';
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
        RAISE NOTICE '✅ Administrateur créé avec succès !';
        RAISE NOTICE '   Email: dasilva.jeanclaude@yahoo.fr';
        RAISE NOTICE '   Mot de passe: Jprout140617';
    END IF;
END $$;

-- 3. Vérifie que l'admin a bien été créé
SELECT id, email, role, "createdAt" FROM "User" WHERE role = 'ADMIN';
