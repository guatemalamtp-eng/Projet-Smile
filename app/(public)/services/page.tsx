import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Services | ArtsTigenn',
  description: 'Services et projets sur commande proposés par les créateurs ArtsTigenn.',
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    include: {
      creator: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Services & projets
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Découvrez ce que nos créateurs peuvent réaliser pour vous.
        </p>
      </header>

      {services.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Aucun service pour le moment. Revenez bientôt.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.id}
              className="rounded-xl border border-white/10 bg-neutral-950/80 p-6 transition hover:border-white/20"
            >
              <h2 className="font-semibold text-white">{service.name}</h2>
              {service.creator && (
                <p className="mt-1 text-xs text-neutral-500">
                  par {service.creator.name || service.creator.email}
                </p>
              )}
              {service.description && (
                <p className="mt-3 line-clamp-4 text-sm text-neutral-400">
                  {service.description}
                </p>
              )}
              <Link
                href={`/projet-sur-commande?service=${service.id}&creator=${service.creatorId ?? ''}`}
                className="mt-4 inline-block text-sm text-neutral-300 hover:text-white transition"
              >
                Demander un projet →
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 rounded-xl border border-white/10 bg-neutral-950/80 p-6">
        <h2 className="font-semibold text-white">Un projet sur mesure</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Vous avez une idée ? Contactez-nous pour une demande personnalisée.
        </p>
        <Link
          href="/projet-sur-commande"
          className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
        >
          Demander un projet
        </Link>
      </div>
    </div>
  );
}
