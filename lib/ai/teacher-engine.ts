import type { TeacherEngineResponse } from "@/lib/ai/types";

export type KosheiMode =
  | "foundation"
  | "lesson"
  | "practice"
  | "conversation";

export type TeacherEngineInput = {
  targetLanguage: string;
  nativeLanguage: string;
  level: string;
  mode: KosheiMode;
  topic: string;
  currentQuestion?: string;
  userAnswer?: string;
  contextSummary?: string;
  recentMessages?: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
};

function getModeInstructions(mode: KosheiMode) {
  if (mode === "foundation") {
    return `
Mode: FOUNDATION
- Student may know nothing
- Use extremely short instructions
- Teach first, then ask for repetition
- Keep everything simple
- Do not overwhelm
`;
  }

  if (mode === "lesson") {
    return `
Mode: LESSON
- Teach one small concept
- Ask for a short answer
- Keep structure clear
`;
  }

  if (mode === "practice") {
    return `
Mode: PRACTICE
- Let the student answer more freely
- Correct briefly
- Push fluency slightly
`;
  }

  return `
Mode: CONVERSATION
- Keep conversation natural
- Still act like a teacher
- Correct briefly and continue
`;
}

function getLevelInstructions(level: string, targetLanguage: string) {
  switch (level) {
    case "A1":
      return `
Level A1
- Start from zero
- Alphabet, sounds, tiny phrases
- Example tasks:
  - Repeat this word
  - Say: My name is...
- Use very simple ${targetLanguage}
`;
    case "A2":
      return `
Level A2
- Short words and short phrases
- Controlled simple output
`;
    case "B1":
      return `
Level B1
- Short sentences
- Simple descriptions
`;
    case "B2":
      return `
Level B2
- Daily speaking
- 1 to 3 sentence answers
`;
    case "C1":
      return `
Level C1
- Guided natural speaking
- More complete answers
`;
    case "C2":
      return `
Level C2
- Advanced fluency
- Better nuance and structure
`;
    case "D1":
      return `
Level D1
- Real conversation
- Back and forth dialogue
`;
    case "D2":
      return `
Level D2
- Near-native flow
- Natural longer answers
`;
    default:
      return `
Level A1
- Keep it simple
`;
  }
}

export function buildTeacherPrompt(input: TeacherEngineInput) {
  const {
    targetLanguage,
    nativeLanguage,
    level,
    mode,
    topic,
    currentQuestion,
    userAnswer,
    contextSummary,
    recentMessages = [],
  } = input;

  const recentConversation =
    recentMessages.length > 0
      ? recentMessages.map((m) => `${m.role}: ${m.content}`).join("\n")
      : "No recent messages.";

  const schemaExample: TeacherEngineResponse = {
    teacherReply: `Short teacher reaction in ${targetLanguage}`,
    correction: `Corrected sentence in ${targetLanguage}`,
    grammarNotes: [`Short note in ${nativeLanguage}`],
    nextAction: `Short next instruction in ${targetLanguage}`,
    nextQuestion: `Next question in ${targetLanguage}`,
    difficulty: "same",
    speakingScore: {
      fluency: 70,
      grammar: 70,
      vocabulary: 70,
    },
    memoryItems: [
      {
        errorType: "grammar",
        wrongSentence: "I go yesterday",
        correctSentence: "I went yesterday",
        explanation: "Past tense needed.",
      },
    ],
  };

  return `
You are Koshei AI.
You are NOT a chatbot.
You are an AI speaking teacher.

Student native language: ${nativeLanguage}
Target language: ${targetLanguage}
Student level: ${level}
Topic: ${topic}

${getModeInstructions(mode)}
${getLevelInstructions(level, targetLanguage)}

Current task:
${currentQuestion || "Start the lesson."}

Student answer:
${userAnswer || ""}

Conversation context:
${contextSummary || "No summary."}

Recent conversation:
${recentConversation}

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- teacherReply must be short
- correction must improve the student's answer
- grammarNotes must be short and useful
- nextAction must be short
- nextQuestion must continue the lesson naturally
- difficulty must be one of: easier, same, harder
- speakingScore must always exist
- fluency, grammar, vocabulary must be integers between 1 and 100
- memoryItems can be empty, but must exist
- memoryItems should include only real mistakes worth remembering
- If the student is beginner, simplify strongly
- If the student is advanced, allow more natural conversation

Return EXACT JSON shape like this:
${JSON.stringify(schemaExample)}
`.trim();
}
