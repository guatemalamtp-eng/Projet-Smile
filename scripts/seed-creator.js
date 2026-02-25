// Seed du premier créateur + profil + services
// Usage: node scripts/seed-creator.js
// Variables optionnelles: CREATOR_EMAIL, CREATOR_PASSWORD, CREATOR_NAME

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed créateur (profil + services)...');

  const email = process.env.CREATOR_EMAIL || 'creator@artstigenn.com';
  const password = process.env.CREATOR_PASSWORD || 'creator1';
  const name = process.env.CREATOR_NAME || 'Léa Martineau';

  // Créer ou récupérer l'utilisateur créateur
  let creator = await prisma.user.findFirst({
    where: { email },
    include: { creatorProfile: true },
  });

  const passwordHash = await bcrypt.hash(password, 10);

  if (!creator) {
    creator = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        role: 'CREATOR',
      },
      include: { creatorProfile: true },
    });
    console.log('✅ Compte créateur créé.');
    console.log(`   Email: ${creator.email}`);
    console.log(`   Mot de passe: ${password}`);
  } else {
    // Mettre à jour le rôle et le mot de passe au cas où (ex. ancien compte)
    await prisma.user.update({
      where: { id: creator.id },
      data: { role: 'CREATOR', password: passwordHash, name },
    });
    creator = await prisma.user.findUnique({
      where: { id: creator.id },
      include: { creatorProfile: true },
    });
    if (!creator) throw new Error('Utilisateur introuvable après mise à jour');
    console.log('✅ Compte créateur existant mis à jour (mot de passe réinitialisé).');
    console.log(`   Email: ${creator.email}`);
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
  if (!creator.creatorProfile) {
    await prisma.creatorProfile.create({
      data: { userId: creator.id, ...profileData },
    });
    console.log('✅ Profil créateur créé (Léa Martineau, avatar blonde, visible sur /artistes).');
  } else {
    await prisma.creatorProfile.update({
      where: { userId: creator.id },
      data: { ...profileData },
    });
    console.log('✅ Profil créateur mis à jour (avatar et bio).');
  }

  // Créer 2 services par défaut s'ils n'existent pas
  const defaultServices = [
    { name: 'Peinture sur commande', slug: 'peinture-sur-commande', description: 'Œuvre unique réalisée selon vos envies : format, thème, couleurs. Idéal pour un intérieur ou un cadeau.' },
    { name: 'Projet artistique sur mesure', slug: 'projet-artistique-sur-mesure', description: 'Projet personnalisé : série d\'œuvres, collaboration, décoration murale ou événementiel.' },
  ];

  for (const s of defaultServices) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (!existing) {
      await prisma.service.create({
        data: {
          ...s,
          creatorId: creator.id,
        },
      });
      console.log(`✅ Service créé : ${s.name}`);
    }
  }

  console.log('');
  console.log('🎉 Seed créateur terminé. Tu peux :');
  console.log('   - Aller sur /artistes pour voir le créateur');
  console.log('   - Aller sur /services pour voir les services');
  console.log('   - Te connecter en créateur : /admin/login avec ' + email);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
