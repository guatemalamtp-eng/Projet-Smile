import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getArtworkBySlug } from '@/lib/artworks';
import { likeArtwork } from './server-actions';
import { ContactForm } from '@/components/forms/ContactForm';

type ArtworkPageProps = {
  params: { slug: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: ArtworkPageProps,
): Promise<Metadata> {
  const artwork = await getArtworkBySlug(params.slug);

  if (!artwork) {
    return {
      title: 'Œuvre introuvable | Smile',
    };
  }

  return {
    title: `${artwork.title} | Smile`,
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
  const artwork = await getArtworkBySlug(params.slug);

  if (!artwork) {
    notFound();
  }

  const {
    id,
    slug,
    title,
    description,
    imageUrl,
    status,
    widthCm,
    heightCm,
    technique,
    likesCount,
    createdAt,
  } = artwork;

  const isSold = status === 'SOLD';

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-neutral-950/60">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-contain ${
              isSold ? 'grayscale' : ''
            }`}
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          {isSold && (
            <span className="absolute left-4 top-4 rounded-full bg-red-600/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Vendu
            </span>
          )}
        </div>

        <section className="flex flex-col gap-6">
          <header>
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
            <form action={async () => likeArtwork(id, slug)}>
              <button
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition"
                type="submit"
              >
                ❤ J'aime cette œuvre
              </button>
            </form>

            <ContactForm artworkId={id} />
          </div>
        </section>
      </div>
    </main>
  );
}
