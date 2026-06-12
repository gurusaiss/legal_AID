import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveRelevantChunks } from "../services/rag";
import { getSupabase } from "../lib/supabase";

const LANG_INSTRUCTIONS: Record<string, string> = {
  te: "Respond in Telugu (తెలుగు). Use simple, clear language that a rural user can understand. Explain legal terms in Telugu.",
  hi: "Respond in Hindi (हिंदी). Use simple, clear language that a rural user can understand. Explain legal terms in Hindi.",
  en: "Respond in clear, simple English. Avoid legal jargon; explain any technical terms you use.",
};

export const handleLegalAI: RequestHandler = async (req, res) => {
  try {
    const { message, history, language } = req.body;
    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) {
      res.json({
        response:
          "Preview mode: add GEMINI_API_KEY to a `.env` file in the project root to enable live AI answers. " +
          "You can still use the Knowledge Base and other tools. " +
          "This message is not legal advice — consult a qualified advocate for your situation.",
        history: [],
        ragUsed: false,
      });
      return;
    }

    // RAG: retrieve relevant Indian legal document chunks
    const lang = (language as string) || "en";
    const chunks = await retrieveRelevantChunks(message, apiKey);
    const ragUsed = chunks.length > 0;

    // Build system instruction
    let systemText =
      "You are LegalAID, an AI legal assistant specialising in Indian law for tribal and rural communities " +
      "in Telangana and Andhra Pradesh. You provide accurate general legal information about Indian laws " +
      "including the Forest Rights Act 2006, PESA Act 1996, SC/ST Prevention of Atrocities Act, " +
      "Right to Information Act, Land Acquisition Act, MGNREGA, and Domestic Violence Act. " +
      "Always recommend consulting the District Legal Services Authority (DLSA) or a licensed advocate " +
      "for their specific situation. The National Legal Services Helpline is 15100 (toll-free).";

    if (ragUsed) {
      systemText +=
        "\n\nRelevant Indian legal context retrieved for this question:\n" +
        "---\n" +
        chunks.join("\n\n---\n\n") +
        "\n---\n\n" +
        "Use this legal context to answer accurately. Cite the law name and section when relevant. " +
        "If the answer is not in the provided context, say so clearly and suggest the user contact DLSA.";
    }

    systemText +=
      "\n\n" + (LANG_INSTRUCTIONS[lang] ?? LANG_INSTRUCTIONS.en);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1200 },
      systemInstruction: {
        role: "model",
        parts: [{ text: systemText }],
      },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.json({
      response: text,
      history: await chat.getHistory(),
      ragUsed,
      sourcesUsed: chunks.length,
    });
  } catch (error: unknown) {
    console.error("Error in legal AI endpoint:", error);
    const details = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: "Failed to process your request", details });
  }
};

export const handleFindLegalAid: RequestHandler = async (req, res) => {
  const { location } = req.query;

  // Try to fetch from DB first
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("legal_aid_centers")
      .select("*")
      .order("name");

    if (!error && data && data.length > 0) {
      res.json({ centers: data, location: location || "your area", source: "database" });
      return;
    }
  }

  // Static fallback (shown when DB not configured)
  res.json({
    centers: [
      {
        name: "DLSA Hyderabad",
        address: "District Court Complex, Nampally, Hyderabad - 500001",
        phone: "040-23232323",
        district: "Hyderabad",
        state: "Telangana",
        services: ["Free Legal Aid", "Lok Adalat", "SC/ST Cases"],
        type: "DLSA",
      },
      {
        name: "DLSA Warangal",
        address: "District Courts Complex, Warangal - 506370",
        phone: "0870-2420201",
        district: "Hanumakonda",
        state: "Telangana",
        services: ["Free Legal Aid", "Tribal Rights", "Land Disputes"],
        type: "DLSA",
      },
    ],
    location: location || "your area",
    source: "fallback",
  });
};
