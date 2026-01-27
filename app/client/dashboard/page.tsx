import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'CLIENT') {
    return null;
  }

  // Récupérer les statistiques du client
  const messagesCount = await prisma.message.count({
    where: { email: user.email },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue, {user.name || user.email}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Votre espace client
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-300">
              Mes messages
            </h2>
            <p className="mt-2 text-2xl font-bold">{messagesCount}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Messages envoyés à l'artiste
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-300">
              Galerie
            </h2>
            <p className="mt-2 text-2xl font-bold">Toutes les œuvres</p>
            <Link
              href="/gallery"
              className="mt-2 inline-block text-xs text-neutral-400 hover:text-white transition"
            >
              Voir la galerie →
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gallery"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-white/10 transition"
            >
              Explorer la galerie
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-white/10 transition"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
