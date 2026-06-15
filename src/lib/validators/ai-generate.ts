import { z } from 'zod';
import { CPNS_CATEGORIES } from '@/lib/cpns/constants';

export const categoryEnum = z.enum(['TWK', 'TIU', 'TKP']);
export const difficultyEnum = z.enum(['mudah', 'sedang', 'sulit']);
export const modeEnum = z.enum(['latihan', 'try_out', 'HOTS']);

export const generateQuestionRequestSchema = z.object({
  category: categoryEnum,
  subcategory: z.string().min(2),
  amount: z.number().int().min(1).max(50),
  difficulty: difficultyEnum,
  mode: modeEnum,
  language: z.literal('Indonesia').default('Indonesia'),
}).superRefine((data, ctx) => {
  const allowed = CPNS_CATEGORIES[data.category];
  if (!allowed.includes(data.subcategory as never)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['subcategory'], message: 'Subkategori tidak valid untuk kategori ini.' });
  }
});
