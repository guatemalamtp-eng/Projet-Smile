'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { updateArtwork, deleteArtwork } from './server-actions';

type EditClientProps = {
  artwork: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    description: string | null;
    technique: string | null;
    widthCm: number | null;
    heightCm: number | null;
    status: string;
  };
};

export function EditClient({ artwork }: EditClientProps) {
  const [imageUrl, setImageUrl] = useState(artwork.imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!imageUrl) {
      alert('Veuillez uploader une image');
      return;
    }

    formData.set('imageUrl', imageUrl);
    setIsSubmitting(true);

    try {
      await updateArtwork(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={artwork.id} />

      <div className="space-y-1 text-sm">
        <label className="text-neutral-300">Titre</label>
        <input
          name="title"
          defaultValue={artwork.title}
          required
          minLength={3}
          className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
        />
      </div>

      <div className="space-y-1 text-sm">
        <label className="text-neutral-300">Slug (URL)</label>
        <input
          name="slug"
          defaultValue={artwork.slug}
          required
          pattern="[a-z0-9-]+"
          title="Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets"
          className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
        />
      </div>

      <ImageUpload onUploadComplete={setImageUrl} currentUrl={artwork.imageUrl} />

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
          disabled={isSubmitting || !imageUrl}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>

        <form action={deleteArtwork}>
          <input type="hidden" name="id" value={artwork.id} />
          <button
            type="submit"
            onClick={(e) => {
              if (!confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
                e.preventDefault();
              }
            }}
            className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            Supprimer
          </button>
        </form>
      </div>
    </form>
  );
}
