'use client';

import Link from 'next/link';
import type { ArtworkStatus } from '@prisma/client';
import { useState } from 'react';

type ArtworkCardProps = {
  slug: string;
  title: string;
  imageUrl: string;
  status: ArtworkStatus;
  widthCm?: number | null;
  heightCm?: number | null;
  technique?: string | null;
  likesCount: number;
  artist?: { id: string; name: string | null } | null;
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
    artist,
  } = props;

  const [imgError, setImgError] = useState(false);
  const isSold = status === 'SOLD';

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-950/40 hover:bg-neutral-900/60 transition">
      <Link
        href={`/artworks/${slug}`}
        className="group block"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900/60">
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                isSold ? 'grayscale' : ''
              }`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-500 text-sm">
              Œuvre
            </div>
          )}

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
          <div className="flex items-center gap-1 text-xs text-neutral-400 shrink-0">
            <span>❤</span>
            <span>{likesCount}</span>
          </div>
        </div>
      </Link>
      {artist && (
        <p className="px-4 pb-3 pt-0">
          <Link
            href={`/artistes/${artist.id}`}
            className="text-xs text-neutral-500 hover:text-white transition"
          >
            {artist.name ?? 'Artiste'}
          </Link>
        </p>
      )}
    </div>
  );
}

