import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ArrowLeft, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { useI18n } from "@/i18n";

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
    "How to get free legal aid in Telangana?",
  ],
  te: [
    "FRA 2006 కింద అటవీ హక్కులు ఎలా పొందాలి?",
    "PESA చట్టం ఏమిటి, గిరిజన ప్రాంతాలను ఎలా రక్షిస్తుంది?",
    "SC/ST అత్యాచారాల చట్టం కింద ఫిర్యాదు ఎలా చేయాలి?",
    "ఉచిత న్యాయ సహాయం ఎలా పొందాలి?",
  ],
  hi: [
    "FRA 2006 के तहत वन अधिकार कैसे प्राप्त करें?",
    "PESA अधिनियम क्या है और यह आदिवासी क्षेत्रों की रक्षा कैसे करता है?",
    "SC/ST अत्याचार अधिनियम के तहत शिकायत कैसे दर्ज करें?",
    "मुफ्त कानूनी सहायता कैसे पाएं?",
  ],
};

export function LegalAIChat({ onBack }: { onBack: () => void }) {
  const { lang } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

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
          text: "Sorry, I encountered an error. Please try again. For urgent help call 15100.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = SUGGESTED_QUESTIONS[lang] ?? SUGGESTED_QUESTIONS.en;

  return (
    <div className="flex flex-col h-[560px] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-blue-700"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">AI Legal Assistant</h2>
          <p className="text-xs text-blue-200">Powered by Indian legal database</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center text-slate-500 py-4">
              <h3 className="font-medium text-lg mb-1">How can I help you today?</h3>
              <p className="text-sm">Ask about your rights under Indian law.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left rounded-lg border bg-white p-3 text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-colors"
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
              <div
                className={`max-w-[82%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs ${
                    message.role === "user" ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  <span>{format(message.timestamp, "h:mm a")}</span>
                  {message.ragUsed && (
                    <span className="flex items-center gap-0.5 ml-1 text-emerald-600">
                      <BookOpen className="w-3 h-3" />
                      <span>Indian law sources</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-500 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Looking up Indian legal context…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your legal rights…"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          General legal information only — not legal advice. Call{" "}
          <a href="tel:15100" className="text-blue-600 underline">15100</a> for
          free legal aid.
        </p>
      </div>
    </div>
  );
}
