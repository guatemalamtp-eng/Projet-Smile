// Route API temporaire pour créer l'admin en production
// À supprimer après utilisation pour la sécurité
// Appelle: https://ton-site.vercel.app/api/setup-admin

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Un administrateur existe déjà.',
        email: existingAdmin.email,
      });
    }

    // Créer l'admin
    const email = 'dasilva.jeanclaude@yahoo.fr';
    const password = 'Jprout140617';
    const passwordHash = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: 'Administrateur',
        role: 'ADMIN',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Administrateur créé avec succès !',
      email: admin.email,
      password: password,
      warning: '⚠️ Supprime cette route API après utilisation pour la sécurité !',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
