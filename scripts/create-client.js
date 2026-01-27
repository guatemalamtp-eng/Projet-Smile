// Script pour créer un utilisateur client
// Usage: node scripts/create-client.js "email@example.com" "mot-de-passe"

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node scripts/create-client.js "email@example.com" "mot-de-passe"');
    process.exit(1);
  }

  console.log('🌱 Création d\'un utilisateur client...');

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('❌ Un utilisateur avec cet email existe déjà.');
    console.log(`   Email: ${existingUser.email}`);
    console.log(`   Rôle: ${existingUser.role}`);
    return;
  }

  // Créer le client
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name: email.split('@')[0], // Utilise la partie avant @ comme nom par défaut
      role: 'CLIENT',
    },
  });

  console.log('✅ Utilisateur client créé avec succès !');
  console.log(`   Email: ${user.email}`);
  console.log(`   Mot de passe: ${password}`);
  console.log(`   Rôle: ${user.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
