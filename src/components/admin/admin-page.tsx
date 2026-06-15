import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { GenerateAIForm } from '@/components/admin/generate-ai-form';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';

export async function AdminGenerateAIPage() {
  await requireUser();
  const [batches, questions] = await Promise.all([
    prisma.aIQuestionBatch.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.question.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return (
    <AppShell>
      <div className='space-y-6'>
        <section className='rounded-[32px] border border-[#E2E8F0] bg-[linear-gradient(135deg,#FFFFFF_0%,#F8FBFF_55%,#EEF5FF_100%)] p-8 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.22)]'>
          <div>
            <h1 className='text-3xl font-bold text-[#0F172A]'>Generate Soal AI</h1>
            <p className='mt-2 text-[#64748B]'>Setiap user bisa generate bank soal personal, termasuk figural visual, lalu langsung menyimpannya ke database.</p>
          </div>
        </section>

        <GenerateAIForm />

        <div className='grid gap-6 xl:grid-cols-2'>
          <Card>
            <h3 className='text-lg font-semibold text-[#0F172A]'>Batch terbaru</h3>
            <div className='mt-4 space-y-3'>
              {batches.map((batch) => (
                <div key={batch.id} className='rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm'>
                  <p className='font-semibold text-[#0F172A]'>{batch.category} • {batch.subcategory}</p>
                  <p className='text-[#64748B]'>Request: {batch.totalRequested} • Generated: {batch.totalGenerated} • Status: {batch.status}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className='text-lg font-semibold text-[#0F172A]'>Soal terbaru</h3>
            <div className='mt-4 space-y-3'>
              {questions.map((question) => (
                <div key={question.id} className='rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm'>
                  <p className='font-semibold text-[#0F172A]'>{question.category} • {question.subcategory}</p>
                  <p className='mt-1 line-clamp-2 text-[#64748B]'>{question.question}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
