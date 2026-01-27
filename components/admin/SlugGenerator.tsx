'use client';

import { useEffect } from 'react';

export function SlugGenerator() {
  useEffect(() => {
    const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
    const slugInput = document.querySelector<HTMLInputElement>('input[name="slug"]');

    if (!titleInput || !slugInput) return;

    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début/fin
    };

    const handleTitleChange = () => {
      if (!slugInput.value) {
        slugInput.value = generateSlug(titleInput.value);
      }
    };

    titleInput.addEventListener('input', handleTitleChange);

    return () => {
      titleInput.removeEventListener('input', handleTitleChange);
    };
  }, []);

  return null;
}
