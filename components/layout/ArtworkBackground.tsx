'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type ArtworkForBg = {
  id: string;
  imageUrl: string;
  title: string;
  slug: string;
  artist?: { name: string | null } | null;
};

export function ArtworkBackground({ artworks }: { artworks: ArtworkForBg[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (artworks.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % artworks.length);
    }, 8000);
    return () => clearInterval(t);
  }, [artworks.length]);

  if (artworks.length === 0) return null;

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {artworks.map((art, i) => (
        <div
          key={art.id}
          className="absolute inset-0 transition-opacity duration-[1500ms]"
          style={{
            opacity: i === index ? 0.22 : 0,
          }}
        >
          <Image
            src={art.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
    </div>
  );
}
