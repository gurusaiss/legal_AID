import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleFindLegalAid, handleLegalAI } from "./routes/legal-ai";
import { handleSubmitCase, handleGetCases } from "./routes/cases";
import { handleSeedCorpus } from "./routes/seed";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/demo", handleDemo);

  // Legal AI (with RAG)
  app.post("/api/legal-ai", handleLegalAI);
  app.get("/api/find-legal-aid", handleFindLegalAid);

  // Cases (grievance management)
  app.post("/api/cases", handleSubmitCase);
  app.get("/api/cases", handleGetCases);

  // RAG corpus seeding — call once after DB setup (protected by X-Seed-Secret header)
  app.post("/api/seed-corpus", handleSeedCorpus);

  return app;
}
