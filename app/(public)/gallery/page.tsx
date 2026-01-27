import type { Metadata } from 'next';
import { getPublicArtworks } from '@/lib/artworks';
import { ArtworkGrid } from '@/components/gallery/ArtworkGrid';

export const metadata: Metadata = {
  title: 'Galerie | Smile',
  description: "Découvrez les œuvres de l’artiste.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const artworks = await getPublicArtworks();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Galerie
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">
            Explorez les œuvres originales de l’artiste. Cliquez sur une
            pièce pour en découvrir les détails.
          </p>
        </div>
      </header>

      <ArtworkGrid artworks={artworks} />
    </main>
  );
}

