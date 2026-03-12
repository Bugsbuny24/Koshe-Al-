export type TeacherEngineResponse = {
  teacherReply: string;
  correction: string;
  grammarNotes: string[];
  nextAction: string;
  nextQuestion: string;
  difficulty: "easier" | "same" | "harder";
  speakingScore?: {
    fluency: number;
    grammar: number;
    vocabulary: number;
  };
  memoryItems: Array<{
    errorType: "grammar" | "vocab" | "tense" | "preposition" | "pronunciation";
    wrongSentence: string;
    correctSentence: string;
    explanation: string;
  }>;
};
