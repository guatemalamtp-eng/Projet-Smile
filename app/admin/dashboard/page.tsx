import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'CREATOR')) {
    redirect('/admin/login');
  }
  const isAdmin = user.role === 'ADMIN';

  const [artworksCount, messagesCount, projectRequestsCount] = await Promise.all([
    prisma.artwork.count(),
    prisma.message.count(),
    prisma.projectRequest.count({
      where: isAdmin ? undefined : { creatorId: user.id },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Tableau de bord
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-4 py-3">
          <p className="text-xs text-neutral-400">Œuvres publiées</p>
          <p className="mt-2 text-3xl font-semibold">{artworksCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950/80 px-4 py-3">
          <p className="text-xs text-neutral-400">Messages reçus</p>
          <p className="mt-2 text-3xl font-semibold">{messagesCount}</p>
        </div>
        <Link
          href="/admin/project-requests"
          className="rounded-xl border border-white/10 bg-neutral-950/80 px-4 py-3 transition hover:border-white/20"
        >
          <p className="text-xs text-neutral-400">Demandes de projet</p>
          <p className="mt-2 text-3xl font-semibold">{projectRequestsCount}</p>
        </Link>
      </div>
    </div>
  );
}

