export type KosheiDifficulty = "easier" | "same" | "harder";

export type MemoryItem = {
  errorType: "grammar" | "vocab" | "tense" | "preposition" | "pronunciation";
  wrongSentence: string;
  correctSentence: string;
  explanation: string;
};

export type SpeakingScore = {
  fluency: number;
  grammar: number;
  vocabulary: number;
};

export type TeacherEngineResponse = {
  teacherReply: string;
  correction: string;
  grammarNotes: string[];
  nextAction: string;
  nextQuestion: string;
  difficulty: KosheiDifficulty;
  speakingScore?: SpeakingScore;
  memoryItems: MemoryItem[];
};
export type SpeakingScore = {
  fluency: number;
  grammar: number;
  vocabulary: number;
};

export type TeacherEngineResponse = {
  correction: {
    wrong: string;
    correct: string;
    explanation: string;
  };
  grammarNotes: string[];
  vocabulary: string[];
  nextQuestion: string;
  nextAction: string;
  difficulty: string;
  speakingScore?: SpeakingScore;
};
