import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { CPNS_CATEGORIES } from '@/lib/cpns/constants';
import { prisma } from '@/lib/prisma';
import { PracticeClient, type PracticeQuestion } from '@/components/soal/practice-client';
import { requireUser } from '@/lib/session';

export async function LatihanPage() {
  await requireUser();
  const questions: PracticeQuestion[] = (await prisma.question.findMany({ where: { isActive: true }, take: 15, orderBy: { createdAt: 'desc' } })).map((item) => ({
    ...item,
    wrongOptionsExplanation:
      item.wrongOptionsExplanation && typeof item.wrongOptionsExplanation === 'object' && !Array.isArray(item.wrongOptionsExplanation)
        ? (item.wrongOptionsExplanation as Record<string, string>)
        : {},
  }));

  return (
    <AppShell>
      <div className='space-y-6'>
        <section className='rounded-[32px] border border-[#E2E8F0] bg-[linear-gradient(135deg,#FFFFFF_0%,#F8FBFF_55%,#EEF5FF_100%)] p-8 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.22)]'>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#2563EB]'>Latihan Soal Interaktif</p>
          <h1 className='mt-3 text-3xl font-bold text-[#0F172A]'>Kerjakan soal CPNS langsung, cek hasil, dan simpan progres</h1>
          <p className='mt-3 max-w-3xl text-[#64748B]'>Sekarang halaman latihan sudah interaktif: pilih jawaban, submit, lihat pembahasan, bookmark, tandai soal sulit, dan simpan riwayat jawaban ke database.</p>
        </section>

        <div className='grid gap-4 md:grid-cols-3'>
          {Object.entries(CPNS_CATEGORIES).map(([key, subs]) => (
            <Card key={key} className='shadow-[0_20px_40px_-30px_rgba(15,23,42,0.12)]'>
              <p className='text-lg font-semibold text-[#0F172A]'>{key}</p>
              <ul className='mt-4 space-y-2 text-sm text-[#64748B]'>
                {subs.slice(0, 5).map((sub) => <li key={sub}>• {sub}</li>)}
              </ul>
            </Card>
          ))}
        </div>

        <PracticeClient questions={questions} />
      </div>
    </AppShell>
  );
}
