"use client";

import { useMemo, useState } from 'react';
import { Bookmark, CheckCircle2, Flag, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Question = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: string;
  explanation: string;
  wrongOptionsExplanation: unknown;
  category: string;
  subcategory: string;
  difficulty: string;
};

type SavedAnswer = { questionId: string; selectedAnswer: string; isCorrect: boolean };

export function PracticeClient({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isDifficult, setIsDifficult] = useState(false);
  const [saved, setSaved] = useState<Record<string, SavedAnswer>>({});
  const [message, setMessage] = useState<string | null>(null);

  const question = questions[index];
  const options = useMemo(() => question ? [
    ['A', question.optionA], ['B', question.optionB], ['C', question.optionC], ['D', question.optionD], ['E', question.optionE],
  ] : [], [question]);

  if (!question) {
    return (
      <Card className='text-center'>
        <h2 className='text-xl font-semibold text-[#0F172A]'>Belum ada soal</h2>
        <p className='mt-2 text-[#64748B]'>Generate soal dari Admin Generate Soal AI terlebih dahulu.</p>
      </Card>
    );
  }

  async function submitAnswer() {
    if (!selected) return setMessage('Pilih salah satu jawaban dulu.');
    setMessage(null);
    const response = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, selectedAnswer: selected, isDifficult }),
    });
    const json = await response.json();
    if (!response.ok) return setMessage(json.error || 'Gagal menyimpan jawaban.');
    setSaved((prev) => ({ ...prev, [question.id]: json }));
    setShowResult(true);
  }

  async function toggleBookmark() {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question.id }),
    });
    const json = await response.json();
    setMessage(response.ok ? json.message : json.error || 'Gagal bookmark.');
  }

  function go(next: number) {
    setIndex(next);
    setSelected(null);
    setShowResult(false);
    setIsDifficult(false);
    setMessage(null);
  }

  const savedAnswer = saved[question.id];
  const isCorrect = savedAnswer?.isCorrect;

  return (
    <div className='grid gap-6 xl:grid-cols-[1fr_320px]'>
      <Card>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]'>{question.category} • {question.subcategory}</p>
            <h2 className='mt-2 text-2xl font-bold text-[#0F172A]'>Soal {index + 1} dari {questions.length}</h2>
          </div>
          <div className='rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#64748B]'>{question.difficulty}</div>
        </div>

        <p className='text-lg font-medium leading-8 text-[#0F172A]'>{question.question}</p>

        <div className='mt-6 space-y-3'>
          {options.map(([key, value]) => {
            const active = selected === key;
            const correct = showResult && question.correctAnswer === key;
            const wrong = showResult && active && question.correctAnswer !== key;
            return (
              <button
                key={key}
                onClick={() => !showResult && setSelected(key)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  correct ? 'border-[#22C55E] bg-green-50 text-[#0F172A]' :
                  wrong ? 'border-[#EF4444] bg-red-50 text-[#0F172A]' :
                  active ? 'border-[#2563EB] bg-blue-50 text-[#0F172A]' :
                  'border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#3B82F6] hover:bg-blue-50/40'
                }`}
              >
                <span className='mr-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8FAFC] text-sm font-bold text-[#2563EB]'>{key}</span>
                {value}
              </button>
            );
          })}
        </div>

        {showResult ? (
          <div className='mt-6 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5'>
            <div className='flex items-center gap-2 font-bold text-[#0F172A]'>
              {isCorrect ? <CheckCircle2 className='h-5 w-5 text-[#22C55E]' /> : <XCircle className='h-5 w-5 text-[#EF4444]' />}
              {isCorrect ? 'Jawaban benar' : `Jawaban salah. Kunci: ${question.correctAnswer}`}
            </div>
            <p className='mt-3 leading-7 text-[#64748B]'>{question.explanation}</p>
            <pre className='mt-4 whitespace-pre-wrap rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#64748B]'>{JSON.stringify(question.wrongOptionsExplanation, null, 2)}</pre>
          </div>
        ) : null}

        {message ? <p className='mt-4 text-sm font-medium text-[#F59E0B]'>{message}</p> : null}

        <div className='mt-6 flex flex-wrap gap-3'>
          <Button type='button' onClick={submitAnswer} disabled={showResult}>Submit Jawaban</Button>
          <Button type='button' variant='secondary' onClick={toggleBookmark}><Bookmark className='mr-2 h-4 w-4' /> Bookmark</Button>
          <Button type='button' variant='ghost' onClick={() => setIsDifficult((v) => !v)} className={isDifficult ? 'bg-amber-50 text-[#F59E0B]' : ''}><Flag className='mr-2 h-4 w-4' /> Tandai Sulit</Button>
        </div>
      </Card>

      <Card>
        <h3 className='text-lg font-bold text-[#0F172A]'>Navigasi soal</h3>
        <div className='mt-4 grid grid-cols-5 gap-2'>
          {questions.map((item, itemIndex) => (
            <button
              key={item.id}
              onClick={() => go(itemIndex)}
              className={`h-11 rounded-xl border text-sm font-bold ${
                itemIndex === index ? 'border-[#2563EB] bg-[#2563EB] text-white' :
                saved[item.id] ? 'border-[#22C55E] bg-green-50 text-[#22C55E]' :
                'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#3B82F6]'
              }`}
            >{itemIndex + 1}</button>
          ))}
        </div>
        <div className='mt-6 rounded-2xl bg-[#F8FAFC] p-4 text-sm text-[#64748B]'>
          Terjawab: <span className='font-bold text-[#0F172A]'>{Object.keys(saved).length}</span> / {questions.length}
        </div>
      </Card>
    </div>
  );
}
