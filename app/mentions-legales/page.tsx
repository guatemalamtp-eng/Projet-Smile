import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Mentions légales – ArtsTigenn',
  description: 'Mentions légales du site ArtsTigenn, artiste peintre.',
};

export default async function MentionsLegalesPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <PublicHeader user={user ?? undefined} />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          Mentions légales
        </h1>
        <p className="mt-4 text-sm text-neutral-400">
          Ce site est édité par ArtsTigenn, artiste peintre.
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          Pour toute question ou demande relative aux œuvres et à ce site,
          utilisez le formulaire de contact disponible sur les pages des œuvres
          ou la section dédiée.
        </p>
        <p className="mt-4 text-xs text-neutral-500">
          Les contenus (textes, images) sont protégés par le droit d&apos;auteur.
          Toute reproduction sans autorisation est interdite.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-white transition"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
