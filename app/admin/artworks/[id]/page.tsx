import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateArtwork, deleteArtwork } from './server-actions';

type ArtworkEditPageProps = {
  params: { id: string };
};

export default async function ArtworkEditPage({
  params,
}: ArtworkEditPageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  const artwork = await prisma.artwork.findUnique({
    where: { id: params.id },
  });

  if (!artwork) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Modifier « {artwork.title} »
        </h1>
      </header>

      <form action={updateArtwork} className="space-y-4">
        <input type="hidden" name="id" value={artwork.id} />

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Titre</label>
          <input
            name="title"
            defaultValue={artwork.title}
            required
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Slug (URL)</label>
          <input
            name="slug"
            defaultValue={artwork.slug}
            required
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Image (URL)</label>
          <input
            name="imageUrl"
            defaultValue={artwork.imageUrl}
            required
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 text-sm">
            <label className="text-neutral-300">Largeur (cm)</label>
            <input
              name="widthCm"
              type="number"
              min={0}
              defaultValue={artwork.widthCm ?? ''}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-neutral-300">Hauteur (cm)</label>
            <input
              name="heightCm"
              type="number"
              min={0}
              defaultValue={artwork.heightCm ?? ''}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Technique</label>
          <input
            name="technique"
            defaultValue={artwork.technique ?? ''}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={artwork.description ?? ''}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Statut</label>
          <select
            name="status"
            defaultValue={artwork.status}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="SOLD">Vendu</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
          >
            Enregistrer les modifications
          </button>

          <form action={deleteArtwork}>
            <input type="hidden" name="id" value={artwork.id} />
            <button
              type="submit"
              className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
            >
              Supprimer
            </button>
          </form>
        </div>
      </form>
    </div>
  );
}

