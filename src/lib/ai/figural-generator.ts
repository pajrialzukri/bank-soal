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
const rotations = [0, 45, 90, 135, 180] as const;
const variants = ['rotation', 'reflection', 'sequence', 'matrix', 'analogy'] as const;

export function generateFiguralQuestions(payload: Payload): GeneratedFiguralQuestion[] {
  return Array.from({ length: payload.amount }, (_, index) => {
    const variant = variants[index % variants.length];
    if (variant === 'rotation') return createRotationQuestion(index, payload.difficulty);
    if (variant === 'reflection') return createReflectionQuestion(index, payload.difficulty);
    if (variant === 'sequence') return createSequenceQuestion(index, payload.difficulty);
    if (variant === 'matrix') return createMatrixQuestion(index, payload.difficulty);
    return createAnalogyQuestion(index, payload.difficulty);
  });
}

function createRotationQuestion(index: number, difficulty: Payload['difficulty']): GeneratedFiguralQuestion {
  const baseRotation = rotations[index % rotations.length];
  const correctRotation = rotations[(index + 2) % rotations.length];
  const optionRotations = shuffleDeterministic([0, 45, 90, 135, 180], index + 7);
  const correctIndex = optionRotations.indexOf(correctRotation);
  const correctAnswer = letters[correctIndex] ?? 'A';

  return buildQuestion({
    question: difficulty === 'sulit'
      ? 'Perhatikan gambar soal. Tentukan hasil rotasi searah jarum jam yang tepat dengan tetap mempertahankan orientasi detail kecil pada tiap elemen.'
      : 'Perhatikan gambar soal. Pilih gambar yang merupakan hasil rotasi searah jarum jam paling tepat dari bentuk pada soal.',
    explanation: `Bentuk utama adalah panah dengan titik penanda. Setelah diputar, arah panah dan posisi titik ikut berubah secara konsisten. Opsi ${correctAnswer} mempertahankan hubungan elemen tersebut dengan benar.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'rotasi'],
    reference: 'Pola rotasi bentuk figural TIU CPNS',
    questionImageSvg: buildArrowFigureSvg(baseRotation, false),
    optionImageSvg: Object.fromEntries(optionRotations.map((rotation, idx) => [letters[idx], buildArrowFigureSvg(rotation, true)])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    difficulty,
  });
}

function createReflectionQuestion(index: number, difficulty: Payload['difficulty']): GeneratedFiguralQuestion {
  const mirrors = ['vertical', 'horizontal', 'diagonal-left', 'diagonal-right', 'none'] as const;
  const correctMirror = mirrors[index % mirrors.length];
  const options = shuffleDeterministic([...mirrors], index + 11);
  const correctIndex = options.indexOf(correctMirror);
  const correctAnswer = letters[correctIndex] ?? 'A';

  return buildQuestion({
    question: difficulty === 'mudah'
      ? 'Perhatikan gambar soal. Pilih hasil pencerminan yang paling tepat.'
      : 'Perhatikan gambar soal. Tentukan hasil pencerminan yang sesuai berdasarkan posisi bentuk utama dan titik penanda.',
    explanation: `Untuk soal refleksi, bentuk harus tercermin terhadap sumbu yang dimaksud tanpa mengubah ukuran. Opsi ${correctAnswer} adalah satu-satunya yang menempatkan panah dan titik pada sisi cerminan yang benar.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'refleksi'],
    reference: 'Pola pencerminan figural TIU CPNS',
    questionImageSvg: buildReflectionPromptSvg(correctMirror),
    optionImageSvg: Object.fromEntries(options.map((mirror, idx) => [letters[idx], buildReflectedArrowSvg(mirror)])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    difficulty,
  });
}

function createSequenceQuestion(index: number, difficulty: Payload['difficulty']): GeneratedFiguralQuestion {
  const steps = [1, 2, 3, 4, 5];
  const correctStep = steps[(index + 1) % steps.length];
  const options = shuffleDeterministic([...steps], index + 19);
  const correctIndex = options.indexOf(correctStep);
  const correctAnswer = letters[correctIndex] ?? 'A';

  return buildQuestion({
    question: difficulty === 'sulit'
      ? 'Perhatikan deret gambar. Tentukan gambar berikutnya yang sesuai dengan pola perpindahan posisi dan penambahan titik.'
      : 'Perhatikan deret gambar. Pilih gambar berikutnya yang paling tepat.',
    explanation: `Setiap langkah menggeser posisi batang biru dan menambah titik kuning secara berurutan. Opsi ${correctAnswer} melanjutkan pola tersebut secara konsisten.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'deret pola'],
    reference: 'Deret pola visual figural TIU CPNS',
    questionImageSvg: buildSequencePromptSvg(correctStep),
    optionImageSvg: Object.fromEntries(options.map((step, idx) => [letters[idx], buildSequenceOptionSvg(step)])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    difficulty,
  });
}

function createMatrixQuestion(index: number, difficulty: Payload['difficulty']): GeneratedFiguralQuestion {
  const answers = [1, 2, 3, 4, 5];
  const correctValue = answers[(index + 3) % answers.length];
  const options = shuffleDeterministic([...answers], index + 23);
  const correctIndex = options.indexOf(correctValue);
  const correctAnswer = letters[correctIndex] ?? 'A';

  return buildQuestion({
    question: difficulty === 'mudah'
      ? 'Perhatikan matriks gambar berikut. Pilih kotak yang melengkapi pola.'
      : 'Perhatikan matriks gambar 3x3. Tentukan gambar yang paling tepat untuk mengisi kotak kosong berdasarkan perubahan jumlah titik dan orientasi batang.',
    explanation: `Dalam matriks, tiap baris menambah jumlah titik sementara arah batang bergeser teratur. Opsi ${correctAnswer} memenuhi dua aturan tersebut sekaligus.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'matriks'],
    reference: 'Matriks visual figural TIU CPNS',
    questionImageSvg: buildMatrixPromptSvg(),
    optionImageSvg: Object.fromEntries(options.map((value, idx) => [letters[idx], buildMatrixOptionSvg(value)])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    difficulty,
  });
}

