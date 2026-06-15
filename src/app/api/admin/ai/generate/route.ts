import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateAndStoreQuestions } from '@/lib/ai/generate-questions';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await generateAndStoreQuestions(body, session.user.id);
    return NextResponse.json({
      batchId: result.batchId,
      count: result.count,
      preview: result.questions.slice(0, 2),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 400 });
  }
}
