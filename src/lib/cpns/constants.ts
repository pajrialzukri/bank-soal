export const CPNS_CATEGORIES = {
  TWK: ['Pancasila', 'UUD 1945', 'NKRI', 'Bhinneka Tunggal Ika', 'Nasionalisme', 'Bela Negara', 'Sejarah Indonesia', 'Integritas', 'Pemerintahan'],
  TIU: ['Sinonim', 'Antonim', 'Analogi', 'Silogisme', 'Penalaran analitis', 'Aritmatika', 'Persentase', 'Perbandingan', 'Deret angka', 'Deret huruf', 'Soal cerita', 'Figural'],
  TKP: ['Pelayanan publik', 'Profesionalisme', 'Integritas', 'Kerja sama', 'Komunikasi', 'Adaptasi', 'Sosial budaya', 'Teknologi informasi', 'Anti radikalisme'],
} as const;

export const CATEGORY_META = {
  TWK: { name: 'Tes Wawasan Kebangsaan', color: 'from-blue-500 to-cyan-500' },
  TIU: { name: 'Tes Intelegensia Umum', color: 'from-indigo-500 to-violet-500' },
  TKP: { name: 'Tes Karakteristik Pribadi', color: 'from-sky-500 to-emerald-500' },
} as const;
