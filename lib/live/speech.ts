export type SupportedSpeechRecognition = SpeechRecognition & {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
};

type SpeechRecognitionConstructor = new () => SupportedSpeechRecognition;

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
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
  return typeof window !== "undefined" && "speechSynthesis" in window;
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
  const { text, lang = "en-US", rate = 1, pitch = 1, volume = 1 } = params;

  if (!browserSupportsSpeechSynthesis() || !text.trim()) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  const voices = window.speechSynthesis.getVoices();
  const matchingVoice =
    voices.find((voice) => voice.lang?.toLowerCase() === lang.toLowerCase()) ||
    voices.find((voice) =>
      voice.lang?.toLowerCase().startsWith(lang.split("-")[0].toLowerCase())
    );

  if (matchingVoice) {
    utterance.voice = matchingVoice;
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

  let finalTranscript = "";

  recognition.onstart = () => {
    params.onStart?.();
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimText = "";
    finalTranscript = "";

    for (let i = 0; i < event.results.length; i += 1) {
      const transcript = event.results[i][0]?.transcript || "";
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimText += transcript;
      }
    }

    const merged = `${finalTranscript} ${interimText}`.trim();
    if (merged) {
      params.onFinalText(merged);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    params.onError?.(event.error || "speech_recognition_error");
  };

  recognition.onend = () => {
    params.onEnd?.();
  };

  return recognition;
          }
