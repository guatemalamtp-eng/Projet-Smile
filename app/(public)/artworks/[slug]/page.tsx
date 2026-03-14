import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getArtworkBySlug } from '@/lib/artworks';
import { likeArtwork } from './server-actions';
import { ContactForm } from '@/components/forms/ContactForm';
import { ArtworkImage } from '@/components/artworks/ArtworkImage';

type ArtworkPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: ArtworkPageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return {
      title: 'Œuvre introuvable | ArtsTigenn',
    };
  }

  return {
    title: `${artwork.title} | ArtsTigenn`,
    description: artwork.description ?? "Œuvre originale de l'artiste.",
    openGraph: {
      images: [
        {
          url: artwork.imageUrl,
          alt: artwork.title,
        },
      ],
    },
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const {
    id,
    title,
    description,
    imageUrl,
    galleryUrls,
    status,
    widthCm,
    heightCm,
    technique,
    likesCount,
    createdAt,
  } = artwork;

  const isSold = status === 'SOLD';
  const extraPhotos = Array.isArray(galleryUrls) ? galleryUrls : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="relative space-y-4">
          <ArtworkImage imageUrl={imageUrl} title={title} isSold={isSold} />
          {isSold && (
            <span className="absolute left-4 top-4 rounded-full bg-red-600/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white z-10">
              Vendu
            </span>
          )}
          {extraPhotos.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">Autres vues</p>
              <ul className="flex gap-2 flex-wrap">
                {extraPhotos.map((url, i) => (
                  <li key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 bg-neutral-900/60 shrink-0">
                    <img src={url} alt={`${title} vue ${i + 2}`} className="w-full h-full object-cover" loading="lazy" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <section className="flex flex-col gap-6">
          <header>
            {artwork.artist && (
              <p className="mb-2 text-sm text-neutral-400">
                <Link
                  href={`/artistes/${artwork.artist.id}`}
                  className="hover:text-white transition"
                >
                  ← {artwork.artist.name ?? 'Voir l’artiste'}
                </Link>
              </p>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              {technique ?? 'Technique mixte'}
              {widthCm && heightCm
                ? ` · ${widthCm}×${heightCm} cm`
                : null}
            </p>
          </header>

          {description && (
            <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-line">
              {description}
            </p>
          )}

          <dl className="grid gap-3 text-sm text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <dt className="text-neutral-500">Statut</dt>
              <dd>{isSold ? 'Vendu' : 'Disponible'}</dd>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <dt className="text-neutral-500">Likes</dt>
              <dd>{likesCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Créée le</dt>
              <dd>
                {new Intl.DateTimeFormat('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(createdAt))}
              </dd>
            </div>
          </dl>

          <div className="mt-2 flex flex-col gap-3 border-t border-neutral-800 pt-4">
            <form action={async () => likeArtwork(id, artwork.slug)}>
              <button
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition"
                type="submit"
              >
                ❤ J'aime cette œuvre
              </button>
            </form>

            <ContactForm artworkId={id} slug={artwork.slug} />
          </div>
        </section>
      </div>
    </main>
  );
}
