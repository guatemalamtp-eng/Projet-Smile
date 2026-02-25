import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateService } from '../server-actions';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function AdminServiceEditPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'CREATOR') {
    redirect('/admin/login');
  }

  const service = await prisma.service.findFirst({
    where: { id, creatorId: user.id },
  });
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/services" className="text-sm text-neutral-400 hover:text-white transition">
          ← Mes services
        </Link>
      </div>
      <h1 className="text-xl font-semibold tracking-tight">Modifier le service</h1>

      <form action={updateService} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={service.id} />
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300">Nom *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={service.name}
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-300">Description (optionnel)</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={service.description ?? ''}
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition"
          >
            Enregistrer
          </button>
          <Link
            href="/admin/services"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