function createAnalogyQuestion(index: number, difficulty: Payload['difficulty']): GeneratedFiguralQuestion {
  const variants = [0, 1, 2, 3, 4];
  const correctVariant = variants[(index + 4) % variants.length];
  const options = shuffleDeterministic([...variants], index + 29);
  const correctIndex = options.indexOf(correctVariant);
  const correctAnswer = letters[correctIndex] ?? 'A';

  return buildQuestion({
    question: difficulty === 'sulit'
      ? 'Hubungan gambar pertama dan kedua mengikuti perubahan bentuk dan titik tertentu. Pilih gambar yang memiliki hubungan analogi sama dengan pasangan ketiga.'
      : 'Pilih gambar yang memiliki hubungan analogi sama seperti pasangan contoh.',
    explanation: `Pasangan contoh menunjukkan perubahan arah panah dan perpindahan titik ke sudut baru. Opsi ${correctAnswer} menerapkan transformasi yang sama pada pasangan target.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'analogi'],
    reference: 'Analogi bentuk figural TIU CPNS',
    questionImageSvg: buildAnalogyPromptSvg(),
    optionImageSvg: Object.fromEntries(options.map((variant, idx) => [letters[idx], buildAnalogyOptionSvg(variant)])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    difficulty,
  });
}

function buildQuestion(input: {
  question: string;
  explanation: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  tags: string[];
  reference: string;
  questionImageSvg: string;
  optionImageSvg: Record<'A' | 'B' | 'C' | 'D' | 'E', string>;
  difficulty: Payload['difficulty'];
}): GeneratedFiguralQuestion {
  return {
    question: input.question,
    options: {
      A: 'Lihat gambar opsi A',
      B: 'Lihat gambar opsi B',
      C: 'Lihat gambar opsi C',
      D: 'Lihat gambar opsi D',
      E: 'Lihat gambar opsi E',
    },
    correctAnswer: input.correctAnswer,
    explanation: input.explanation,
    wrongOptionsExplanation: Object.fromEntries(letters.map((letter) => [
      letter,
      letter === input.correctAnswer
        ? 'Ini adalah pilihan yang tepat karena transformasi visualnya sesuai pola.'
        : 'Pilihan ini tidak tepat karena ada elemen bentuk atau titik penanda yang tidak mengikuti pola soal.',
    ])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    category: 'TIU',
    subcategory: 'Figural',
    difficulty: input.difficulty,
    tags: input.tags,
    source: 'System Generated Figural',
    reference: input.reference,
    questionType: 'figural',
    questionImageSvg: input.questionImageSvg,
    optionImageSvg: input.optionImageSvg,
  };
}

function buildArrowFigureSvg(rotation: number, withFrame: boolean) {
  const frame = withFrame ? '<rect x="8" y="8" width="104" height="104" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />' : '';
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="none">
      ${frame}
      <g transform="translate(60 60) rotate(${rotation}) translate(-60 -60)">
        <path d="M25 60 H76" stroke="#111827" stroke-width="12" stroke-linecap="round"/>
        <path d="M74 42 L94 60 L74 78" stroke="#111827" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="82" cy="34" r="7" fill="#F59E0B"/>
      </g>
    </svg>
  `.trim();
}

function buildReflectionPromptSvg(mirror: 'vertical' | 'horizontal' | 'diagonal-left' | 'diagonal-right' | 'none') {
  const line = mirror === 'vertical'
    ? '<line x1="60" y1="18" x2="60" y2="102" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="6 6" />'
    : mirror === 'horizontal'
      ? '<line x1="18" y1="60" x2="102" y2="60" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="6 6" />'
      : mirror === 'diagonal-left'
        ? '<line x1="20" y1="100" x2="100" y2="20" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="6 6" />'
        : mirror === 'diagonal-right'
          ? '<line x1="20" y1="20" x2="100" y2="100" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="6 6" />'
          : '<line x1="18" y1="60" x2="102" y2="60" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="6 6" />';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="none"><rect x="8" y="8" width="104" height="104" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />${line}<path d="M28 78 H66" stroke="#111827" stroke-width="10" stroke-linecap="round"/><path d="M64 62 L82 78 L64 94" stroke="#111827" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42" cy="44" r="7" fill="#F59E0B"/></svg>`;
}

function buildReflectedArrowSvg(mode: 'vertical' | 'horizontal' | 'diagonal-left' | 'diagonal-right' | 'none') {
  const transform = mode === 'vertical'
    ? 'translate(120 0) scale(-1 1)'
    : mode === 'horizontal'
      ? 'translate(0 120) scale(1 -1)'
      : mode === 'diagonal-left'
        ? 'translate(0 120) rotate(-90)'
        : mode === 'diagonal-right'
          ? 'translate(120 0) rotate(90)'
          : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="none"><rect x="8" y="8" width="104" height="104" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" /><g transform="${transform}"><path d="M28 78 H66" stroke="#111827" stroke-width="10" stroke-linecap="round"/><path d="M64 62 L82 78 L64 94" stroke="#111827" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42" cy="44" r="7" fill="#F59E0B"/></g></svg>`;
}

function buildSequencePromptSvg(correctStep: number) {
  const cells = [0, 1, 2].map((step) => buildSequenceCell(16 + step * 34, 28, step + correctStep - 1));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120" width="140" height="120" fill="none"><rect x="8" y="8" width="124" height="104" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />${cells.join('')}<text x="108" y="66" font-size="28" fill="#94A3B8">?</text></svg>`;
}

function buildSequenceOptionSvg(step: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90" fill="none"><rect x="8" y="8" width="74" height="74" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />${buildSequenceCell(10, 12, step)}</svg>`;
}

function buildSequenceCell(x: number, y: number, step: number) {
  const offset = (step % 3) * 6;
  const dots = Array.from({ length: (step % 4) + 1 }, (_, i) => `<circle cx="${x + 10 + i * 8}" cy="${y + 30 + offset}" r="3.5" fill="#F59E0B"/>`).join('');
  return `<rect x="${x}" y="${y}" width="26" height="54" rx="10" fill="#EFF6FF" stroke="#BFDBFE"/><rect x="${x + 6 + offset / 2}" y="${y + 10}" width="14" height="34" rx="7" fill="#111827"/>${dots}`;
}

function buildMatrixPromptSvg() {
  const cells = [1, 2, 3, 2, 3, 4, 3, 4].map((value, idx) => buildMatrixCell(18 + (idx % 3) * 32, 18 + Math.floor(idx / 3) * 32, value));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="130" height="130" fill="none"><rect x="8" y="8" width="114" height="114" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />${cells.join('')}<rect x="82" y="82" width="24" height="24" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-dasharray="4 4" /><text x="90" y="100" font-size="16" fill="#94A3B8">?</text></svg>`;
}

function buildMatrixOptionSvg(value: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90" fill="none"><rect x="8" y="8" width="74" height="74" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />${buildMatrixCell(24, 24, value)}</svg>`;
}

function buildMatrixCell(x: number, y: number, value: number) {
  const dots = Array.from({ length: value }, (_, i) => `<circle cx="${x + 6 + (i % 2) * 10}" cy="${y + 7 + Math.floor(i / 2) * 10}" r="3.2" fill="#F59E0B"/>`).join('');
  return `<rect x="${x}" y="${y}" width="24" height="24" rx="8" fill="#EFF6FF" stroke="#BFDBFE"/><path d="M${x + 6} ${y + 18} H${x + 18}" stroke="#111827" stroke-width="4" stroke-linecap="round"/>${dots}`;
}

function buildAnalogyPromptSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120" fill="none"><rect x="8" y="8" width="144" height="104" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />${buildAnalogyPair(18, 26, 0)}<text x="70" y="62" font-size="20" fill="#64748B">:</text>${buildAnalogyPair(82, 26, 1)}<text x="130" y="62" font-size="20" fill="#64748B">::</text>${buildAnalogySingle(18, 72, 2)}</svg>`;
}

function buildAnalogyOptionSvg(variant: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90" fill="none"><rect x="8" y="8" width="74" height="74" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />${buildAnalogySingle(18, 22, variant)}</svg>`;
}

function buildAnalogyPair(x: number, y: number, variant: number) {
  return `${buildAnalogySingle(x, y, variant)}${buildAnalogySingle(x + 26, y, variant + 1)}`;
}

function buildAnalogySingle(x: number, y: number, variant: number) {
  const rotations = [0, 90, 180, 270, 45];
  return `<g transform="translate(${x + 14} ${y + 14}) rotate(${rotations[variant % rotations.length]}) translate(-${x + 14} -${y + 14})"><rect x="${x}" y="${y}" width="28" height="28" rx="9" fill="#EFF6FF" stroke="#BFDBFE"/><path d="M${x + 7} ${y + 14} H${x + 20}" stroke="#111827" stroke-width="5" stroke-linecap="round"/><circle cx="${x + 18}" cy="${y + 8}" r="3.5" fill="#F59E0B"/></g>`;
}

function shuffleDeterministic<T>(input: T[], seed: number) {
  const items = [...input];
  for (let i = items.length - 1; i > 0; i--) {
    const j = (seed * (i + 3) + i) % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
