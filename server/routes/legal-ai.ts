import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleLegalAI: RequestHandler = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Initialize the Gemini API with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
  } catch (error) {
    console.error('Error in legal AI endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message 
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
