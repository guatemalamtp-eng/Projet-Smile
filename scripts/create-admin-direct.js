// Script pour créer l'admin directement avec gestion d'erreur améliorée
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Configuration Prisma avec gestion SSL améliorée
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('sslmode=require', 'sslmode=prefer') || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🌱 Création de l\'admin en production...');
  console.log('📡 Connexion à la base de données...');

  const email = process.env.ADMIN_EMAIL || 'dasilva.jeanclaude@yahoo.fr';
  const password = process.env.ADMIN_PASSWORD || 'Jprout140617';

  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('✅ Un administrateur existe déjà.');
      console.log(`   Email: ${existingAdmin.email}`);
      return;
    }

    // Créer l'admin
    console.log('🔐 Génération du hash du mot de passe...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('👤 Création de l\'administrateur...');
    const admin = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: 'Administrateur',
        role: 'ADMIN',
      },
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log(`   ID: ${admin.id}`);
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    if (error.code === 'P1001') {
      console.error('   Problème de connexion à la base de données.');
      console.error('   Vérifie que DATABASE_URL est correct dans .env');
    }
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
