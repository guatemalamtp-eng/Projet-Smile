'use client';

import { useState, useRef } from 'react';

type ImageUploadProps = {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
};

export function ImageUpload({ onUploadComplete, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('L\'image est trop volumineuse (max 10MB)');
      return;
    }

    // Aperçu local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur upload');
      }

      const data = await res.json();
      onUploadComplete(data.url);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'upload. Veuillez réessayer.');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-300">Image</label>
      <div className="space-y-2">
        {preview && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-white/10">
            <img
              src={preview}
              alt="Aperçu"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer rounded-md border border-white/15 bg-black/40 px-3 py-2 text-xs transition ${
              uploading
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-black/60'
            }`}
          >
            {uploading ? 'Upload en cours...' : preview ? 'Changer l\'image' : 'Choisir une image'}
          </label>
          {preview && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                onUploadComplete('');
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Supprimer
            </button>
          )}
        </div>
        <input
          type="hidden"
          name="imageUrl"
          value={preview || ''}
        />
        <p className="text-[11px] text-neutral-500">
          Formats acceptés : JPG, PNG, WebP (max 10MB)
        </p>
      </div>
    </div>
  );
}
