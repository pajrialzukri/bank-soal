import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatedQuestionBatchSchema } from '@/lib/validators/question';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = generatedQuestionBatchSchema.parse(body);
    const created = await prisma.$transaction(items.map((item) => prisma.question.create({
      data: {
        question: item.question,
        optionA: item.options.A,
        optionB: item.options.B,
        optionC: item.options.C,
        optionD: item.options.D,
        optionE: item.options.E,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        wrongOptionsExplanation: item.wrongOptionsExplanation,
        category: item.category,
        subcategory: item.subcategory,
        difficulty: item.difficulty,
        tags: item.tags,
        source: item.source,
        reference: item.reference,
      },
    })));
    return NextResponse.json({ count: created.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import gagal' }, { status: 400 });
  }
}
