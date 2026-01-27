import { prisma } from '@/lib/prisma';

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      artwork: {
        select: {
          title: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Messages visiteurs
      </h1>

      <div className="space-y-3">
        {messages.map((m) => (
          <article
            key={m.id}
            className="rounded-xl border border-white/10 bg-neutral-950/80 px-4 py-3"
          >
            <header className="flex items-center justify-between">
              <div className="text-xs text-neutral-400">
                {m.name || 'Anonyme'} – {m.email}
              </div>
              <div className="text-[11px] text-neutral-500">
                {new Intl.DateTimeFormat('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(m.createdAt)}
              </div>
            </header>
            {m.artwork && (
              <p className="mt-1 text-xs text-neutral-400">
                À propos de : {m.artwork.title}
              </p>
            )}
            <p className="mt-2 text-sm text-neutral-100 whitespace-pre-line">
              {m.content}
            </p>
          </article>
        ))}

        {messages.length === 0 && (
          <p className="text-sm text-neutral-400">
            Aucun message pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}

