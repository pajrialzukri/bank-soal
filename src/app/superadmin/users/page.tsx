import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { CreateUserForm } from '@/components/admin/create-user-form';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SuperAdminUsersPage() {
  await requireSuperAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });

  return (
    <AppShell>
      <div className='space-y-6'>
        <section className='rounded-[32px] border border-[#E2E8F0] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.22)]'>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#2563EB]'>Superadmin</p>
          <h1 className='mt-3 text-3xl font-bold text-[#0F172A]'>Manajemen User</h1>
          <p className='mt-3 text-[#64748B]'>Tambah akun user/admin/superadmin untuk akses personal saat aplikasi dipublish.</p>
        </section>

        <Card>
          <h2 className='text-xl font-bold text-[#0F172A]'>Tambah user baru</h2>
          <div className='mt-6'><CreateUserForm /></div>
        </Card>

        <Card>
          <h2 className='text-xl font-bold text-[#0F172A]'>Daftar user</h2>
          <div className='mt-5 overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='text-[#64748B]'><tr><th className='py-3'>Nama</th><th>Email</th><th>Role</th><th>Dibuat</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='border-t border-[#E2E8F0]'>
                    <td className='py-3 font-medium text-[#0F172A]'>{user.name ?? '-'}</td>
                    <td className='text-[#64748B]'>{user.email}</td>
                    <td><span className='rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]'>{user.role}</span></td>
                    <td className='text-[#64748B]'>{user.createdAt.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
