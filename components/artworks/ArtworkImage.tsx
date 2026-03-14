'use client';

import { useState } from 'react';

export function ArtworkImage({
  imageUrl,
  title,
  isSold,
}: {
  imageUrl: string;
  title: string;
  isSold: boolean;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-neutral-900/80 p-6 text-center">
        <span className="text-4xl text-neutral-500">🖼</span>
        <p className="text-sm font-medium text-neutral-300">{title}</p>
        <p className="text-xs text-neutral-500">Image indisponible</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950/60">
      <img
        src={imageUrl}
        alt={title}
        className={`h-full w-full object-contain ${isSold ? 'grayscale' : ''}`}
        loading="eager"
        onError={() => setError(true)}
      />
    </div>
  );
}
