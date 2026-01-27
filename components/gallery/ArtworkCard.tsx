'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ArtworkStatus } from '@prisma/client';

type ArtworkCardProps = {
  slug: string;
  title: string;
  imageUrl: string;
  status: ArtworkStatus;
  widthCm?: number | null;
  heightCm?: number | null;
  technique?: string | null;
  likesCount: number;
};

export function ArtworkCard(props: ArtworkCardProps) {
  const {
    slug,
    title,
    imageUrl,
    status,
    widthCm,
    heightCm,
    technique,
    likesCount,
  } = props;

  const isSold = status === 'SOLD';

  return (
    <Link
      href={`/artworks/${slug}`}
      className="group relative block overflow-hidden rounded-xl border border-white/10 bg-neutral-950/40 hover:bg-neutral-900/60 transition"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={`object-cover transition duration-500 group-hover:scale-105 ${
            isSold ? 'grayscale' : ''
          }`}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />

        {isSold && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Vendu
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white line-clamp-1">
            {title}
          </h3>
          <p className="mt-1 text-xs text-neutral-400 line-clamp-1">
            {technique ?? 'Technique mixte'}
            {widthCm && heightCm
              ? ` · ${widthCm}×${heightCm} cm`
              : null}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <span>❤</span>
          <span>{likesCount}</span>
        </div>
      </div>
    </Link>
  );
}

