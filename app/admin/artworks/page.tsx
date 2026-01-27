import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminArtworksPage() {
  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Œuvres
        </h1>
        <Link
          href="/admin/artworks/new"
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
        >
          Nouvelle œuvre
        </Link>
      </header>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs text-neutral-400">
            <tr>
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Likes</th>
              <th className="px-4 py-2">Créée le</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {artworks.map((a) => (
              <tr
                key={a.id}
                className="border-b border-white/5 last:border-none"
              >
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2 text-xs">
                  {a.status === 'AVAILABLE' ? 'Disponible' : 'Vendu'}
                </td>
                <td className="px-4 py-2 text-xs text-neutral-400">
                  {a.likesCount}
                </td>
                <td className="px-4 py-2 text-xs text-neutral-400">
                  {new Intl.DateTimeFormat('fr-FR').format(a.createdAt)}
                </td>
                <td className="px-4 py-2 text-right text-xs">
                  <Link
                    href={`/admin/artworks/${a.id}`}
                    className="text-sky-400 hover:underline"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
            {artworks.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-neutral-400"
                >
                  Aucune œuvre pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

