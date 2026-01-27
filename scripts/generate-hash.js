// Script pour générer un hash bcrypt
// Usage: node scripts/generate-hash.js "ton-mot-de-passe"

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'Jprout140617';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
  console.log('Mot de passe:', password);
  console.log('Hash bcrypt:', hash);
  console.log('\nCopie ce hash pour l\'utiliser dans SQL ou Prisma Studio');
});
