// Met le compte Léa en rôle CLIENT (pour qu'elle se connecte via /login, pas /admin)
// À lancer une fois si Léa était encore en CREATOR : node scripts/set-lea-client.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'lea.martineau@artstigenn.com';
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) {
    console.log('Aucun compte trouvé pour', email, '- lance d\'abord: npm run seed-creator');
    return;
  }
  if (u.role === 'CLIENT') {
    console.log('Léa est déjà en rôle CLIENT. Connexion possible via /login');
    return;
  }
  await prisma.user.update({
    where: { email },
    data: { role: 'CLIENT' },
  });
  console.log('Léa est maintenant en rôle CLIENT. Elle peut se connecter sur /login');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
