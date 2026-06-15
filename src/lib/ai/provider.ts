import OpenAI from 'openai';

export function getAIClient() {
  const provider = process.env.AI_PROVIDER ?? 'openrouter';

  if (provider === 'openai') {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY belum diatur');
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  if (!process.env.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY belum diatur');
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });
}

export function getAIConfig() {
  return {
    provider: process.env.AI_PROVIDER ?? 'openrouter',
    model: process.env.AI_MODEL ?? 'openai/gpt-4.1-mini',
  };
}
