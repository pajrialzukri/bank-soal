# Yuk Kita Bisa PNS

Website latihan CPNS berbasis Next.js + TypeScript + Tailwind CSS + Prisma + PostgreSQL + NextAuth + OpenAI/OpenRouter.

## Fitur utama

- Dashboard user: total soal, benar/salah, akurasi, progress TWK/TIU/TKP, streak, rekomendasi.
- Modul materi belajar CPNS.
- Modul latihan soal TWK/TIU/TKP.
- Simulasi try out CAT.
- Admin panel generate soal AI.
- Import/export soal JSON.
- Penyimpanan soal AI langsung ke database.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- React Hook Form
- Zod
- OpenAI/OpenRouter

## Environment

Salin `.env.example` ke `.env` lalu isi:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AI_PROVIDER`
- `AI_MODEL`
- `OPENROUTER_API_KEY` atau `OPENAI_API_KEY`

## Jalankan

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Endpoint penting

- `POST /api/admin/ai/generate`
- `POST /api/admin/questions/import`
- `GET /api/admin/questions/export`

## Catatan AI generator

Flow:

1. Admin pilih parameter generate.
2. Backend build prompt.
3. Backend call provider AI.
4. Parse JSON.
5. Validasi jumlah, opsi, jawaban, dan duplikasi.
6. Retry jika invalid.
7. Simpan ke `AIQuestionBatch` dan `Question`.
