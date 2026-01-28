// Route API temporaire pour créer un client de test en production
// À supprimer après utilisation pour la sécurité
// Appelle: https://ton-site.vercel.app/api/setup-client?email=client@test.com&password=client123

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email') || 'client@test.com';
    const password = searchParams.get('password') || 'client123';

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Un utilisateur avec cet email existe déjà.',
        email: existingUser.email,
        role: existingUser.role,
      });
    }

    // Créer le client
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: email.split('@')[0],
        role: 'CLIENT',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur client créé avec succès !',
      email: user.email,
      password: password,
      role: user.role,
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
