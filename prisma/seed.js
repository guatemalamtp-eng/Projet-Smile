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

const LEA_ARTWORKS = [
  {
    title: 'Fenêtre ouverte sur la lumière',
    technique: 'Gouache et pastel',
    description: "Une fenêtre comme cadre. La lumière du sud et les formes découpées, dans l'esprit de Matisse : couleur plate, joie du trait.",
    widthCm: 80,
    heightCm: 60,
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80',
  },
  {
    title: 'Intérieur aux couleurs du sud',
    technique: 'Gouache et pastel',
    description: 'Intérieur fauve : aplats de gouache et rehauts de pastel. Les motifs et la lumière rappellent les intérieurs méditerranéens.',
    widthCm: 65,
    heightCm: 50,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  },
  {
    title: 'Nu bleu, souvenir de Nice',
    technique: 'Gouache et pastel',
    description: 'Figure simplifiée, bleus et ocres. Le pastel adoucit les contours et donne de la profondeur à la gouache.',
    widthCm: 55,
    heightCm: 46,
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
  },
  {
    title: 'Forme intérieure',
    technique: 'Bronze',
    description: 'Volume organique à la manière de Moore : creux et pleins, forme qui invite à tourner autour. Bronze patiné.',
    widthCm: 60,
    heightCm: 50,
    imageUrl: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80',
  },
  {
    title: 'Figure couchée',
    technique: 'Bronze',
    description: 'Silhouette allongée, trouée par la lumière. Inspirée des figures couchées de Moore, entre paysage et corps.',
    widthCm: 80,
    heightCm: 35,
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
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
    avatarUrl: '/avatars/lea-martineau.jpg',
    isPublic: true,
    videoUrl: null,
    galleryUrls: [],
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
        status: 'AVAILABLE',
        artistId: lea.id,
      },
    });
  }
  console.log('✅', LEA_ARTWORKS.length, 'œuvres créées pour Léa (Matisse + Moore)');

  console.log('');
  console.log('🎉 Seed terminé. Admin + Léa (section Artistes) + ses œuvres.');
  console.log('   /artistes → voir Léa et ses œuvres');
  console.log('   Connexion client (Léa) : /login avec', leaEmail);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
