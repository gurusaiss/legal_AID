import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveRelevantChunks } from "../services/rag";
import { getDb } from "../lib/db";

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
      "You are LegalAID, an expert AI legal assistant for tribal and rural communities in Telangana and Andhra Pradesh.\n\n" +
      "RESPONSE FORMAT — always follow this structure:\n" +
      "1. **Direct answer** in 1-2 sentences\n" +
      "2. **Legal basis**: cite the exact section — e.g. 'Under **Section 3(1)(a) of the Forest Rights Act, 2006**...'\n" +
      "3. **Steps to take**: numbered list of practical actions\n" +
      "4. **Free help available**: mention DLSA and helpline **15100** (toll-free, all India)\n" +
      "5. *This is general legal information, not legal advice.* (disclaimer, last line only)\n\n" +
      "RULES:\n" +
      "- Use **bold** for act names, section numbers, and key terms\n" +
      "- Write full act name on first mention: 'Forest Rights Act, 2006' never just 'FRA'\n" +
      "- Use numbered lists for steps; bullet lists for options\n" +
      "- Keep responses under 350 words\n" +
      "- Use simple language (suitable for rural readers)\n" +
      "- Laws to cite as relevant: Forest Rights Act 2006, PESA Act 1996, SC/ST Prevention of Atrocities Act 1989, " +
      "Right to Information Act 2005, Right to Fair Compensation and Transparency in Land Acquisition Act 2013, " +
      "MGNREGA 2005, Protection of Women from Domestic Violence Act 2005, Indian Penal Code, Code of Criminal Procedure 1973";

    if (ragUsed) {
      systemText +=
        "\n\nRelevant Indian legal context retrieved from the database:\n" +
        "---\n" +
        chunks.join("\n\n---\n\n") +
        "\n---\n\n" +
        "Use this context to answer accurately. " +
        "If the answer is not in the provided context, say so and direct the user to DLSA or 15100.";
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
  const db = getDb();

  if (db) {
    try {
      const { rows } = await db.query("SELECT * FROM legal_aid_centers ORDER BY name");
      if (rows.length > 0) {
        res.json({ centers: rows, location: location || "your area", source: "database" });
        return;
      }
    } catch (err) {
      console.error("legal_aid_centers query error:", err);
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
