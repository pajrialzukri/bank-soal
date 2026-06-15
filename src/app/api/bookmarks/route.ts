import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const bookmarkSchema = z.object({ questionId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = bookmarkSchema.parse(await request.json());
    const question = await prisma.question.findUnique({ where: { id: body.questionId } });
    if (!question) return NextResponse.json({ error: 'Soal tidak ditemukan.' }, { status: 404 });

    const existing = await prisma.bookmark.findUnique({ where: { userId_questionId: { userId: session.user.id, questionId: question.id } } });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false, message: 'Bookmark dihapus.' });
    }

    await prisma.bookmark.create({ data: { userId: session.user.id, questionId: question.id } });
    return NextResponse.json({ bookmarked: true, message: 'Soal berhasil dibookmark.' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Gagal bookmark.' }, { status: 400 });
  }
}
