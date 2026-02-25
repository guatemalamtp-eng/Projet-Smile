import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const creator = await prisma.user.findFirst({
    where: { id, role: 'CREATOR', creatorProfile: { isPublic: true } },
    include: { creatorProfile: true },
  });
  if (!creator) return { title: 'Artiste introuvable | ArtsTigenn' };
  return {
    title: `${creator.name || creator.email} | Artistes | ArtsTigenn`,
    description: creator.creatorProfile?.bio ?? undefined,
  };
}

export default async function ArtistePage({ params }: Props) {
  const { id } = await params;
  const creator = await prisma.user.findFirst({
    where: { id, role: 'CREATOR', creatorProfile: { isPublic: true } },
    include: {
      creatorProfile: true,
      artworks: { take: 6, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!creator) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {creator.creatorProfile?.avatarUrl ? (
          <img
            src={creator.creatorProfile.avatarUrl}
            alt=""
            className="h-48 w-48 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-xl bg-white/5 text-6xl text-neutral-600">
            {creator.name?.[0] ?? creator.email[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {creator.name || creator.email}
          </h1>
          {creator.creatorProfile?.bio && (
            <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-400">
              {creator.creatorProfile.bio}
            </p>
          )}
          <Link
            href={`/projet-sur-commande?creator=${creator.id}`}
            className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
          >
            Demander un projet
          </Link>
        </div>
      </div>

      {creator.artworks.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Œuvres</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {creator.artworks.map((art) => (
              <li key={art.id}>
                <Link
                  href={`/artworks/${art.slug}`}
                  className="block rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="p-3 text-sm font-medium">{art.title}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/gallery"
            className="mt-4 inline-block text-sm text-neutral-400 hover:text-white transition"
          >
            Voir toute la galerie →
          </Link>
        </section>
      )}

      <div className="mt-10">
        <Link href="/artistes" className="text-sm text-neutral-400 hover:text-white transition">
          ← Tous les artistes
        </Link>
      </div>
    </div>
  );
}
