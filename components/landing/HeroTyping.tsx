"use client";

import { useEffect, useState } from "react";

const phrases = [
  "İngilizce konuş.",
  "AI ile pratik yap.",
  "Hatalarını anında düzelt.",
  "Daha akıcı konuş.",
];

export default function HeroTyping() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 35 : 70;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentPhrase.slice(0, charIndex + 1);
        setDisplayText(nextText);
        setCharIndex((prev) => prev + 1);

        if (nextText === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 900);
        }
      } else {
        const nextText = currentPhrase.slice(0, charIndex - 1);
        setDisplayText(nextText);
        setCharIndex((prev) => prev - 1);

        if (nextText.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <div className="mt-4 text-lg font-medium text-cyan-300 sm:text-xl">
      {displayText}
      <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-cyan-300 align-middle" />
    </div>
  );
}
