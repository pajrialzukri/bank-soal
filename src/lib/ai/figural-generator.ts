type Payload = {
  category: 'TWK' | 'TIU' | 'TKP';
  subcategory: string;
  amount: number;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  mode: 'latihan' | 'try_out' | 'HOTS';
  language: 'Indonesia';
};

type GeneratedFiguralQuestion = {
  question: string;
  options: Record<'A' | 'B' | 'C' | 'D' | 'E', string>;
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  wrongOptionsExplanation: Record<'A' | 'B' | 'C' | 'D' | 'E', string>;
  category: 'TIU';
  subcategory: 'Figural';
  difficulty: 'mudah' | 'sedang' | 'sulit';
  tags: string[];
  source: string;
  reference: string;
  questionType: 'figural';
  questionImageSvg: string;
  optionImageSvg: Record<'A' | 'B' | 'C' | 'D' | 'E', string>;
};

const letters = ['A', 'B', 'C', 'D', 'E'] as const;
const rotations = [0, 45, 90, 135, 180];

export function generateFiguralQuestions(payload: Payload): GeneratedFiguralQuestion[] {
  return Array.from({ length: payload.amount }, (_, index) => createRotationQuestion(index, payload.difficulty));
}

function createRotationQuestion(index: number, difficulty: Payload['difficulty']): GeneratedFiguralQuestion {
  const baseRotation = rotations[index % rotations.length];
  const correctRotation = rotations[(index + 2) % rotations.length] as 0 | 45 | 90 | 135 | 180;
  const optionRotations = shuffleDeterministic([0, 45, 90, 135, 180], index + 7);
  const correctIndex = optionRotations.indexOf(correctRotation);
  const correctAnswer = letters[correctIndex] ?? 'A';

  const promptMap = {
    mudah: 'Perhatikan gambar soal. Pilih gambar yang merupakan hasil rotasi searah jarum jam paling tepat dari bentuk pada soal.',
    sedang: 'Perhatikan gambar soal. Pilih gambar yang merupakan hasil rotasi searah jarum jam dari bentuk pada soal tanpa mengubah proporsi dan posisi elemen tambahan.',
    sulit: 'Perhatikan gambar soal. Tentukan hasil rotasi searah jarum jam yang tepat dengan tetap mempertahankan orientasi detail kecil pada tiap elemen.',
  };

  return {
    question: promptMap[difficulty],
    options: {
      A: 'Lihat gambar opsi A',
      B: 'Lihat gambar opsi B',
      C: 'Lihat gambar opsi C',
      D: 'Lihat gambar opsi D',
      E: 'Lihat gambar opsi E',
    },
    correctAnswer,
    explanation: `Gambar pada soal terdiri dari panah utama dan titik penanda. Jika bentuk diputar searah jarum jam, maka orientasi panah dan posisi titik ikut berpindah secara konsisten. Opsi ${correctAnswer} adalah satu-satunya yang mempertahankan hubungan kedua elemen tersebut setelah rotasi.`,
    wrongOptionsExplanation: Object.fromEntries(letters.map((letter, idx) => [
      letter,
      idx === correctIndex
        ? 'Ini adalah hasil rotasi yang tepat: arah panah dan posisi titik penanda sama-sama berpindah konsisten.'
        : 'Opsi ini tidak tepat karena salah arah rotasi atau posisi titik penandanya tidak ikut berpindah sesuai bentuk utama.',
    ])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    category: 'TIU',
    subcategory: 'Figural',
    difficulty,
    tags: ['cpns', 'tiu', 'figural', 'rotasi'],
    source: 'System Generated Figural',
    reference: 'Pola rotasi bentuk figural TIU CPNS',
    questionType: 'figural',
    questionImageSvg: buildFigureSvg(baseRotation, false),
    optionImageSvg: Object.fromEntries(optionRotations.map((rotation, idx) => [letters[idx], buildFigureSvg(rotation, true)])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
  };
}

function buildFigureSvg(rotation: number, withFrame: boolean) {
  const frame = withFrame ? '<rect x="8" y="8" width="104" height="104" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />' : '';
  const dotX = 82;
  const dotY = 34;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="none">
      ${frame}
      <g transform="translate(60 60) rotate(${rotation}) translate(-60 -60)">
        <path d="M25 60 H76" stroke="#2563EB" stroke-width="12" stroke-linecap="round"/>
        <path d="M74 42 L94 60 L74 78" stroke="#2563EB" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${dotX}" cy="${dotY}" r="7" fill="#F59E0B"/>
      </g>
    </svg>
  `.trim();
}

function shuffleDeterministic<T>(input: T[], seed: number) {
  const items = [...input];
  for (let i = items.length - 1; i > 0; i--) {
    const j = (seed * (i + 3) + i) % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
