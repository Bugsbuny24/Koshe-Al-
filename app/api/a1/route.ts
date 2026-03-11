import { NextResponse } from "next/server";
import { alphabetLessons } from "@/lib/lesson/alphabet";

export async function GET() {
  const random = alphabetLessons[Math.floor(Math.random() * alphabetLessons.length)];

  return NextResponse.json({
    stage: "A1",
    letter: random.letter,
    sound: random.sound,
    word: random.word,
    instruction: `This is the letter ${random.letter}. Repeat the sound ${random.sound}. Example word: ${random.word}.`
  });
}
