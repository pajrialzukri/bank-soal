import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export async function MaterialPage() {
  const materials = await prisma.material.findMany({ include: { category: true, subcategory: true }, orderBy: { createdAt: 'desc' }, take: 12 });
  return (
    <AppShell>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Materi Belajar CPNS</h1>
          <p className='mt-2 text-slate-600 dark:text-slate-300'>Materi dikelompokkan per kategori dan subkategori agar user bisa belajar sebelum mengerjakan soal.</p>
        </div>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {materials.length === 0 ? <Card className='md:col-span-2 xl:col-span-3'><p className='text-slate-500'>Belum ada materi. Tambahkan seed atau panel admin konten.</p></Card> : materials.map((item) => (
            <Card key={item.id}>
              <p className='text-xs uppercase tracking-wide text-blue-600'>{item.category.name} {item.subcategory ? `• ${item.subcategory.name}` : ''}</p>
              <h2 className='mt-3 text-lg font-semibold'>{item.title}</h2>
              <p className='mt-3 line-clamp-4 text-sm text-slate-600 dark:text-slate-300'>{item.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
