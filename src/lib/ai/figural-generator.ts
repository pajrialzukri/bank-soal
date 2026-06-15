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
  subcategory: string;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  tags: string[];
  source: string;
  reference: string;
  questionType: 'figural';
  questionImageSvg: string;
  optionImageSvg: Record<'A' | 'B' | 'C' | 'D' | 'E', string>;
};

const letters = ['A', 'B', 'C', 'D', 'E'] as const;
const variants = ['analogy', 'sequence', 'matrix', 'reflection', 'rotation'] as const;

export function generateFiguralQuestions(payload: Payload): GeneratedFiguralQuestion[] {
  return Array.from({ length: payload.amount }, (_, index) => {
    const selected = resolveVariant(payload.subcategory, index);
    if (selected === 'analogy') return createAnalogyQuestion(index, payload.difficulty, payload.subcategory);
    if (selected === 'sequence') return createSequenceQuestion(index, payload.difficulty, payload.subcategory);
    if (selected === 'matrix') return createMatrixQuestion(index, payload.difficulty, payload.subcategory);
    if (selected === 'reflection') return createReflectionQuestion(index, payload.difficulty, payload.subcategory);
    return createRotationQuestion(index, payload.difficulty, payload.subcategory);
  });
}

function resolveVariant(subcategory: string, index: number) {
  if (subcategory === 'Figural Analogi') return 'analogy';
  if (subcategory === 'Figural Deret') return 'sequence';
  if (subcategory === 'Figural Matriks') return 'matrix';
  if (subcategory === 'Figural Refleksi') return 'reflection';
  if (subcategory === 'Figural Rotasi') return 'rotation';
  return variants[index % variants.length];
}

function createAnalogyQuestion(index: number, difficulty: Payload['difficulty'], subcategory: string): GeneratedFiguralQuestion {
  const patterns = [0, 1, 2, 3, 4];
  const correctPattern = patterns[index % patterns.length];
  const options = shuffleDeterministic([...patterns], index + 3);
  const correctAnswer = letters[options.indexOf(correctPattern)] ?? 'A';

  return buildQuestion({
    difficulty,
    question: difficulty === 'sulit'
      ? 'Perhatikan hubungan gambar pada kotak pertama dan kedua. Pilih gambar yang memiliki hubungan analogi yang sama untuk melengkapi pasangan berikutnya.'
      : 'Pilih gambar yang memiliki hubungan analogi sama seperti pasangan contoh.',
    explanation: `Pada pasangan contoh terjadi perubahan arah bentuk utama dan perpindahan titik penanda ke sudut yang konsisten. Opsi ${correctAnswer} menerapkan perubahan yang sama pada pasangan kedua.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'analogi'],
    reference: 'Soal figural analogi gaya CPNS/psikotes',
    subcategory,
    questionImageSvg: promptBoard([
      shapeToken(0),
      shapeToken(1),
      shapeToken(2),
      '?',
    ], 'analogy', index),
    optionImageSvg: Object.fromEntries(options.map((pattern, idx) => [letters[idx], optionBoard(shapeToken(pattern))])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
  });
}

function createSequenceQuestion(index: number, difficulty: Payload['difficulty'], subcategory: string): GeneratedFiguralQuestion {
  const patterns = [1, 2, 3, 4, 5];
  const correctPattern = patterns[(index + 1) % patterns.length];
  const options = shuffleDeterministic([...patterns], index + 7);
  const correctAnswer = letters[options.indexOf(correctPattern)] ?? 'A';

  return buildQuestion({
    difficulty,
    question: difficulty === 'sulit'
      ? 'Perhatikan perubahan gambar dari kiri ke kanan. Pilih gambar yang paling tepat untuk melanjutkan pola pada kotak terakhir.'
      : 'Pilih gambar berikutnya yang paling tepat sesuai pola.',
    explanation: `Pola bergerak secara bertahap: jumlah elemen bertambah dan posisi garis utama berpindah teratur. Opsi ${correctAnswer} adalah kelanjutan yang paling konsisten.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'deret'],
    reference: 'Soal figural deret pola gaya CPNS/psikotes',
    subcategory,
    questionImageSvg: promptBoard([
      barsToken(1),
      barsToken(2),
      barsToken(3),
      '?',
    ], 'sequence', index),
    optionImageSvg: Object.fromEntries(options.map((pattern, idx) => [letters[idx], optionBoard(barsToken(pattern))])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
  });
}

