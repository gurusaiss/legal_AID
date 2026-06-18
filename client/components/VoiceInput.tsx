import { useState, useRef, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const LANG_BCP47: Record<string, string> = {
  te: "te-IN",
  hi: "hi-IN",
  en: "en-IN",
};

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  lang: string;
  disabled?: boolean;
}

export function VoiceInputButton({ onTranscript, lang, disabled }: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  const start = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input requires Chrome or Edge. Please switch to a supported browser.");
      return;
    }
    const rec = new SR();
    rec.lang = LANG_BCP47[lang] ?? "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const transcript: string = e.results[0][0].transcript;
      onTranscript(transcript);
    };
    recRef.current = rec;
    rec.start();
  }, [lang, onTranscript]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={disabled}
      onClick={listening ? stop : start}
      className={
        listening
          ? "animate-pulse border-red-400 bg-red-50 text-red-600 hover:bg-red-50"
          : "border-slate-300 hover:bg-slate-50"
      }
      title={listening ? "Tap to stop recording" : "Tap to speak your question"}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}

export function speakText(text: string, lang: string, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) return;
  const clean = text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[-*]\s+/gm, "");
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = LANG_BCP47[lang] ?? "en-IN";
  utterance.rate = 0.88;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
