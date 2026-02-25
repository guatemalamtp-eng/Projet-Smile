import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, string> = {
  NEW: 'Nouvelle',
  IN_PROGRESS: 'En cours',
  ACCEPTED: 'Acceptée',
  REFUSED: 'Refusée',
};

export default async function AdminProjectRequestsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'CREATOR')) {
    redirect('/admin/login');
  }

  const where = user.role === 'CREATOR' ? { creatorId: user.id } : {};
  const requests = await prisma.projectRequest.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true, email: true } },
      service: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Demandes de projet
      </h1>

      {requests.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune demande pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-xl border border-white/10 bg-neutral-950/80 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-neutral-400">
                  {req.createdAt.toLocaleDateString('fr-FR')} à{' '}
                  {req.createdAt.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    req.status === 'NEW'
                      ? 'bg-amber-500/20 text-amber-400'
                      : req.status === 'ACCEPTED'
                        ? 'bg-green-500/20 text-green-400'
                        : req.status === 'REFUSED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-neutral-500/20 text-neutral-400'
                  }`}
                >
                  {statusLabel[req.status] ?? req.status}
                </span>
              </div>
              {user.role === 'ADMIN' && (
                <p className="mt-2 text-xs text-neutral-500">
                  Créateur : {req.creator.name || req.creator.email}
                  {req.service && ` · ${req.service.name}`}
                </p>
              )}
              <p className="mt-2 font-medium text-white">
                {req.clientName} – {req.clientEmail}
              </p>
              {req.budget && (
                <p className="mt-1 text-sm text-neutral-400">Budget : {req.budget}</p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-300">
                {req.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
