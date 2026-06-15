import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { GenerateAIForm } from '@/components/admin/generate-ai-form';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';

export async function AdminGenerateAIPage() {
  await requireAdmin();
  const [batches, questions] = await Promise.all([
    prisma.aIQuestionBatch.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.question.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return (
    <AppShell>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Admin Panel • Generate Soal AI</h1>
          <p className='mt-2 text-slate-600 dark:text-slate-300'>Admin dapat generate soal AI, melihat batch, edit/delete nanti via endpoint lanjutan, serta import/export JSON.</p>
        </div>
        <GenerateAIForm />
        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <h2 className='text-xl font-semibold'>Batch hasil generate AI</h2>
            <div className='mt-4 space-y-3'>
              {batches.map((batch) => (
                <div key={batch.id} className='rounded-2xl border border-slate-100 p-4 text-sm dark:border-slate-800'>
                  <p className='font-semibold'>{batch.category} • {batch.subcategory}</p>
                  <p className='text-slate-500'>Req {batch.totalRequested} • Gen {batch.totalGenerated} • {batch.status}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className='text-xl font-semibold'>Soal terbaru</h2>
            <div className='mt-4 space-y-3'>
              {questions.map((question) => (
                <div key={question.id} className='rounded-2xl border border-slate-100 p-4 text-sm dark:border-slate-800'>
                  <p className='font-semibold'>{question.category} • {question.subcategory}</p>
                  <p className='line-clamp-2 text-slate-500'>{question.question}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
