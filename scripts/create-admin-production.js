// Script pour créer un admin en production
// Usage: node scripts/create-admin-production.js
// Assure-toi que DATABASE_URL pointe vers ta base de production

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Création de l\'admin en production...');

  const email = process.env.ADMIN_EMAIL || 'dasilva.jeanclaude@yahoo.fr';
  const password = process.env.ADMIN_PASSWORD || 'Jprout140617';

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
  const passwordHash = await bcrypt.hash(password, 10);

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
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