function createMatrixQuestion(index: number, difficulty: Payload['difficulty'], subcategory: string): GeneratedFiguralQuestion {
  const patterns = [1, 2, 3, 4, 5];
  const correctPattern = patterns[(index + 2) % patterns.length];
  const options = shuffleDeterministic([...patterns], index + 11);
  const correctAnswer = letters[options.indexOf(correctPattern)] ?? 'A';

  return buildQuestion({
    difficulty,
    question: difficulty === 'sulit'
      ? 'Perhatikan susunan gambar pada matriks. Tentukan gambar yang paling tepat untuk mengisi kotak kosong berdasarkan pola baris dan kolom.'
      : 'Pilih gambar yang tepat untuk melengkapi matriks.',
    explanation: `Dalam matriks, tiap perpindahan ke kanan menambah elemen kecil, sedangkan perpindahan ke bawah mengubah orientasi garis. Opsi ${correctAnswer} memenuhi kedua aturan tersebut.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'matriks'],
    reference: 'Soal figural matriks gaya CPNS/psikotes',
    subcategory,
    questionImageSvg: matrixPrompt(correctPattern),
    optionImageSvg: Object.fromEntries(options.map((pattern, idx) => [letters[idx], optionBoard(matrixToken(pattern))])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
  });
}

function createReflectionQuestion(index: number, difficulty: Payload['difficulty'], subcategory: string): GeneratedFiguralQuestion {
  const patterns = [0, 1, 2, 3, 4];
  const correctPattern = patterns[(index + 3) % patterns.length];
  const options = shuffleDeterministic([...patterns], index + 13);
  const correctAnswer = letters[options.indexOf(correctPattern)] ?? 'A';

  return buildQuestion({
    difficulty,
    question: difficulty === 'sulit'
      ? 'Perhatikan gambar pada kotak soal. Pilih hasil pencerminan yang paling tepat terhadap sumbu yang ditunjukkan.'
      : 'Pilih hasil pencerminan yang paling tepat.',
    explanation: `Hasil cermin yang benar harus mempertahankan bentuk tetapi menukar posisi elemen terhadap sumbu. Opsi ${correctAnswer} memenuhi aturan itu secara tepat.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'refleksi'],
    reference: 'Soal figural refleksi gaya CPNS/psikotes',
    subcategory,
    questionImageSvg: reflectionPrompt(correctPattern),
    optionImageSvg: Object.fromEntries(options.map((pattern, idx) => [letters[idx], optionBoard(reflectionToken(pattern))])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
  });
}

