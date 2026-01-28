-- Script SQL pour créer un utilisateur client de test directement dans Neon
-- Copie-colle ce script dans Neon SQL Editor et exécute-le

-- Crée un utilisateur client de test
DO $$
DECLARE
    client_exists BOOLEAN;
    password_hash TEXT := '$2a$10$0Nbn5I4DqaPyiNAx1EeDguBLsUB1D1NFLgBJ2nFTnbHX79kcTJ5uG';
    client_email TEXT := 'client@test.com';
BEGIN
    -- Vérifie si le client existe déjà
    SELECT EXISTS(SELECT 1 FROM "User" WHERE email = client_email) INTO client_exists;
    
    IF client_exists THEN
        RAISE NOTICE '✅ Un utilisateur avec cet email existe déjà.';
    ELSE
        -- Crée le client
        INSERT INTO "User" (id, email, password, "name", "role", "createdAt", "updatedAt")
        VALUES (
            gen_random_uuid()::text,
            client_email,
            password_hash,
            'Client Test',
            'CLIENT',
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Utilisateur client créé avec succès !';
        RAISE NOTICE '   Email: client@test.com';
        RAISE NOTICE '   Mot de passe: client123';
    END IF;
END $$;

-- Vérifie que le client a bien été créé
SELECT id, email, "name", role, "createdAt" FROM "User" WHERE role = 'CLIENT';
