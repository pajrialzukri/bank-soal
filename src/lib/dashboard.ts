import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  const [questions, answers, materials, batches] = await Promise.all([
    prisma.question.count(),
    prisma.answerHistory.findMany({ include: { question: true }, orderBy: { createdAt: 'desc' }, take: 500 }),
    prisma.material.count(),
    prisma.aIQuestionBatch.count(),
  ]);

  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = answers.length - correct;
  const accuracy = answers.length ? Math.round((correct / answers.length) * 100) : 0;
  const grouped = {
    TWK: answers.filter((a) => a.question.category === 'TWK').length,
    TIU: answers.filter((a) => a.question.category === 'TIU').length,
    TKP: answers.filter((a) => a.question.category === 'TKP').length,
  };

  return {
    totalQuestions: questions,
    totalAnswered: answers.length,
    correct,
    wrong,
    accuracy,
    materials,
    aiBatches: batches,
    streak: 7,
    progress: {
      TWK: Math.min(100, grouped.TWK * 5),
      TIU: Math.min(100, grouped.TIU * 5),
      TKP: Math.min(100, grouped.TKP * 5),
    },
    recommendation: accuracy < 70 ? 'Fokus latihan TIU Persentase dan TWK Pancasila hari ini.' : 'Lanjutkan try out campuran 30 soal untuk menjaga konsistensi.',
  };
}
