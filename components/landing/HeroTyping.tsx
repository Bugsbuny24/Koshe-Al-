"use client";

import { useEffect, useState } from "react";

const phrases = [
  "İngilizce konuş.",
  "Almanca pratiği yap.",
  "AI ile akıcı ol.",
  "Hatalarını anında düzelt.",
];

export default function HeroTyping() {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const speed = deleting ? 35 : 65;

    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, charIndex + 1);
        setText(next);
        setCharIndex((prev) => prev + 1);

        if (next === current) {
          setTimeout(() => setDeleting(true), 900);
        }
      } else {
        const next = current.slice(0, charIndex - 1);
        setText(next);
        setCharIndex((prev) => prev - 1);

        if (next.length === 0) {
          setDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, phraseIndex]);

  return (
    <div className="mt-4 text-lg font-medium text-cyan-300 sm:text-xl">
      <span>{text}</span>
      <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-cyan-300 align-middle" />
    </div>
  );
}
