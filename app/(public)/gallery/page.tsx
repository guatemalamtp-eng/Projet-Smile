import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicArtworks } from '@/lib/artworks';
import { ArtworkGrid } from '@/components/gallery/ArtworkGrid';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Galerie | ArtsTigenn',
  description: 'Découvrez les œuvres des artistes.',
};

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ artist?: string }> };

export default async function GalleryPage({ searchParams }: Props) {
  const { artist: artistId } = await searchParams;
  const artworks = await getPublicArtworks(artistId || undefined);

  let artistName: string | null = null;
  if (artistId) {
    const u = await prisma.user.findUnique({
      where: { id: artistId },
      select: { name: true },
    });
    artistName = u?.name ?? null;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <nav className="mb-2 text-sm text-neutral-400">
            <Link href="/" className="hover:text-white transition">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Galerie</span>
            {artistName && (
              <>
                <span className="mx-2">/</span>
                <span className="text-white">{artistName}</span>
              </>
            )}
          </nav>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {artistName ? `Œuvres de ${artistName}` : 'Galerie'}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">
            {artistName
              ? 'Toutes les œuvres de cet artiste. Cliquez sur une pièce pour les détails.'
              : 'Explorez les œuvres des artistes. Cliquez sur une pièce pour en découvrir les détails.'}
          </p>
        </div>
        {artistId && artistName && (
          <Link
            href="/gallery"
            className="shrink-0 text-sm text-neutral-400 hover:text-white transition"
          >
            Voir toute la galerie
          </Link>
        )}
      </header>

      <ArtworkGrid artworks={artworks} />
    </main>
  );
}
