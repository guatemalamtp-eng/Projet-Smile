import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { submitProjectRequest } from './server-actions';

export const metadata = {
  title: 'Projet sur commande | ArtsTigenn',
  description: 'Demandez un projet sur mesure à nos artistes et créateurs.',
};

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ creator?: string; service?: string }> };

export default async function ProjetSurCommandePage({ searchParams }: Props) {
  const { creator: creatorIdParam, service: serviceIdParam } = await searchParams;

  const [creators, services] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'CREATOR', creatorProfile: { isPublic: true } },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
    prisma.service.findMany({
      include: { creator: { select: { id: true, name: true, email: true } } },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Projet sur commande
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Décrivez votre projet et choisissez un créateur. Nous vous recontacterons pour en discuter.
        </p>
      </header>

      <form action={submitProjectRequest} className="space-y-6">
        <div>
          <label htmlFor="creatorId" className="block text-sm font-medium text-neutral-300">
            Créateur / artiste *
          </label>
          <select
            id="creatorId"
            name="creatorId"
            required
            defaultValue={creatorIdParam ?? ''}
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
          >
            <option value="">Choisir un créateur</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.email}
              </option>
            ))}
          </select>
        </div>

        {creators.length > 0 && (
          <div>
            <label htmlFor="serviceId" className="block text-sm font-medium text-neutral-300">
              Type de projet (optionnel)
            </label>
            <select
              id="serviceId"
              name="serviceId"
              defaultValue={serviceIdParam ?? ''}
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            >
              <option value="">Aucun / Autre</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                  {s.creator ? ` (${s.creator.name || s.creator.email})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-neutral-300">
            Votre nom *
          </label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-neutral-300">
            Votre email *
          </label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-300">
            Décrivez votre projet *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-neutral-300">
            Budget indicatif (optionnel)
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            placeholder="Ex. 500 € - 1000 €"
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition"
        >
          Envoyer ma demande
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-500">
        <Link href="/artistes" className="hover:text-white transition">
          ← Voir les artistes
        </Link>
        {' · '}
        <Link href="/services" className="hover:text-white transition">
          Voir les services
        </Link>
      </p>
    </div>
  );
}
