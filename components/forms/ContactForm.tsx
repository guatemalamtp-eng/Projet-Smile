'use client';

import { useState } from 'react';
import { sendMessageForArtwork } from '@/app/(public)/artworks/[slug]/server-actions';

type ContactFormProps = {
  artworkId: string;
};

export function ContactForm({ artworkId }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const email = String(formData.get('email') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();

    if (!email || !content) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendMessageForArtwork(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-3 rounded-xl border border-white/10 bg-black/40 p-4">
      <input type="hidden" name="artworkId" value={artworkId} />
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
        Contacter l'artiste
      </p>
      <input
        name="email"
        type="email"
        required
        placeholder="Votre email"
        className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-white/40"
      />
      <input
        name="name"
        type="text"
        placeholder="Votre nom (facultatif)"
        className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-white/40"
      />
      <textarea
        name="content"
        required
        rows={4}
        minLength={10}
        placeholder="Votre message..."
        className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-500 focus:border-white/40"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
      </button>
    </form>
  );
}