function createRotationQuestion(index: number, difficulty: Payload['difficulty'], subcategory: string): GeneratedFiguralQuestion {
  const patterns = [0, 1, 2, 3, 4];
  const correctPattern = patterns[(index + 4) % patterns.length];
  const options = shuffleDeterministic([...patterns], index + 17);
  const correctAnswer = letters[options.indexOf(correctPattern)] ?? 'A';

  return buildQuestion({
    difficulty,
    question: difficulty === 'sulit'
      ? 'Perhatikan gambar pada kotak soal. Pilih hasil rotasi yang paling tepat dengan tetap mempertahankan posisi titik penanda.'
      : 'Pilih hasil rotasi gambar yang paling tepat.',
    explanation: `Bentuk utama diputar dengan arah tertentu dan posisi titik penanda ikut berubah secara konsisten. Opsi ${correctAnswer} adalah hasil rotasi yang tepat.`,
    correctAnswer,
    tags: ['cpns', 'tiu', 'figural', 'rotasi'],
    reference: 'Soal figural rotasi gaya CPNS/psikotes',
    subcategory,
    questionImageSvg: rotationPrompt(correctPattern),
    optionImageSvg: Object.fromEntries(options.map((pattern, idx) => [letters[idx], optionBoard(rotationToken(pattern))])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
  });
}

function buildQuestion(input: {
  difficulty: Payload['difficulty'];
  question: string;
  explanation: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  tags: string[];
  reference: string;
  subcategory: string;
  questionImageSvg: string;
  optionImageSvg: Record<'A' | 'B' | 'C' | 'D' | 'E', string>;
}): GeneratedFiguralQuestion {
  return {
    question: input.question,
    options: { A: 'Opsi A', B: 'Opsi B', C: 'Opsi C', D: 'Opsi D', E: 'Opsi E' },
    correctAnswer: input.correctAnswer,
    explanation: input.explanation,
    wrongOptionsExplanation: Object.fromEntries(letters.map((letter) => [
      letter,
      letter === input.correctAnswer
        ? 'Transformasi visual pada opsi ini sama persis dengan pola pada soal.'
        : 'Opsi ini tidak tepat karena arah, posisi, atau jumlah elemennya tidak mengikuti pola pada soal.',
    ])) as Record<'A' | 'B' | 'C' | 'D' | 'E', string>,
    category: 'TIU',
    subcategory: input.subcategory,
    difficulty: input.difficulty,
    tags: input.tags,
    source: 'System Generated Figural',
    reference: input.reference,
    questionType: 'figural',
    questionImageSvg: input.questionImageSvg,
    optionImageSvg: input.optionImageSvg,
  };
}

function promptBoard(items: string[], kind: 'analogy' | 'sequence', seed: number) {
  const labels = kind === 'analogy' ? ['A', 'B', 'C', '?'] : ['', '', '', '?'];
  const cells = items.map((item, index) => examCell(14 + index * 42, 20, item, labels[index]));
  const separators = kind === 'analogy'
    ? `<text x="54" y="78" font-size="20" fill="#111827">:</text><text x="96" y="78" font-size="20" fill="#111827">::</text>`
    : `<text x="51" y="78" font-size="18" fill="#111827">→</text><text x="93" y="78" font-size="18" fill="#111827">→</text><text x="135" y="78" font-size="18" fill="#111827">→</text>`;
  return sheetSvg(188, 108, `${cells.join('')}${separators}<text x="166" y="15" font-size="8" fill="#6B7280">${seed + 1}</text>`);
}

function matrixPrompt(correctPattern: number) {
  const tokens = [matrixToken(1), matrixToken(2), matrixToken(3), matrixToken(2), matrixToken(3), matrixToken(4), matrixToken(3), matrixToken(4), '?'];
  const cells = tokens.map((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return examCell(20 + col * 44, 16 + row * 30, item, index === 8 ? '?' : '');
  }).join('');
  return sheetSvg(176, 116, `${cells}<text x="158" y="108" font-size="8" fill="#6B7280">${correctPattern}</text>`);
}

function reflectionPrompt(pattern: number) {
  return sheetSvg(150, 108, `
    <line x1="75" y1="16" x2="75" y2="92" stroke="#6B7280" stroke-width="1.5" stroke-dasharray="4 3" />
    ${examCell(24, 24, shapeToken(pattern), '')}
    <text x="94" y="60" font-size="18" fill="#111827">?</text>
  `);
}

function rotationPrompt(pattern: number) {
  return sheetSvg(150, 108, `
    ${examCell(20, 24, rotationToken(pattern), '')}
    <text x="76" y="60" font-size="17" fill="#111827">⟳</text>
    <text x="100" y="60" font-size="18" fill="#111827">?</text>
  `);
}

function optionBoard(token: string) {
  return sheetSvg(86, 86, examCell(16, 16, token, ''));
}

function examCell(x: number, y: number, token: string, badge: string) {
  const badgeText = badge ? `<text x="${x + 2}" y="${y - 4}" font-size="9" font-weight="700" fill="#111827">${badge}</text>` : '';
  return `${badgeText}<rect x="${x}" y="${y}" width="34" height="34" fill="#FFFFFF" stroke="#111827" stroke-width="1.5" />${token === '?' ? `<text x="${x + 11}" y="${y + 23}" font-size="18" fill="#111827">?</text>` : placeToken(x, y, token)}`;
}

function placeToken(x: number, y: number, token: string) {
  return `<g transform="translate(${x} ${y})">${token}</g>`;
}

function shapeToken(mode: number) {
  const variants = [
    '<polygon points="7,17 17,7 27,17 17,27" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="25" cy="10" r="2.3" fill="#111827" />',
    '<polygon points="7,17 17,7 27,17 17,27" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="10" cy="25" r="2.3" fill="#111827" />',
    '<rect x="8" y="8" width="18" height="18" fill="none" stroke="#111827" stroke-width="1.6" transform="rotate(45 17 17)" /><circle cx="24" cy="24" r="2.3" fill="#111827" />',
    '<polygon points="8,26 17,8 26,26" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="10" cy="10" r="2.3" fill="#111827" />',
    '<path d="M9 25 L17 9 L25 25 Z" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="24" cy="10" r="2.3" fill="#111827" />',
  ];
  return variants[mode % variants.length];
}

function barsToken(step: number) {
  const lineX = 8 + (step % 4) * 4;
  const dots = Array.from({ length: Math.min(step, 4) }, (_, i) => `<circle cx="${10 + i * 6}" cy="26" r="1.8" fill="#111827" />`).join('');
  return `<line x1="${lineX}" y1="10" x2="${lineX + 16}" y2="10" stroke="#111827" stroke-width="1.6" /><line x1="${lineX}" y1="18" x2="${lineX + 16}" y2="18" stroke="#111827" stroke-width="1.6" />${dots}`;
}

function matrixToken(step: number) {
  const dots = Array.from({ length: step }, (_, i) => `<circle cx="${10 + (i % 2) * 9}" cy="${10 + Math.floor(i / 2) * 8}" r="1.8" fill="#111827" />`).join('');
  const line = step % 2 === 0
    ? '<line x1="8" y1="25" x2="26" y2="25" stroke="#111827" stroke-width="1.6" />'
    : '<line x1="17" y1="8" x2="17" y2="26" stroke="#111827" stroke-width="1.6" />';
  return `${line}${dots}`;
}

function reflectionToken(mode: number) {
  const variants = [
    '<path d="M8 25 L24 25 L16 9 Z" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="24" cy="10" r="2.2" fill="#111827" />',
    '<path d="M10 9 L26 9 L18 25 Z" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="10" cy="24" r="2.2" fill="#111827" />',
    '<path d="M8 9 L24 9 L16 25 Z" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="24" cy="24" r="2.2" fill="#111827" />',
    '<path d="M10 25 L26 25 L18 9 Z" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="10" cy="10" r="2.2" fill="#111827" />',
    '<path d="M8 25 L24 25 L16 9 Z" fill="none" stroke="#111827" stroke-width="1.6" /><circle cx="10" cy="10" r="2.2" fill="#111827" />',
  ];
  return variants[mode % variants.length];
}

function rotationToken(mode: number) {
  const transforms = ['rotate(0 17 17)', 'rotate(45 17 17)', 'rotate(90 17 17)', 'rotate(135 17 17)', 'rotate(180 17 17)'];
  return `<g transform="${transforms[mode % transforms.length]}"><line x1="9" y1="17" x2="24" y2="17" stroke="#111827" stroke-width="1.8" /><path d="M20 12 L25 17 L20 22" fill="none" stroke="#111827" stroke-width="1.8" /><circle cx="23" cy="9" r="2.1" fill="#111827" /></g>`;
}

function sheetSvg(width: number, height: number, content: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="#FFFFFF" stroke="#111827" stroke-width="1.2" />${content}</svg>`;
}

function shuffleDeterministic<T>(input: T[], seed: number) {
  const items = [...input];
  for (let i = items.length - 1; i > 0; i--) {
    const j = (seed * (i + 5) + i) % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
