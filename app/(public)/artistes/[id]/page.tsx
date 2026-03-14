import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArtistAvatar } from '@/components/artistes/ArtistAvatar';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const creator = await prisma.user.findFirst({
    where: { id, creatorProfile: { isPublic: true } },
    include: { creatorProfile: true },
  });
  if (!creator) return { title: 'Artiste introuvable | ArtsTigenn' };
  return {
    title: `${creator.name || creator.email} | Artistes | ArtsTigenn`,
    description: creator.creatorProfile?.bio ?? undefined,
  };
}

export default async function ArtistePage({ params }: Props) {
  const { id } = await params;
  const creator = await prisma.user.findFirst({
    where: { id, creatorProfile: { isPublic: true } },
    include: {
      creatorProfile: true,
      artworks: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!creator) notFound();

  const profile = creator.creatorProfile;
  const videoUrl = profile?.videoUrl?.trim();
  const galleryUrls = Array.isArray(profile?.galleryUrls) ? profile.galleryUrls : [];

  let embedVideoUrl: string | null = null;
  if (videoUrl) {
    try {
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const u = new URL(videoUrl);
        const id = u.searchParams.get('v') || videoUrl.split('/').pop()?.split('?')[0];
        if (id) embedVideoUrl = `https://www.youtube.com/embed/${id}`;
      } else if (videoUrl.includes('vimeo.com')) {
        const id = videoUrl.split('/').filter(Boolean).pop()?.split('?')[0];
        if (id) embedVideoUrl = `https://player.vimeo.com/video/${id}`;
      }
    } catch {
      embedVideoUrl = null;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-400">
        <Link href="/" className="hover:text-white transition">Accueil</Link>
        <span aria-hidden>/</span>
        <Link href="/artistes" className="hover:text-white transition">Artistes</Link>
        <span aria-hidden>/</span>
        <span className="text-white">{creator.name || creator.email}</span>
      </nav>
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {profile?.avatarUrl ? (
          <ArtistAvatar
            avatarUrl={profile.avatarUrl}
            name={creator.name}
            email={creator.email}
          />
        ) : (
          <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-xl bg-white/5 text-6xl text-neutral-600 border border-white/10">
            {creator.name?.[0] ?? creator.email[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {creator.name || creator.email}
          </h1>
          {profile?.bio && (
            <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-400">
              {profile.bio}
            </p>
          )}
          {creator.role === 'CREATOR' && (
            <Link
              href={`/projet-sur-commande?creator=${creator.id}`}
              className="mt-6 inline-block rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
            >
              Demander un projet
            </Link>
          )}
        </div>
      </div>

      {embedVideoUrl && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Vidéo</h2>
          <div className="aspect-video w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 bg-black">
            <iframe
              src={embedVideoUrl}
              title="Vidéo de l'artiste"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {videoUrl && !embedVideoUrl && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Vidéo</h2>
          <div className="max-w-2xl rounded-xl overflow-hidden border border-white/10">
            <video src={videoUrl} controls className="w-full" />
          </div>
        </section>
      )}

      {galleryUrls.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Galerie</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {galleryUrls.map((url, i) => (
              <li key={i} className="rounded-lg overflow-hidden border border-white/10 bg-neutral-900/60">
                <img src={url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {creator.artworks.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Œuvres</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {creator.artworks.map((art) => (
              <li key={art.id}>
                <Link
                  href={`/artworks/${art.slug}`}
                  className="block rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition"
                >
                  <div className="relative aspect-square w-full bg-neutral-900/60 overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="p-3 text-sm font-medium">{art.title}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/gallery?artist=${creator.id}`}
            className="mt-4 inline-block text-sm text-neutral-400 hover:text-white transition"
          >
            Voir toutes ses œuvres →
          </Link>
        </section>
      )}

      <div className="mt-10">
        <Link href="/artistes" className="text-sm text-neutral-400 hover:text-white transition">
          ← Tous les artistes
        </Link>
      </div>
    </div>
  );
}
