import type { ArtworkStatus } from '@prisma/client';
import { ArtworkCard } from './ArtworkCard';

type ArtworkGridProps = {
  artworks: {
    id: string;
    slug: string;
    title: string;
    imageUrl: string;
    status: ArtworkStatus;
    widthCm?: number | null;
    heightCm?: number | null;
    technique?: string | null;
    likesCount: number;
  }[];
};

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-400">
        Aucune œuvre n’est disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} {...artwork} />
      ))}
    </div>
  );
}

