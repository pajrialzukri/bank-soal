"use client";

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { CPNS_CATEGORIES } from '@/lib/cpns/constants';
import { generateQuestionRequestSchema } from '@/lib/validators/ai-generate';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type FormValues = z.input<typeof generateQuestionRequestSchema>;
type GenerateResponse = { batchId: string; count: number; preview: unknown[] };
type CategoryKey = keyof typeof CPNS_CATEGORIES;

export function GenerateAIForm() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(generateQuestionRequestSchema),
    defaultValues: { category: 'TWK', subcategory: 'Pancasila', amount: 5, difficulty: 'sedang', mode: 'latihan', language: 'Indonesia' },
  });

  const category = useWatch({ control: form.control, name: 'category' }) as CategoryKey;
  const subcategories = CPNS_CATEGORIES[category];

  async function onSubmit(values: FormValues) {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error || 'Gagal generate soal');
        return;
      }
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal generate soal');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[420px_1fr]'>
      <Card>
        <h2 className='text-xl font-semibold'>Generate Soal AI</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6 space-y-4'>
          <Field label='Kategori'>
            <select disabled={isGenerating} className='input' {...form.register('category')} onChange={(e) => { const nextCategory = e.target.value as CategoryKey; form.setValue('category', nextCategory); form.setValue('subcategory', CPNS_CATEGORIES[nextCategory][0]); }}>
              {Object.keys(CPNS_CATEGORIES).map((key) => <option key={key} value={key}>{key}</option>)}
            </select>
          </Field>
          <Field label='Subkategori'>
            <select disabled={isGenerating} className='input' {...form.register('subcategory')}>
              {subcategories.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </Field>
          <Field label='Jumlah soal'>
            <input disabled={isGenerating} className='input' type='number' min={1} max={50} {...form.register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label='Difficulty'>
            <select disabled={isGenerating} className='input' {...form.register('difficulty')}><option value='mudah'>mudah</option><option value='sedang'>sedang</option><option value='sulit'>sulit</option></select>
          </Field>
          <Field label='Mode'>
            <select disabled={isGenerating} className='input' {...form.register('mode')}><option value='latihan'>latihan</option><option value='try_out'>try out</option><option value='HOTS'>HOTS</option></select>
          </Field>
          <Field label='Bahasa'>
            <input className='input' readOnly {...form.register('language')} />
          </Field>
          <Button type='submit' className='w-full' disabled={isGenerating}>
            {isGenerating ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Sedang generate & simpan...</> : 'Generate dan simpan ke database'}
          </Button>
          {isGenerating ? <p className='text-center text-sm text-[#64748B]'>Mohon tunggu. Tombol dikunci agar request tidak terkirim berulang.</p> : null}
        </form>
      </Card>

      <div className='space-y-4'>
        <Card>
          <h3 className='text-lg font-semibold'>Validasi generator</h3>
          <ul className='mt-4 space-y-2 text-sm text-[#64748B]'>
            <li>• JSON valid</li><li>• Jumlah soal sesuai request</li><li>• 5 opsi jawaban</li><li>• correctAnswer hanya A-E</li><li>• Anti duplikat per batch</li><li>• Retry otomatis jika output invalid</li><li>• Figural otomatis dibuat sebagai SVG visual</li>
          </ul>
        </Card>
        {error ? <Card className='border-red-200 bg-red-50 text-red-700'>{error}</Card> : null}
        {result ? <Card><h3 className='text-lg font-semibold'>Hasil generate</h3><p className='mt-3 text-sm'>Batch ID: {result.batchId}</p><p className='text-sm'>Jumlah tersimpan: {result.count}</p><pre className='mt-4 max-h-96 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100'>{JSON.stringify(result.preview, null, 2)}</pre></Card> : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className='block text-sm font-medium text-[#0F172A]'><span className='mb-2 block'>{label}</span>{children}</label>;
}
