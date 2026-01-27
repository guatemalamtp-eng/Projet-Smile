import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [artworksCount, messagesCount] = await Promise.all([
    prisma.artwork.count(),
    prisma.message.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Tableau de bord
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-4 py-3">
          <p className="text-xs text-neutral-400">Œuvres publiées</p>
          <p className="mt-2 text-3xl font-semibold">{artworksCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-4 py-3">
          <p className="text-xs text-neutral-400">Messages reçus</p>
          <p className="mt-2 text-3xl font-semibold">{messagesCount}</p>
        </div>
      </div>
    </div>
  );
}

