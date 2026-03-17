export type SupportedSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: {
    results: ArrayLike<{
      isFinal?: boolean;
      0?: { transcript?: string };
      length?: number;
    }>;
  }) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SupportedSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function getSpeechRecognitionConstructor():
  | SpeechRecognitionConstructor
  | null {
  if (typeof window === "undefined") return null;

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function browserSupportsSpeechRecognition() {
  return !!getSpeechRecognitionConstructor();
}

export function browserSupportsSpeechSynthesis() {
  return (
    typeof window !== "undefined" &&
    typeof window.speechSynthesis !== "undefined"
  );
}

export function stopSpeaking() {
  if (!browserSupportsSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}

export async function speakText(params: {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}) {
  const {
    text,
    lang = "en-US",
    rate = 1,
    pitch = 1,
    volume = 1,
  } = params;

  if (!browserSupportsSpeechSynthesis()) return;
  if (!text.trim()) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  const voices = window.speechSynthesis.getVoices();

  const exactVoice =
    voices.find(
      (voice) => voice.lang?.toLowerCase() === lang.toLowerCase()
    ) || null;

  const partialVoice =
    voices.find((voice) =>
      voice.lang?.toLowerCase().startsWith(lang.split("-")[0].toLowerCase())
    ) || null;

  const selectedVoice = exactVoice || partialVoice;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  await new Promise<void>((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function createRecognition(params: {
  lang: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
  onFinalText: (text: string) => void;
}) {
  const RecognitionClass = getSpeechRecognitionConstructor();

  if (!RecognitionClass) {
    throw new Error("Speech recognition is not supported in this browser.");
  }

  const recognition = new RecognitionClass();

  recognition.lang = params.lang;
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    params.onStart?.();
  };

  recognition.onend = () => {
    params.onEnd?.();
  };

  recognition.onerror = (event) => {
    params.onError?.(event?.error || "speech_recognition_error");
  };

  recognition.onresult = (event) => {
    let mergedText = "";

    for (let i = 0; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result?.[0]?.transcript || "";
      mergedText += ` ${transcript}`;
    }

    const finalText = mergedText.trim();

    if (finalText) {
      params.onFinalText(finalText);
    }
  };

  return recognition;
                                 }
