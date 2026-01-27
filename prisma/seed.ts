import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Vérifier si un admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log('✅ Un administrateur existe déjà.');
    return;
  }

  // Créer l'admin par défaut
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Jprout140617';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'dasilva.jeanclaude@yahoo.fr',
      password: passwordHash,
      name: 'Administrateur',
      role: 'ADMIN',
    },
  });

  console.log('✅ Administrateur créé avec succès !');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Mot de passe: ${defaultPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
