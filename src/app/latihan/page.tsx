export const dynamic = 'force-dynamic';
import { LatihanPage } from '@/components/soal/latihan-page';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  const params = await searchParams;
  return <LatihanPage selectedCategory={params.category} selectedSubcategory={params.subcategory} />;
}
