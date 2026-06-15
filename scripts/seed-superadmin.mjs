import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const email = process.env.SUPERADMIN_EMAIL ?? 'superadmin@cpnsmaster.local';
const password = process.env.SUPERADMIN_PASSWORD ?? 'SuperAdmin123!';
const passwordHash = await bcrypt.hash(password, 12);

await prisma.user.upsert({
  where: { email },
  update: { passwordHash, role: 'SUPERADMIN', name: 'Super Admin' },
  create: { email, passwordHash, role: 'SUPERADMIN', name: 'Super Admin' },
});

console.log(`Superadmin ready: ${email}`);
await prisma.$disconnect();
