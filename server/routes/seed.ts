import { RequestHandler } from "express";
import { getSupabase } from "../lib/supabase";
import { LEGAL_CORPUS } from "../data/legal-corpus";
import { embedText } from "../services/rag";

export const handleSeedCorpus: RequestHandler = async (req, res) => {
  // Guard: SEED_SECRET must be set AND the caller must supply the matching header.
  // If the env var is absent the endpoint is locked — "absent = open" would be a
  // security hole that lets anyone wipe the corpus.
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

  const supabase = getSupabase();
  if (!supabase) {
    res.status(400).json({ error: "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set" });
    return;
  }

  const force = req.query.force === "true";

  if (!force) {
    const { count, error: countErr } = await supabase
      .from("legal_documents")
      .select("*", { count: "exact", head: true });
    if (countErr) {
      res.status(500).json({ error: "Failed to check corpus status", details: countErr.message });
      return;
    }
    if (count && count > 0) {
      res.json({ message: `Corpus already seeded (${count} documents). Pass ?force=true to re-seed.`, count });
      return;
    }
  }

  // Truncate before re-seeding
  const { error: deleteErr } = await supabase
    .from("legal_documents")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteErr) {
    res.status(500).json({ error: "Failed to clear existing corpus", details: deleteErr.message });
    return;
  }

  const results: { title: string; ok: boolean; error?: string }[] = [];

  for (let i = 0; i < LEGAL_CORPUS.length; i++) {
    const doc = LEGAL_CORPUS[i];
    try {
      console.log(`[seed] Embedding ${i + 1}/${LEGAL_CORPUS.length}: ${doc.title}`);
      const embedding = await embedText(doc.content, apiKey);

      const { error } = await supabase.from("legal_documents").insert({
        title: doc.title,
        content: doc.content,
        category: doc.category,
        source: doc.source,
        chunk_index: i,
        language: "en",
        embedding,
      });

      results.push({ title: doc.title, ok: !error, error: error?.message });

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
