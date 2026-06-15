import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const createUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['USER', 'ADMIN', 'SUPERADMIN']).default('USER'),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'SUPERADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = createUserSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({ data: { name: body.name, email: body.email, passwordHash, role: body.role } });
    return NextResponse.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Gagal membuat user.' }, { status: 400 });
  }
}
