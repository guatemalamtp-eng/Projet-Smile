import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateCreatorProfile } from './server-actions';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CREATOR') {
    redirect('/admin/login');
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Mon profil</h1>
      <p className="text-sm text-neutral-400">
        Ces informations apparaissent sur ta fiche publique (/artistes).
      </p>

      <form action={updateCreatorProfile} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-neutral-300">
            URL de l&apos;avatar (image de profil)
          </label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            defaultValue={profile?.avatarUrl ?? ''}
            placeholder="https://..."
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-neutral-300">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={6}
            defaultValue={profile?.bio ?? ''}
            className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isPublic"
            name="isPublic"
            type="checkbox"
            defaultChecked={profile?.isPublic ?? true}
            className="rounded border-white/20"
          />
          <label htmlFor="isPublic" className="text-sm text-neutral-300">
            Visible sur la page Artistes
          </label>
        </div>
        <button
          type="submit"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
