'use client';

import Link from 'next/link';
import { useState } from 'react';

type FeaturedArtworkProps = {
  slug: string;
  title: string;
  imageUrl: string;
  artistName?: string | null;
};

export function FeaturedArtwork({ slug, title, imageUrl, artistName }: FeaturedArtworkProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/artworks/${slug}`}
      className="group relative flex h-[320px] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-[0_0_80px_rgba(56,189,248,0.15)] transition hover:border-white/25 hover:shadow-[0_0_80px_rgba(56,189,248,0.25)]"
    >
      {!imgError ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="eager"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 text-center">
          <span className="text-4xl opacity-40">🖼</span>
          <span className="text-sm font-medium text-neutral-300">{title}</span>
        </div>
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
        <p className="text-sm font-medium text-white drop-shadow-md">{title}</p>
        {artistName && (
          <p className="text-xs text-neutral-200 drop-shadow-md">{artistName}</p>
        )}
      </div>
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20 pointer-events-none">
        <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-black opacity-0 transition group-hover:opacity-100">
          Découvrir l&apos;œuvre →
        </span>
      </span>
    </Link>
  );
}
