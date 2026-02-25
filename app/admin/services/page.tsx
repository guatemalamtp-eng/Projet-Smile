import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createService, updateService, deleteService } from './server-actions';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CREATOR') {
    redirect('/admin/login');
  }

  const services = await prisma.service.findMany({
    where: { creatorId: user.id },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold tracking-tight">Mes services</h1>
      <p className="text-sm text-neutral-400">
        Les services que tu proposes apparaissent sur la page /services. Les visiteurs peuvent te choisir pour une demande de projet.
      </p>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-neutral-300">Ajouter un service</h2>
        <form action={createService} className="max-w-xl space-y-4 rounded-xl border border-white/10 bg-neutral-950/80 p-4">
          <div>
            <label htmlFor="name" className="block text-sm text-neutral-400">Nom *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm text-neutral-400">Description (optionnel)</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition"
          >
            Créer le service
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-neutral-300">Liste de tes services</h2>
        {services.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucun service pour le moment.</p>
        ) : (
          <ul className="space-y-4">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-neutral-950/80 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{s.name}</p>
                  <p className="text-xs text-neutral-500">{s.slug}</p>
                  {s.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{s.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/services/${s.id}/edit`}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-300 hover:bg-white/10 transition"
                  >
                    Modifier
                  </Link>
                  <form action={deleteService} className="inline">
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-500/50 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 transition"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
