import Link from 'next/link';
import { getFeaturedArtworkOfTheDay } from '@/lib/artworks';
import { prisma } from '@/lib/prisma';
import { FeaturedArtwork } from '@/components/home/FeaturedArtwork';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, artists] = await Promise.all([
    getFeaturedArtworkOfTheDay(),
    prisma.user.findMany({
      where: { creatorProfile: { isPublic: true } },
      include: {
        creatorProfile: true,
        _count: { select: { artworks: true } },
      },
      orderBy: [{ name: 'asc' }, { email: 'asc' }],
    }),
  ]);

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col-reverse items-center gap-10 px-4 py-16 md:flex-row md:py-24">
        <div className="max-w-xl space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            Art abstrait contemporain
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            La lumière dans
            <span className="bg-gradient-to-r from-sky-400 to-rose-400 bg-clip-text text-transparent">
              {' '}
              la matière
            </span>
          </h1>
          <p className="text-sm leading-relaxed text-neutral-300">
            ArtsTigenn explore la frontière entre rêve et réalité à travers des
            toiles vibrantes. Chaque œuvre est une invitation à suspendre le
            temps et à se laisser traverser par la couleur.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
            >
              Découvrir la galerie
            </Link>
            <Link
              href="/artistes"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs font-medium text-neutral-200 hover:bg-white/5 transition"
            >
              Découvrir les artistes
            </Link>
          </div>
        </div>

        {featured ? (
            <FeaturedArtwork
              slug={featured.slug}
              title={featured.title}
              imageUrl={featured.imageUrl}
              artistName={featured.artist?.name}
            />
          ) : (
            <div className="relative h-[320px] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-[0_0_80px_rgba(56,189,248,0.15)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,#22d3ee33,transparent),radial-gradient(circle_at_100%_100%,#f472b633,transparent)]" />
              <div className="relative flex h-full items-center justify-center">
                <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-200">
                  Une toile, une histoire
                </span>
              </div>
            </div>
          )}
      </div>

      {artists.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pb-24">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Artistes à découvrir
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Découvrez les artistes et créateurs de la plateforme.
          </p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((creator) => (
              <li key={creator.id}>
                <Link
                  href={`/artistes/${creator.id}`}
                  className="block rounded-xl border border-white/10 bg-neutral-950/80 p-6 transition hover:border-white/20"
                >
                  {creator.creatorProfile?.avatarUrl ? (
                    <img
                      src={creator.creatorProfile.avatarUrl.startsWith('http') ? creator.creatorProfile.avatarUrl : creator.creatorProfile.avatarUrl}
                      alt=""
                      className="mb-4 aspect-square w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="mb-4 aspect-square w-full rounded-lg bg-white/5 flex items-center justify-center text-4xl text-neutral-600">
                      {creator.name?.[0] ?? creator.email[0].toUpperCase()}
                    </div>
                  )}
                  <h3 className="font-semibold text-white">
                    {creator.name || creator.email}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    {creator._count.artworks} œuvre{creator._count.artworks !== 1 ? 's' : ''}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/artistes"
            className="mt-6 inline-block text-sm text-neutral-400 hover:text-white transition"
          >
            Voir tous les artistes →
          </Link>
        </section>
      )}

      <section
        id="about"
        className="mx-auto max-w-4xl px-4 pb-16 pt-4 md:pb-24"
      >
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
          La plateforme
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-300">
          ArtsTigenn met en lumière artistes et artisans, connus ou à découvrir.
          Peinture, sculpture, projets sur commande : explorez les œuvres et
          contactez les créateurs pour vos projets.
        </p>
      </section>
    </div>
  );
}

