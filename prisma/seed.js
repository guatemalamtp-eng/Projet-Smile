// Seed principal : admin + Léa (client avec profil artiste) + œuvres de Léa
// Usage: npm run prisma:seed
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'oeuvre';
}

async function ensureUniqueSlug(slug) {
  let base = slug;
  let n = 0;
  while (true) {
    const s = n === 0 ? base : `${base}-${n}`;
    const exists = await prisma.artwork.findUnique({ where: { slug: s } });
    if (!exists) return s;
    n++;
  }
}

// 9 œuvres de Léa : image principale + 2 photos en plus (Picsum = URLs stables)
const LEA_ARTWORKS = [
  {
    title: 'Fenêtre ouverte sur la lumière',
    technique: 'Gouache et pastel',
    description: "Une fenêtre comme cadre. La lumière du sud et les formes découpées, dans l'esprit de Matisse : couleur plate, joie du trait. L'œuvre joue sur les aplats et la transparence du pastel pour suggérer l'éblouissement de l'été. Collection privée.",
    widthCm: 80,
    heightCm: 60,
    imageUrl: 'https://picsum.photos/seed/lea1/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea1a/800/600', 'https://picsum.photos/seed/lea1b/800/600'],
  },
  {
    title: 'Intérieur aux couleurs du sud',
    technique: 'Gouache et pastel',
    description: "Intérieur fauve : aplats de gouache et rehauts de pastel. Les motifs et la lumière rappellent les intérieurs méditerranéens. Tapis, plantes et fenêtre ouverte composent un espace coloré et vivant. Réalisé en atelier d'après des croquis de voyage.",
    widthCm: 65,
    heightCm: 50,
    imageUrl: 'https://picsum.photos/seed/lea2/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea2a/800/600', 'https://picsum.photos/seed/lea2b/800/600'],
  },
  {
    title: 'Nu bleu, souvenir de Nice',
    technique: 'Gouache et pastel',
    description: "Figure simplifiée, bleus et ocres. Le pastel adoucit les contours et donne de la profondeur à la gouache. Hommage aux baigneuses de Matisse et à la lumière de la Côte d'Azur. Pièce unique, signée au dos.",
    widthCm: 55,
    heightCm: 46,
    imageUrl: 'https://picsum.photos/seed/lea3/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea3a/800/600', 'https://picsum.photos/seed/lea3b/800/600'],
  },
  {
    title: 'Forme intérieure',
    technique: 'Bronze',
    description: "Volume organique à la manière de Moore : creux et pleins, forme qui invite à tourner autour. Bronze patiné à la cire, tirage limité. La sculpture dialogue avec l'espace et la lumière. Hauteur sous socle inclus.",
    widthCm: 60,
    heightCm: 50,
    imageUrl: 'https://picsum.photos/seed/lea4/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea4a/800/600', 'https://picsum.photos/seed/lea4b/800/600'],
  },
  {
    title: 'Figure couchée',
    technique: 'Bronze',
    description: "Silhouette allongée, trouée par la lumière. Inspirée des figures couchées de Moore, entre paysage et corps. Bronze à patine brune, édition de 8 exemplaires. Chaque pièce est numérotée et signée.",
    widthCm: 80,
    heightCm: 35,
    imageUrl: 'https://picsum.photos/seed/lea5/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea5a/800/600', 'https://picsum.photos/seed/lea5b/800/600'],
  },
  {
    title: 'Figure couchée II',
    technique: 'Bronze',
    description: "Variation sur le thème de la figure allongée. Formes fluides, trous de lumière. Bronze fondu au sable, finition mate. Le vide et le plein structurent la silhouette. Œuvre disponible.",
    widthCm: 70,
    heightCm: 40,
    imageUrl: 'https://picsum.photos/seed/lea6/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea6a/800/600', 'https://picsum.photos/seed/lea6b/800/600'],
  },
  {
    title: 'Forme intérieure, étude',
    technique: 'Bronze',
    description: "Étude en volume pour une forme intérieure. Creux et pleins, patine sombre. Maquette préparatoire qui explore l'équilibre des masses. Bronze, pièce unique.",
    widthCm: 45,
    heightCm: 45,
    imageUrl: 'https://picsum.photos/seed/lea7/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea7a/800/600', 'https://picsum.photos/seed/lea7b/800/600'],
  },
  {
    title: 'Figure debout',
    technique: 'Bronze',
    description: "Figure verticale à la manière de Moore. Silhouette épurée, jeu de vides et de pleins. La verticalité et les perforations créent un rythme. Bronze patiné, socle bois optionnel sur demande.",
    widthCm: 40,
    heightCm: 90,
    imageUrl: 'https://picsum.photos/seed/lea8/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea8a/800/600', 'https://picsum.photos/seed/lea8b/800/600'],
  },
  {
    title: 'Mère et enfant',
    technique: 'Bronze',
    description: "Groupe sculpté, thème récurrent chez Moore. Deux formes organiques enlacées : la mère et l'enfant comme un bloc unique, troué par la lumière. Bronze à patine verte-brune, édition limitée. Livraison possible sur devis.",
    widthCm: 50,
    heightCm: 55,
    imageUrl: 'https://picsum.photos/seed/lea9/800/600',
    galleryUrls: ['https://picsum.photos/seed/lea9a/800/600', 'https://picsum.photos/seed/lea9b/800/600'],
  },
];

