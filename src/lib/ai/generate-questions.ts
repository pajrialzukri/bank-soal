import { prisma } from '@/lib/prisma';
import { getAIClient, getAIConfig } from '@/lib/ai/provider';
import { generateQuestionRequestSchema } from '@/lib/validators/ai-generate';
import { generatedQuestionBatchSchema } from '@/lib/validators/question';
import { generateFiguralQuestions } from '@/lib/ai/figural-generator';

const SYSTEM_PROMPT = 'Kamu adalah pembuat soal latihan CPNS profesional. Buat soal CPNS orisinal, bukan menyalin soal resmi. Soal harus relevan dengan SKD CPNS, memiliki 5 pilihan jawaban A-E, satu jawaban benar, pembahasan lengkap, alasan kenapa opsi lain salah, kategori, subkategori, difficulty, tags, dan referensi materi. Jangan membuat soal ambigu. Jangan mengulang soal yang sama. Output wajib JSON valid tanpa markdown.';

export async function generateAndStoreQuestions(input: unknown, createdById?: string) {
  const payload = generateQuestionRequestSchema.parse(input);
  const { provider, model } = getAIConfig();

  const batch = await prisma.aIQuestionBatch.create({
    data: {
      category: payload.category,
      subcategory: payload.subcategory,
      totalRequested: payload.amount,
      difficulty: payload.difficulty,
      mode: payload.mode,
      language: payload.language,
      provider,
      model,
      prompt: buildPrompt(payload),
      status: 'processing',
      createdById,
    },
  });

  try {
    if (payload.category === 'TIU' && payload.subcategory.startsWith('Figural')) {
      const figuralQuestions = generatedQuestionBatchSchema.parse(generateFiguralQuestions(payload));
      validateBatch(figuralQuestions, payload.amount, payload.category, payload.subcategory);
      const created = await persistQuestions(batch.id, figuralQuestions, payload.mode);
      await prisma.aIQuestionBatch.update({
        where: { id: batch.id },
        data: { totalGenerated: created.length, status: 'completed', rawResponse: figuralQuestions },
      });
      return { batchId: batch.id, count: created.length, questions: created };
    }

    let parsed: ReturnType<typeof generatedQuestionBatchSchema.parse> | null = null;
    let lastError = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const completion = await getAIClient().chat.completions.create({
          model,
          temperature: 0.7,
          max_tokens: 3500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: buildPrompt(payload) + (lastError ? `\n\nPerbaiki error output sebelumnya: ${lastError}` : '') },
          ],
          response_format: { type: 'json_object' },
        });

        const rawText = completion.choices[0]?.message?.content ?? '';
        const json = JSON.parse(rawText);
        const questions = Array.isArray(json) ? json : (json.questions ?? json.data ?? []);
        const normalizedQuestions = normalizeQuestions(questions, payload);
        parsed = generatedQuestionBatchSchema.parse(normalizedQuestions);
        validateBatch(parsed, payload.amount, payload.category, payload.subcategory);
        break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        if (attempt === 3) throw error;
      }
    }

    if (!parsed) throw new Error('Gagal menghasilkan soal valid setelah retry');

    const created = await persistQuestions(batch.id, parsed, payload.mode);
    await prisma.aIQuestionBatch.update({
      where: { id: batch.id },
      data: { totalGenerated: created.length, status: 'completed', rawResponse: parsed },
    });

    return { batchId: batch.id, count: created.length, questions: created };
  } catch (error) {
    await prisma.aIQuestionBatch.update({
      where: { id: batch.id },
      data: { status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' },
    });
    throw error;
  }
}

function buildPrompt(payload: ReturnType<typeof generateQuestionRequestSchema.parse>) {
  return [
    `Buat ${payload.amount} soal CPNS kategori ${payload.category}.`,
    `Subkategori: ${payload.subcategory}.`,
    `Tingkat kesulitan: ${payload.difficulty}.`,
    `Mode soal: ${payload.mode}.`,
    `Bahasa: ${payload.language}.`,
    'Format wajib per soal: question, options {A,B,C,D,E}, correctAnswer, explanation, wrongOptionsExplanation, category, subcategory, difficulty, tags, source, reference.',
    'Jangan gunakan field optionA/optionB sebagai pengganti options jika bisa. Jika terpaksa, tetap pastikan maknanya sama.',
    'Gunakan difficulty dalam Bahasa Indonesia: mudah, sedang, atau sulit.',
    'Pastikan tidak ada soal duplikat dalam satu batch.',
    'Kembalikan JSON array valid atau object {"questions": [...]}.'
  ].join(' ');
}

