import { z } from 'zod';

export const generatedQuestionSchema = z.object({
  question: z.string().min(10),
  options: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
    E: z.string().min(1),
  }),
  correctAnswer: z.enum(['A', 'B', 'C', 'D', 'E']),
  explanation: z.string().min(10),
  wrongOptionsExplanation: z.record(z.enum(['A', 'B', 'C', 'D', 'E']), z.string().min(3)),
  category: z.enum(['TWK', 'TIU', 'TKP']),
  subcategory: z.string().min(2),
  difficulty: z.enum(['mudah', 'sedang', 'sulit']),
  tags: z.array(z.string()).min(1),
  source: z.string().min(2),
  reference: z.string().min(2),
});

export const generatedQuestionBatchSchema = z.array(generatedQuestionSchema).min(1);
