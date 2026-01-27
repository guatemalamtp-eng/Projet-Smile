'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createArtwork } from './server-actions';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SlugGenerator } from '@/components/admin/SlugGenerator';

export default function NewArtworkPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!imageUrl) {
      alert('Veuillez uploader une image');
      return;
    }

    formData.set('imageUrl', imageUrl);
    setIsSubmitting(true);

    try {
      await createArtwork(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Nouvelle œuvre
      </h1>

      <SlugGenerator />

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Titre</label>
          <input
            name="title"
            required
            minLength={3}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Slug (URL)</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            title="Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
          <p className="text-[11px] text-neutral-500">
            Généré automatiquement depuis le titre, ou personnalisez-le
          </p>
        </div>

        <ImageUpload onUploadComplete={setImageUrl} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 text-sm">
            <label className="text-neutral-300">Largeur (cm)</label>
            <input
              name="widthCm"
              type="number"
              min={0}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-neutral-300">Hauteur (cm)</label>
            <input
              name="heightCm"
              type="number"
              min={0}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Technique</label>
          <input
            name="technique"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="text-neutral-300">Statut</label>
          <select
            name="status"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="SOLD">Vendu</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !imageUrl}
          className="mt-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}

