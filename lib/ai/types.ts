export type ChatMessageRole = "system" | "user" | "assistant";

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

export type LessonResponse = {
  lessonTitle: string;
  explanation: string;
  exampleSentence: string;
  practiceTask: string;
  conversationQuestion: string;
};

export type ConversationTurn = {
  role: ChatMessageRole;
  content: string;
  createdAt?: string;
};

export type AIUsageRecord = {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost?: number;
};

export type UserLearningProfile = {
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
  goal: string;
};

export type VocabMemoryItem = {
  word: string;
  meaning?: string;
  strength?: number;
  lastSeen?: string;
};

export type LearningMemoryRecord
