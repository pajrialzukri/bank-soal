import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export async function getCurrentSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentSessionUser();
  if (!user?.id) redirect('/login');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') redirect('/');
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== 'SUPERADMIN') redirect('/');
  return user;
}
