import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { CPNS_CATEGORIES } from '@/lib/cpns/constants';
import { prisma } from '@/lib/prisma';
import { PracticeClient, type PracticeQuestion } from '@/components/soal/practice-client';
import { requireUser } from '@/lib/session';

export async function LatihanPage({
  selectedCategory,
  selectedSubcategory,
}: {
  selectedCategory?: string;
  selectedSubcategory?: string;
}) {
  await requireUser();

  const categoryEntries = Object.entries(CPNS_CATEGORIES);
  const activeCategory = selectedCategory && selectedCategory in CPNS_CATEGORIES ? selectedCategory : categoryEntries[0][0];
  const activeSubsForCategory = CPNS_CATEGORIES[activeCategory as keyof typeof CPNS_CATEGORIES] as readonly string[];
  const activeSubcategory = selectedSubcategory && activeSubsForCategory.some((sub) => sub === selectedSubcategory)
    ? selectedSubcategory
    : undefined;

  const where = {
    isActive: true,
    ...(activeCategory ? { category: activeCategory as 'TWK' | 'TIU' | 'TKP' } : {}),
    ...(activeSubcategory ? { subcategory: activeSubcategory } : {}),
  };

  const questions: PracticeQuestion[] = (await prisma.question.findMany({ where, take: 15, orderBy: { createdAt: 'desc' } })).map((item) => ({
    ...item,
    wrongOptionsExplanation:
      item.wrongOptionsExplanation && typeof item.wrongOptionsExplanation === 'object' && !Array.isArray(item.wrongOptionsExplanation)
        ? (item.wrongOptionsExplanation as Record<string, string>)
        : {},
    optionImageSvg:
      item.optionImageSvg && typeof item.optionImageSvg === 'object' && !Array.isArray(item.optionImageSvg)
        ? (item.optionImageSvg as Record<string, string>)
        : null,
  }));

  const activeSubs = CPNS_CATEGORIES[activeCategory as keyof typeof CPNS_CATEGORIES];

  return (
    <AppShell>
      <div className='space-y-6'>
        <section className='rounded-[32px] border border-[#E2E8F0] bg-[linear-gradient(135deg,#FFFFFF_0%,#F8FBFF_55%,#EEF5FF_100%)] p-8 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.22)]'>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#2563EB]'>Latihan Soal Interaktif</p>
          <h1 className='mt-3 text-3xl font-bold text-[#0F172A]'>Kerjakan soal CPNS per jenis soal agar lebih fokus</h1>
          <p className='mt-3 max-w-3xl text-[#64748B]'>Sekarang kamu bisa buka latihan per kategori dan per subkategori, jadi lebih mudah membedakan TWK, TIU, TKP, termasuk TIU Figural.</p>
        </section>

        <Card>
          <h2 className='text-lg font-bold text-[#0F172A]'>Pilih kategori soal</h2>
          <div className='mt-4 flex flex-wrap gap-3'>
            {categoryEntries.map(([category]) => {
              const active = category === activeCategory;
              return (
                <Link
                  key={category}
                  href={`/latihan?category=${encodeURIComponent(category)}`}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#3B82F6] hover:bg-blue-50'}`}
                >
                  {category}
                </Link>
              );
            })}
          </div>

          <h3 className='mt-6 text-base font-bold text-[#0F172A]'>Pilih subkategori</h3>
          <div className='mt-3 flex flex-wrap gap-2'>
            <Link
              href={`/latihan?category=${encodeURIComponent(activeCategory)}`}
              className={`rounded-xl border px-3 py-2 text-sm transition ${!activeSubcategory ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#3B82F6]'}`}
            >
              Semua {activeCategory}
            </Link>
            {activeSubs.map((sub) => {
              const active = sub === activeSubcategory;
              return (
                <Link
                  key={sub}
                  href={`/latihan?category=${encodeURIComponent(activeCategory)}&subcategory=${encodeURIComponent(sub)}`}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${active ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#3B82F6]'}`}
                >
                  {sub}
                </Link>
              );
            })}
          </div>
        </Card>

        <PracticeClient questions={questions} />
      </div>
    </AppShell>
  );
}
