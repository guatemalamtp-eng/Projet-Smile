// Seed des œuvres de Léa Martineau : uniquement Matisse (gouache et pastel) + Moore (sculpture)
// Usage: node scripts/seed-artworks-lea.js
// À lancer après npm run seed-creator (Léa doit exister)
// Remplace toutes les œuvres existantes de Léa par ce set.

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
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

const OEUVRE_SEED = [
  // Peintures : style Matisse — gouache et pastel uniquement
  {
    title: 'Fenêtre ouverte sur la lumière',
    technique: 'Gouache et pastel',
    description: 'Une fenêtre comme cadre. La lumière du sud et les formes découpées, dans l\'esprit de Matisse : couleur plate, joie du trait.',
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
  // Sculptures : style Henry Moore (formes organiques, creux et pleins)
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
  console.log('🌱 Seed œuvres de Léa Martineau...');

  const lea = await prisma.user.findFirst({
    where: { email: 'lea.martineau@artstigenn.com' },
  });

  if (!lea) {
    console.error('❌ Artiste Léa introuvable. Lance d\'abord: npm run seed-creator');
    process.exit(1);
  }

  const deleted = await prisma.artwork.deleteMany({ where: { artistId: lea.id } });
  if (deleted.count > 0) {
    console.log(`🗑️ ${deleted.count} ancienne(s) œuvre(s) de Léa supprimée(s).`);
  }

  for (const o of OEUVRE_SEED) {
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
    console.log('✅', o.title, '—', o.technique);
  }

  console.log('');
  console.log(`🎉 Léa Martineau : ${OEUVRE_SEED.length} œuvres (Matisse — gouache & pastel ; Moore — sculpture).`);
  console.log('   Voir /artistes → Léa, ou /gallery');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
