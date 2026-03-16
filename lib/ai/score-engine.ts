export type SpeakingScore = {
  fluency: number;
  grammar: number;
  vocabulary: number;
};

function clamp(value: number, min = 1, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function calculateSpeakingScore(params: {
  userAnswer: string;
  correction?: {
    wrong?: string;
    correct?: string;
    explanation?: string;
  };
  grammarNotes?: string[];
  vocabulary?: string[];
}): SpeakingScore {
  const { userAnswer, correction, grammarNotes = [], vocabulary = [] } = params;

  const cleaned = (userAnswer || "").trim();
  const words = cleaned.length > 0 ? cleaned.split(/\s+/).filter(Boolean) : [];
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));

  let fluency = 40;
  let grammar = 85;
  let vocab = 45;

  // Fluency
  if (words.length <= 2) fluency = 35;
  else if (words.length <= 5) fluency = 55;
  else if (words.length <= 10) fluency = 72;
  else fluency = 84;

  // Grammar
  const hasCorrection =
    correction?.wrong &&
    correction?.correct &&
    correction.wrong.trim() !== correction.correct.trim();

  if (hasCorrection) grammar -= 18;
  grammar -= grammarNotes.length * 6;

  // Vocabulary
  vocab += uniqueWords.size * 3;
  vocab += vocabulary.length * 4;

  if (uniqueWords.size <= 2) vocab -= 12;
  if (words.length > 0 && uniqueWords.size / words.length < 0.45) vocab -= 8;

  return {
    fluency: clamp(fluency),
    grammar: clamp(grammar),
    vocabulary: clamp(vocab),
  };
}
