import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { EditClient } from './edit-client';

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

      <EditClient
        artwork={{
          id: artwork.id,
          title: artwork.title,
          slug: artwork.slug,
          imageUrl: artwork.imageUrl,
          description: artwork.description,
          technique: artwork.technique,
          widthCm: artwork.widthCm,
          heightCm: artwork.heightCm,
          status: artwork.status,
        }}
      />
    </div>
  );
}

