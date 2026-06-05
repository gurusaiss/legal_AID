import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleLegalAI: RequestHandler = async (req, res) => {
  try {
    const { message, history } = req.body;
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
          "This message is not legal advice—consult a qualified advocate for your situation.",
        history: [],
      });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a chat session
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
      systemInstruction: {
        role: "model",
        parts: [{
          text: "You are a helpful legal assistant that provides general legal information. " +
                "You cannot provide specific legal advice, but can explain legal concepts, " +
                "suggest general approaches, and help users understand their rights and options. " +
                "Always recommend consulting with a licensed attorney for specific legal matters."
        }]
      }
    });

    // Send the message and get the response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      response: text,
      history: await chat.getHistory()
    });
  } catch (error: unknown) {
    console.error("Error in legal AI endpoint:", error);
    const details = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      error: "Failed to process your request",
      details,
    });
  }
};

export const handleFindLegalAid: RequestHandler = async (req, res) => {
  // This is a mock implementation - in a real app, you'd integrate with a legal aid directory API
  const { location } = req.query;
  
  // Mock data - replace with actual API call in production
  const mockLegalAidCenters = [
    {
      name: "Legal Aid Society",
      address: "123 Justice St, City, State",
      phone: "+1 (555) 123-4567",
      distance: "2.5 miles away",
      services: ["Civil Legal Aid", "Housing", "Family Law"]
    },
    {
      name: "Pro Bono Legal Services",
      address: "456 Rights Ave, City, State",
      phone: "+1 (555) 987-6543",
      distance: "5.1 miles away",
      services: ["Immigration", "Employment", "Public Benefits"]
    }
  ];

  res.json({ 
    centers: mockLegalAidCenters,
    location: location || 'your area'
  });
};
