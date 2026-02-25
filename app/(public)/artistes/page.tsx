import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Artistes | ArtsTigenn',
  description: 'Découvrez les artistes et créateurs de la plateforme ArtsTigenn.',
};

export const dynamic = 'force-dynamic';

export default async function ArtistesPage() {
  // Tous les utilisateurs avec un profil artiste public (ex. Léa en CLIENT)
  const creators = await prisma.user.findMany({
    where: {
      creatorProfile: { isPublic: true },
    },
    include: {
      creatorProfile: true,
      _count: { select: { artworks: true } },
    },
    orderBy: [{ name: 'asc' }, { email: 'asc' }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Artistes & créateurs
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Découvrez les artistes et professionnels de la plateforme.
        </p>
      </header>

      {creators.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Aucun artiste pour le moment. Revenez bientôt.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <li
              key={creator.id}
              className="rounded-xl border border-white/10 bg-neutral-950/80 p-6 transition hover:border-white/20"
            >
              <Link href={`/artistes/${creator.id}`} className="block">
                {creator.creatorProfile?.avatarUrl ? (
                  <img
                    src={creator.creatorProfile.avatarUrl}
                    alt=""
                    className="mb-4 aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="mb-4 aspect-square w-full rounded-lg bg-white/5 flex items-center justify-center text-4xl text-neutral-600">
                    {creator.name?.[0] ?? creator.email[0].toUpperCase()}
                  </div>
                )}
                <h2 className="font-semibold text-white">
                  {creator.name || creator.email}
                </h2>
                {creator.creatorProfile?.bio && (
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-400">
                    {creator.creatorProfile.bio}
                  </p>
                )}
                <p className="mt-2 text-xs text-neutral-500">
                  {creator._count.artworks} œuvre{creator._count.artworks !== 1 ? 's' : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 rounded-xl border border-white/10 bg-neutral-950/80 p-6">
        <h2 className="font-semibold text-white">Un projet sur commande ?</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Découvrez nos services et demandez un devis.
        </p>
        <Link
          href="/projet-sur-commande"
          className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
        >
          Demander un projet
        </Link>
      </div>
    </div>
  );
}
