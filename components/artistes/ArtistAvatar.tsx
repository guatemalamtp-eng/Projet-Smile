'use client';

import { useState } from 'react';

export function ArtistAvatar({
  avatarUrl,
  name,
  email,
}: {
  avatarUrl: string;
  name: string | null;
  email: string;
}) {
  const [error, setError] = useState(false);
  const displayName = name || email;
  const initial = name?.[0] ?? email[0].toUpperCase();

  if (error || !avatarUrl) {
    return (
      <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-xl bg-white/5 text-6xl text-neutral-600 border border-white/10">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={displayName}
      className="h-56 w-56 shrink-0 rounded-xl object-cover border border-white/10"
      onError={() => setError(true)}
    />
  );
}
