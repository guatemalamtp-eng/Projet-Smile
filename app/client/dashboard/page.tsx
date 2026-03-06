import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'CLIENT') {
    return null;
  }

  // Œuvres du client (ex. Léa : celles créées pour elle avec artistId = user.id)
  const myArtworks = await prisma.artwork.findMany({
    where: { artistId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      technique: true,
      status: true,
    },
  });

  // Messages du client (avec l'œuvre liée)
  const [messages, messagesCount] = await Promise.all([
    prisma.message.findMany({
      where: { email: user.email },
      include: { artwork: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.message.count({ where: { email: user.email } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue, {user.name || user.email}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Votre espace client
          </p>
        </header>

        {myArtworks.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-300 mb-4">
              Mes œuvres
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Les œuvres de votre profil artiste (visibles sur la page Artistes).
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {myArtworks.map((art) => (
                <li key={art.id}>
                  <Link
                    href={`/artworks/${art.slug}`}
                    className="block rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition"
                  >
                    <div className="relative aspect-square bg-neutral-900/60 overflow-hidden">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="p-3 text-sm font-medium">{art.title}</p>
                    <p className="px-3 pb-3 text-xs text-neutral-500">
                      {art.technique ?? '—'}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/artistes/${user.id}`}
              className="mt-4 inline-block text-xs text-neutral-400 hover:text-white transition"
            >
              Voir mon profil public →
            </Link>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-300">
              Mes messages
            </h2>
            <p className="mt-2 text-2xl font-bold">{messagesCount}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Messages envoyés à l&apos;artiste
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-300">
              Galerie
            </h2>
            <p className="mt-2 text-2xl font-bold">Toutes les œuvres</p>
            <Link
              href="/gallery"
              className="mt-2 inline-block text-xs text-neutral-400 hover:text-white transition"
            >
              Voir la galerie →
            </Link>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-300 mb-4">
              Derniers messages envoyés
            </h2>
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className="border-l-2 border-white/10 pl-3 py-1 text-sm text-neutral-300"
                >
                  <p className="line-clamp-2">{msg.content}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {msg.createdAt.toLocaleDateString('fr-FR')}
                    {msg.artwork && (
                      <>
                        {' · '}
                        <Link
                          href={`/artworks/${msg.artwork.slug}`}
                          className="hover:text-neutral-400 transition"
                        >
                          {msg.artwork.title}
                        </Link>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gallery"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-white/10 transition"
            >
              Explorer la galerie
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-white/10 transition"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
