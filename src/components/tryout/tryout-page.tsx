import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';

const features = [
  'Timer simulasi CAT',
  'Nomor soal + navigasi cepat',
  'Tandai ragu-ragu',
  'Submit dan hasil akhir',
  'Analisis nilai TWK, TIU, TKP',
  'Rekomendasi materi lanjutan',
];

export function TryoutPage() {
  return (
    <AppShell>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Try Out CAT CPNS</h1>
          <p className='mt-2 text-slate-600 dark:text-slate-300'>Mode simulasi siap dipakai sebagai pondasi. Tinggal sambungkan soal random dan penyimpanan jawaban user.</p>
        </div>
        <div className='grid gap-4 lg:grid-cols-[1.2fr_1fr]'>
          <Card className='bg-gradient-to-br from-slate-950 to-blue-950 text-white'>
            <p className='text-sm uppercase tracking-[0.3em] text-blue-200'>CAT Engine</p>
            <div className='mt-6 grid grid-cols-3 gap-4'>
              <div className='rounded-2xl bg-white/10 p-4'><p className='text-sm text-blue-100'>Timer</p><p className='mt-2 text-2xl font-bold'>100:00</p></div>
              <div className='rounded-2xl bg-white/10 p-4'><p className='text-sm text-blue-100'>Soal</p><p className='mt-2 text-2xl font-bold'>110</p></div>
              <div className='rounded-2xl bg-white/10 p-4'><p className='text-sm text-blue-100'>Status</p><p className='mt-2 text-2xl font-bold'>Draft</p></div>
            </div>
          </Card>
          <Card>
            <h2 className='text-xl font-semibold'>Fitur yang sudah disiapkan</h2>
            <ul className='mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300'>
              {features.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
