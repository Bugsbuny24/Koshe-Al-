export type Difficulty = "easier" | "same" | "harder";

export type ErrorType =
  | "grammar"
  | "vocab"
  | "tense"
  | "preposition"
  | "pronunciation";

export type SpeakingScore = {
  fluency: number;
  grammar: number;
  vocabulary: number;
};

export type MemoryItem = {
  errorType: ErrorType;
  wrongSentence: string;
  correctSentence: string;
  explanation: string;
};

export type TeacherEngineResponse = {
  teacherReply: string;
  correction: string;
  grammarNotes: string[];
  nextAction: string;
  nextQuestion: string;
  difficulty: Difficulty;
  vocabulary: string[];
  speakingScore?: SpeakingScore;
  memoryItems: MemoryItem[];
};

export type ChatRouteResponse = TeacherEngineResponse & {
  conversationId: string;
};
