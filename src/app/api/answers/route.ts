import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const answerSchema = z.object({
  questionId: z.string().min(1),
  selectedAnswer: z.enum(['A', 'B', 'C', 'D', 'E']),
  isDifficult: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = answerSchema.parse(await request.json());
    const question = await prisma.question.findUnique({ where: { id: body.questionId } });
    if (!question) return NextResponse.json({ error: 'Soal tidak ditemukan.' }, { status: 404 });

    const isCorrect = question.correctAnswer === body.selectedAnswer;

    await prisma.answerHistory.create({
      data: {
        userId: session.user.id,
        questionId: question.id,
        selectedAnswer: body.selectedAnswer,
        isCorrect,
        isDifficult: body.isDifficult,
      },
    });

    return NextResponse.json({ questionId: question.id, selectedAnswer: body.selectedAnswer, isCorrect });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Gagal menyimpan jawaban.' }, { status: 400 });
  }
}