function validateBatch(questions: ReturnType<typeof generatedQuestionBatchSchema.parse>, amount: number, category: string, subcategory: string) {
  if (questions.length !== amount) throw new Error(`Jumlah soal tidak sesuai. Expected ${amount}, got ${questions.length}`);

  const seen = new Set<string>();
  for (const item of questions) {
    if (item.category !== category) throw new Error(`Kategori soal tidak sesuai: ${item.category}`);
    if (item.subcategory !== subcategory) throw new Error(`Subkategori soal tidak sesuai: ${item.subcategory}`);
    const key = `${item.question.trim().toLowerCase()}::${item.questionImageSvg ?? ''}`;
    if (seen.has(key)) throw new Error('Terdapat soal duplikat dalam batch');
    seen.add(key);
  }
}

async function persistQuestions(
  batchId: string,
  questions: ReturnType<typeof generatedQuestionBatchSchema.parse>,
  mode: ReturnType<typeof generateQuestionRequestSchema.parse>['mode'],
) {
  return prisma.$transaction(questions.map((item) => prisma.question.create({ data: buildQuestionCreateData(batchId, item, mode) })));
}

function buildQuestionCreateData(
  batchId: string,
  item: ReturnType<typeof generatedQuestionBatchSchema.parse>[number],
  mode: ReturnType<typeof generateQuestionRequestSchema.parse>['mode'],
) {
  return {
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
    mode,
    questionType: item.questionType,
    questionImageSvg: item.questionImageSvg,
    optionImageSvg: item.optionImageSvg,
    tags: item.tags,
    source: item.source,
    reference: item.reference,
    aiBatchId: batchId,
  };
}

function normalizeQuestions(questions: unknown, payload: ReturnType<typeof generateQuestionRequestSchema.parse>) {
  if (!Array.isArray(questions)) return [];

  return questions.map((item) => {
    const raw = isObject(item) ? item : {};
    const inlineOptions = isObject(raw.options) ? raw.options : {};
    const wrongMap = isObject(raw.wrongOptionsExplanation) ? raw.wrongOptionsExplanation : {};
    const correctAnswer = normalizeCorrectAnswer(getString(raw.correctAnswer) ?? getString(raw.answerKey) ?? getString(raw.kunciJawaban));

    return {
      question: getString(raw.question) ?? getString(raw.pertanyaan) ?? '',
      options: {
        A: getString(inlineOptions.A) ?? getString(raw.optionA) ?? getString(raw.A) ?? getString(raw.pilihanA) ?? '',
        B: getString(inlineOptions.B) ?? getString(raw.optionB) ?? getString(raw.B) ?? getString(raw.pilihanB) ?? '',
        C: getString(inlineOptions.C) ?? getString(raw.optionC) ?? getString(raw.C) ?? getString(raw.pilihanC) ?? '',
        D: getString(inlineOptions.D) ?? getString(raw.optionD) ?? getString(raw.D) ?? getString(raw.pilihanD) ?? '',
        E: getString(inlineOptions.E) ?? getString(raw.optionE) ?? getString(raw.E) ?? getString(raw.pilihanE) ?? '',
      },
      correctAnswer,
      explanation: getString(raw.explanation) ?? getString(raw.pembahasan) ?? '',
      wrongOptionsExplanation: buildWrongOptionsExplanation(wrongMap, correctAnswer),
      category: payload.category,
      subcategory: payload.subcategory,
      difficulty: normalizeDifficulty(getString(raw.difficulty) ?? payload.difficulty),
      questionType: 'text' as const,
      questionImageSvg: undefined,
      optionImageSvg: undefined,
      tags: Array.isArray(raw.tags)
        ? raw.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
        : ['cpns', payload.category.toLowerCase(), payload.subcategory.toLowerCase()],
      source: getString(raw.source) ?? 'AI Generated',
      reference: getString(raw.reference) ?? 'Materi dasar CPNS',
    };
  });
}

function buildWrongOptionsExplanation(wrongMap: Record<string, unknown>, correctAnswer: string) {
  const letters = ['A', 'B', 'C', 'D', 'E'] as const;
  return Object.fromEntries(letters.map((letter) => [
    letter,
    getString(wrongMap[letter]) ?? (letter === correctAnswer ? 'Jawaban benar.' : 'Bukan jawaban paling tepat berdasarkan konsep soal.'),
  ]));
}

function normalizeDifficulty(value: string | undefined) {
  const text = (value ?? '').toLowerCase().trim();
  if (text === 'easy') return 'mudah';
  if (text === 'medium') return 'sedang';
  if (text === 'hard') return 'sulit';
  if (text === 'mudah' || text === 'sedang' || text === 'sulit') return text;
  return 'sedang';
}

function normalizeCorrectAnswer(value: string | undefined) {
  const text = (value ?? '').toUpperCase().trim();
  return text === 'A' || text === 'B' || text === 'C' || text === 'D' || text === 'E' ? text : 'A';
}

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
