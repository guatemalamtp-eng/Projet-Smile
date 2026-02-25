// Seed de l’artiste Léa Martineau (personne qui a rejoint le site, pas l’admin)
// Usage: node scripts/seed-creator.js
// Variables optionnelles: LEA_EMAIL, LEA_PASSWORD, LEA_NAME

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed artiste Léa Martineau (profil + services)...');

  const email = process.env.LEA_EMAIL || process.env.CREATOR_EMAIL || 'lea.martineau@artstigenn.com';
  const password = process.env.LEA_PASSWORD || process.env.CREATOR_PASSWORD || 'lea-artstigenn-2025';
  const name = process.env.LEA_NAME || process.env.CREATOR_NAME || 'Léa Martineau';

  // Migration : si l’ancien compte "creator@artstigenn.com" existe, le renommer en Léa
  const oldCreator = await prisma.user.findFirst({
    where: { email: 'creator@artstigenn.com' },
  });
  if (oldCreator && email !== 'creator@artstigenn.com') {
    const existingNew = await prisma.user.findUnique({ where: { email } });
    if (!existingNew) {
      await prisma.user.update({
        where: { id: oldCreator.id },
        data: { email, name, role: 'CLIENT' },
      });
      console.log('✅ Ancien compte creator@artstigenn.com renommé en ' + email);
    }
  }

  // Créer ou récupérer l'utilisateur créateur (Léa)
  let lea = await prisma.user.findFirst({
    where: { email },
    include: { creatorProfile: true },
  });

  const passwordHash = await bcrypt.hash(password, 10);

  if (!lea) {
    lea = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        role: 'CLIENT',
      },
      include: { creatorProfile: true },
    });
    console.log('✅ Compte client Léa créé.');
    console.log(`   Email: ${lea.email}`);
    console.log(`   Mot de passe: ${password}`);
  } else {
    await prisma.user.update({
      where: { id: lea.id },
      data: { role: 'CLIENT', password: passwordHash, name },
    });
    lea = await prisma.user.findUnique({
      where: { id: lea.id },
      include: { creatorProfile: true },
    });
    if (!lea) throw new Error('Utilisateur introuvable après mise à jour');
    console.log('✅ Compte Léa mis à jour (rôle client).');
    console.log(`   Email: ${lea.email}`);
    console.log(`   Mot de passe: ${password}`);
  }

  // Créer ou mettre à jour le profil (artiste fictif : Léa Martineau, visage blonde)
  const bio = `Peintre abstraite née à Lyon, Léa Martineau vit et travaille à Paris. Son travail explore la frontière entre lumière et matière à travers des couches de peinture et de glacis. Diplômée des Beaux-Arts de Lyon, elle expose en France et à l'étranger depuis une quinzaine d'années. Ses œuvres figurent dans des collections privées en Europe. Elle accepte les commandes et projets sur mesure pour particuliers et professionnels.`;
  const avatarUrl = '/avatars/lea-martineau.jpg';
  const profileData = {
    bio,
    avatarUrl,
    isPublic: true,
    videoUrl: null,
    galleryUrls: [],
  };
  if (!lea.creatorProfile) {
    await prisma.creatorProfile.create({
      data: { userId: lea.id, ...profileData },
    });
    console.log('✅ Profil créateur créé (Léa Martineau, avatar blonde, visible sur /artistes).');
  } else {
    await prisma.creatorProfile.update({
      where: { userId: lea.id },
      data: { ...profileData },
    });
    console.log('✅ Profil créateur mis à jour (avatar et bio).');
  }

  // Pas de services pour Léa (rubrique client)


  console.log('');
  console.log('🎉 Seed Léa terminé (rubrique client).');
  console.log('   - Aller sur /artistes pour voir Léa');
  console.log('   - Te connecter en tant qu’artiste (Léa) : /admin/login avec ' + email);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
