// Seed des œuvres de Léa Martineau (peintures + sculptures, inspirées des grands)
// Usage: node scripts/seed-artworks-lea.js
// À lancer après npm run seed-creator (Léa doit exister)

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
  // Peintures (inspirées des grands)
  {
    title: 'Composition en bleu et or',
    technique: 'Huile sur toile',
    description: 'Hommage à la couleur pure et au mouvement. Les formes géométriques et les aplats dialoguent dans un équilibre lyrique.',
    widthCm: 120,
    heightCm: 90,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
  },
  {
    title: 'Nymphéas, reflets',
    technique: 'Huile sur toile',
    description: 'Lumière et eau. Une surface vibrante où le ciel et les reflets se confondent dans une palette de verts et de bleus.',
    widthCm: 100,
    heightCm: 81,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  },
  {
    title: 'Champ de couleur n°5',
    technique: 'Acrylique sur toile',
    description: 'Un rectangle de couleur qui respire. Les bords flous et la profondeur du rouge invitent à la contemplation.',
    widthCm: 180,
    heightCm: 120,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  },
  {
    title: 'Fenêtre ouverte sur la lumière',
    technique: 'Gouache et pastel',
    description: 'Une fenêtre comme cadre. La lumière du sud et des formes découpées rappellent la joie du fauvisme.',
    widthCm: 80,
    heightCm: 60,
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80',
  },
  {
    title: 'Outrenoir 12',
    technique: 'Mixed media, noir et matière',
    description: 'Le noir comme lumière. Les reliefs et les reflets transforment l’obscurité en espace infini.',
    widthCm: 130,
    heightCm: 97,
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80',
  },
  {
    title: 'Série « Lumière du matin »',
    technique: 'Huile sur toile',
    description: 'Première heure du jour. Les touches rapides capturent le changement de la lumière sur le paysage.',
    widthCm: 65,
    heightCm: 54,
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
  },
  // Sculptures (inspirées des grands)
  {
    title: 'Oiseau dans l\'espace',
    technique: 'Bronze poli',
    description: 'Forme épurée entre oiseau et fuseau. Le bronze capte la lumière et suggère le mouvement dans l’espace.',
    widthCm: 45,
    heightCm: 120,
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
  },
  {
    title: 'Figure debout',
    technique: 'Bronze patiné',
    description: 'Une silhouette allongée, à la frontière du visible. La matière garde les traces du geste et du temps.',
    widthCm: 25,
    heightCm: 85,
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
  },
  {
    title: 'Forme intérieure',
    technique: 'Pierre et bronze',
    description: 'Volume organique traversé de creux et de pleins. Le vide et le plein dialoguent comme dans la sculpture moderne.',
    widthCm: 60,
    heightCm: 50,
    imageUrl: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80',
  },
  {
    title: 'Mobile rouge et noir',
    technique: 'Métal découpé et tiges',
    description: 'Équilibre et mouvement. Les formes suspendues réagissent à l’air et à la lumière.',
    widthCm: 100,
    heightCm: 80,
    imageUrl: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
  },
];

async function main() {
  console.log('🌱 Seed œuvres de Léa Martineau...');

  const lea = await prisma.user.findFirst({
    where: { email: 'creator@artstigenn.com', role: 'CREATOR' },
  });

  if (!lea) {
    console.error('❌ Créateur Léa introuvable. Lance d’abord: npm run seed-creator');
    process.exit(1);
  }

  let created = 0;
  for (const o of OEUVRE_SEED) {
    const baseSlug = slugify(o.title);
    const slug = await ensureUniqueSlug(baseSlug);
    const existing = await prisma.artwork.findUnique({ where: { slug } });
    if (existing) {
      console.log('⏭️ Déjà existant:', o.title);
      continue;
    }
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
    console.log('✅ Créé:', o.title);
    created++;
  }

  console.log('');
  console.log(`🎉 Terminé. ${created} œuvre(s) créée(s) pour Léa Martineau.`);
  console.log('   Voir /artistes puis cliquer sur Léa, ou /gallery');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
