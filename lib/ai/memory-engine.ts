import type { MemoryItem } from "@/lib/ai/types";

type RecentMistakeRow = {
  wrong_sentence: string | null;
  correct_sentence: string | null;
  explanation: string | null;
};

export function formatRecentMistakesForPrompt(
  mistakes: RecentMistakeRow[] | null | undefined
): string[] {
  if (!mistakes || mistakes.length === 0) return [];

  return mistakes
    .map((item) => {
      const wrong = item.wrong_sentence?.trim();
      const correct = item.correct_sentence?.trim();
      const explanation = item.explanation?.trim();

      if (!wrong || !correct) return null;

      if (explanation) {
        return `${wrong} → ${correct} (${explanation})`;
      }

      return `${wrong} → ${correct}`;
    })
    .filter(Boolean) as string[];
}

export function shouldCreateFallbackMemory(params: {
  userMessage: string;
  correction: string;
}) {
  const wrong = params.userMessage.trim().toLowerCase();
  const correct = params.correction.trim().toLowerCase();

  if (!wrong || !correct) return false;
  return wrong !== correct;
}

export function createFallbackMemoryItem(params: {
  userMessage: string;
  correction: string;
  grammarNotes?: string[];
}): MemoryItem {
  return {
    errorType: "grammar",
    wrongSentence: params.userMessage.trim(),
    correctSentence: params.correction.trim(),
    explanation:
      params.grammarNotes?.[0]?.trim() || "Cümle daha doğal hale getirildi.",
  };
}

export function normalizeVocabularyWords(words: string[] | null | undefined) {
  if (!words || words.length === 0) return [];

  const seen = new Set<string>();

  return words
    .map((word) => word.trim())
    .filter(Boolean)
    .filter((word) => {
      const key = word.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
