import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ArrowLeft, BookOpen, Volume2, VolumeX } from "lucide-react";
import { format } from "date-fns";
import { useI18n } from "@/i18n";
import { VoiceInputButton, speakText, stopSpeaking } from "@/components/VoiceInput";

interface Message {
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: Date;
  ragUsed?: boolean;
}

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  en: [
    "How do I claim forest rights under FRA 2006?",
    "What is PESA Act and how does it protect tribal areas?",
    "How to file a complaint under SC/ST Atrocities Act?",
    "How to get free legal aid from DLSA?",
  ],
  te: [
    "FRA 2006 కింద అటవీ హక్కులు ఎలా పొందాలి?",
    "PESA చట్టం ఏమిటి, గిరిజన ప్రాంతాలను ఎలా రక్షిస్తుంది?",
    "SC/ST అత్యాచారాల చట్టం కింద ఫిర్యాదు ఎలా చేయాలి?",
    "DLSA నుండి ఉచిత న్యాయ సహాయం ఎలా పొందాలి?",
  ],
  hi: [
    "FRA 2006 के तहत वन अधिकार कैसे प्राप्त करें?",
    "PESA अधिनियम क्या है और आदिवासी क्षेत्रों की रक्षा कैसे करता है?",
    "SC/ST अत्याचार अधिनियम के तहत शिकायत कैसे दर्ज करें?",
    "DLSA से मुफ्त कानूनी सहायता कैसे पाएं?",
  ],
};

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: "ul" | "ol" = "ul";

  const flush = () => {
    if (!listItems.length) return;
    const El = listType === "ol" ? "ol" : "ul";
    const cls =
      listType === "ol" ? "list-decimal pl-4 space-y-0.5" : "list-disc pl-4 space-y-0.5";
    elements.push(
      <El key={elements.length} className={cls}>
        {listItems}
      </El>,
    );
    listItems = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith("### ") || line.startsWith("## ")) {
      flush();
      elements.push(
        <p key={i} className="font-semibold text-slate-900 mt-2">
          {renderInline(line.replace(/^#+\s+/, ""))}
        </p>,
      );
    } else if (/^[-•]\s+/.test(line)) {
      listType = "ul";
      listItems.push(<li key={i}>{renderInline(line.replace(/^[-•]\s+/, ""))}</li>);
    } else if (/^\d+\.\s+/.test(line)) {
      listType = "ol";
      listItems.push(<li key={i}>{renderInline(line.replace(/^\d+\.\s+/, ""))}</li>);
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      elements.push(<p key={i}>{renderInline(line)}</p>);
    }
  });
  flush();

  return <div className="space-y-1 text-sm">{elements}</div>;
}

// ─── Chat component ───────────────────────────────────────────────────────────

export function LegalAIChat({ onBack }: { onBack: () => void }) {
  const { lang } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stop TTS when language changes
  useEffect(() => {
    stopSpeaking();
    setSpeakingIndex(null);
  }, [lang]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopSpeaking();
    setSpeakingIndex(null);

    const userMessage: Message = { role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/legal-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language: lang,
          history: messages
            .map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.text }],
            }))
            .slice(-10),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = (await res.json()) as { response: string; ragUsed?: boolean };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response,
          timestamp: new Date(),
          ragUsed: data.ragUsed,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I encountered an error. Please try again. For urgent help call **15100** (free, all India).",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, index: number) => {
    if (speakingIndex === index) {
      stopSpeaking();
      setSpeakingIndex(null);
      return;
    }
    setSpeakingIndex(index);
    speakText(text, lang, () => setSpeakingIndex(null));
  };

  const suggestions = SUGGESTED_QUESTIONS[lang] ?? SUGGESTED_QUESTIONS.en;

  const langLabel: Record<string, string> = { en: "EN", te: "TE", hi: "HI" };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700/60" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-base font-semibold">LegalAID Assistant</h2>
          <p className="text-xs text-blue-200">RAG-powered · Indian Law Database · {langLabel[lang] ?? "EN"}</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center text-slate-500 pt-4 pb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base">How can I help you today?</h3>
              <p className="text-sm mt-1">
                Ask about your rights under Indian law — in Telugu, Hindi, or English.
                <br />
                <span className="text-xs text-blue-600 font-medium">🎤 Use the mic to speak your question</span>
              </p>
            </div>
            <div className="grid gap-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                  AI
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm">{message.text}</p>
                ) : (
                  <MessageContent text={message.text} />
                )}

                <div
                  className={`flex items-center gap-2 mt-2 text-xs ${
                    message.role === "user" ? "text-blue-100 justify-end" : "text-slate-400"
                  }`}
                >
                  <span>{format(message.timestamp, "h:mm a")}</span>
                  {message.ragUsed && (
                    <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                      <BookOpen className="w-3 h-3" /> Law sources used
                    </span>
                  )}
                  {message.role === "assistant" && (
                    <button
                      onClick={() => handleSpeak(message.text, index)}
                      className="ml-auto hover:text-slate-700 transition-colors"
                      title={speakingIndex === index ? "Stop speaking" : "Read aloud"}
                    >
                      {speakingIndex === index ? (
                        <VolumeX className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0">
              AI
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-sm flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              Searching Indian legal database…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <VoiceInputButton
            onTranscript={(t) => setInput(t)}
            lang={lang}
            disabled={isLoading}
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type or speak your legal question…"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          General legal information only — not legal advice. Free aid:{" "}
          <a href="tel:15100" className="text-blue-600 underline font-medium">15100</a>
        </p>
      </div>
    </div>
  );
}
