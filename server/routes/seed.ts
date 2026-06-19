import { RequestHandler } from "express";
import { getDb } from "../lib/db";
import { LEGAL_CORPUS } from "../data/legal-corpus";
import { embedText } from "../services/rag";

export const handleSeedCorpus: RequestHandler = async (req, res) => {
  // Auth guard — SEED_SECRET must be set and caller must supply matching header
  const secret = process.env.SEED_SECRET?.trim();
  if (!secret || req.headers["x-seed-secret"] !== secret) {
    res.status(401).json({
      error: !secret
        ? "SEED_SECRET is not configured. Set it in .env and pass it as X-Seed-Secret header."
        : "Invalid seed secret",
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    res.status(400).json({ error: "GEMINI_API_KEY not set" });
    return;
  }

  const db = getDb();
  if (!db) {
    res.status(400).json({ error: "DATABASE_URL not set" });
    return;
  }

  const force = req.query.force === "true";

  if (!force) {
    try {
      const { rows } = await db.query<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM legal_documents",
      );
      const count = parseInt(rows[0].count, 10);
      if (count > 0) {
        res.json({
          message: `Corpus already seeded (${count} documents). Pass ?force=true to re-seed.`,
          count,
        });
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: "Failed to check corpus status", details: msg });
      return;
    }
  }

  // Truncate before re-seeding
  try {
    await db.query("DELETE FROM legal_documents");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Failed to clear existing corpus", details: msg });
    return;
  }

  const results: { title: string; ok: boolean; error?: string }[] = [];

  for (let i = 0; i < LEGAL_CORPUS.length; i++) {
    const doc = LEGAL_CORPUS[i];
    try {
      console.log(`[seed] Embedding ${i + 1}/${LEGAL_CORPUS.length}: ${doc.title}`);
      const embedding = await embedText(doc.content, apiKey);
      const vectorLiteral = `[${embedding.join(",")}]`;

      await db.query(
        `INSERT INTO legal_documents
           (title, content, category, source, chunk_index, language, embedding)
         VALUES ($1, $2, $3, $4, $5, $6, $7::vector)`,
        [doc.title, doc.content, doc.category, doc.source, i, "en", vectorLiteral],
      );

      results.push({ title: doc.title, ok: true });

      // Brief pause to respect Gemini rate limits
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ title: doc.title, ok: false, error: msg });
    }
  }

  const succeeded = results.filter((r) => r.ok).length;
  res.json({
    message: `Seeded ${succeeded}/${LEGAL_CORPUS.length} documents`,
    results,
  });
};