async function main() {
  console.log('🌱 Seed...');

  // ——— 1. Admin ———
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Jprout140617';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    admin = await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL || 'dasilva.jeanclaude@yahoo.fr',
        password: passwordHash,
        name: 'Administrateur',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin créé :', admin.email);
  } else {
    console.log('✅ Admin existe déjà');
  }

  // ——— 2. Léa (client avec profil artiste visible sur /artistes) ———
  const leaEmail = process.env.LEA_EMAIL || 'lea.martineau@artstigenn.com';
  const leaPassword = process.env.LEA_PASSWORD || 'lea-artstigenn-2025';
  const leaName = process.env.LEA_NAME || 'Léa Martineau';
  const passwordHash = await bcrypt.hash(leaPassword, 10);

  let lea = await prisma.user.findFirst({
    where: { email: leaEmail },
    include: { creatorProfile: true },
  });

  if (!lea) {
    lea = await prisma.user.create({
      data: {
        email: leaEmail,
        password: passwordHash,
        name: leaName,
        role: 'CLIENT',
      },
      include: { creatorProfile: true },
    });
    console.log('✅ Léa créée (client) :', lea.email);
  } else {
    await prisma.user.update({
      where: { id: lea.id },
      data: { role: 'CLIENT', password: passwordHash, name: leaName },
    });
    lea = await prisma.user.findUnique({
      where: { id: lea.id },
      include: { creatorProfile: true },
    });
    console.log('✅ Léa mise à jour (client)');
  }

  const profileData = {
    bio: "Peintre abstraite née à Lyon, Léa Martineau vit et travaille à Paris. Son travail explore la frontière entre lumière et matière à travers des couches de peinture et de glacis. Diplômée des Beaux-Arts de Lyon, elle expose en France et à l'étranger depuis une quinzaine d'années. Ses œuvres figurent dans des collections privées en Europe.",
    avatarUrl: 'https://picsum.photos/seed/lea-avatar/400/400',
    isPublic: true,
    videoUrl: null,
    galleryUrls: [
      'https://picsum.photos/seed/leag1/600/600',
      'https://picsum.photos/seed/leag2/600/600',
      'https://picsum.photos/seed/leag3/600/600',
    ],
  };

  if (!lea.creatorProfile) {
    await prisma.creatorProfile.create({
      data: { userId: lea.id, ...profileData },
    });
    console.log('✅ Profil artiste Léa créé (visible sur /artistes)');
  } else {
    await prisma.creatorProfile.update({
      where: { userId: lea.id },
      data: profileData,
    });
    console.log('✅ Profil artiste Léa mis à jour');
  }

  // ——— 3. Œuvres de Léa (Matisse gouache/pastel + Moore) ———
  await prisma.artwork.deleteMany({ where: { artistId: lea.id } });

  for (const o of LEA_ARTWORKS) {
    const baseSlug = slugify(o.title);
    const slug = await ensureUniqueSlug(baseSlug);
    await prisma.artwork.create({
      data: {
        title: o.title,
        slug,
        description: o.description,
        technique: o.technique,
        widthCm: o.widthCm,
        heightCm: o.heightCm,
        imageUrl: o.imageUrl,
        galleryUrls: o.galleryUrls ?? [],
        status: 'AVAILABLE',
        artistId: lea.id,
      },
    });
  }
  console.log('✅', LEA_ARTWORKS.length, 'œuvres créées pour Léa');

  // ——— 4. Services de Léa (projet sur commande) ———
  const leaServices = [
    { name: 'Peinture sur mesure', slug: 'peinture-sur-mesure-lea', description: 'Œuvre unique à l\'huile, gouache ou pastel selon votre projet. Couleur et format au choix.' },
    { name: 'Sculpture sur commande', slug: 'sculpture-sur-commande-lea', description: 'Sculpture en bronze ou terre cuite, figure ou abstrait. De l\'esquisse à la réalisation.' },
    { name: 'Portrait', slug: 'portrait-lea', description: 'Portrait peint ou dessiné d\'après photo ou séance. Plusieurs techniques possibles.' },
  ];
  for (const s of leaServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: { ...s, creatorId: lea.id },
      update: { name: s.name, description: s.description, creatorId: lea.id },
    });
  }
  console.log('✅', leaServices.length, 'services créés pour Léa');

  console.log('');
  console.log('🎉 Seed terminé. Admin + Léa + œuvres + services.');
  console.log('   /artistes → Léa | /services → ses offres | /projet-sur-commande → la choisir');
  console.log('   Connexion client (Léa) : /login avec', leaEmail);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
