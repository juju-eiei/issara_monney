const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function check() {
  const testPassword = 'admin123';
  console.log(`--- Starting Admin Reset for: admin / ${testPassword} ---`);
  
  const hash = await bcrypt.hash(testPassword, 10);
  
  // Update or Create
  await prisma.owner.upsert({
    where: { username: 'admin' },
    update: { passwordHash: hash },
    create: { username: 'admin', passwordHash: hash }
  });

  // Verify
  const admin = await prisma.owner.findUnique({ where: { username: 'admin' } });
  const isMatch = await bcrypt.compare(testPassword, admin.passwordHash);
  
  console.log('Verification Success:', isMatch);
  console.log('New Hash in DB:', admin.passwordHash);
  
  if (!isMatch) {
    throw new Error('Bcrypt verification failed immediately after hashing!');
  }
  
  console.log('--- Admin reset confirmed locally. ---');
}

check()
  .catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
