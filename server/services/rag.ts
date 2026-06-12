import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabase } from "../lib/supabase";

/** Generate a 768-dim embedding vector for the given text using Gemini. */
export async function embedText(text: string, apiKey: string): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "models/text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

interface DocChunk {
  title: string;
  content: string;
  category: string;
  source: string | null;
}

/**
 * Embed a user query and retrieve the top-k most similar legal document chunks
 * from Supabase pgvector. Returns formatted strings ready to inject into a prompt.
 * Returns an empty array if Supabase is not configured or query fails.
 */
export async function retrieveRelevantChunks(
  query: string,
  apiKey: string,
  limit = 3,
): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const embedding = await embedText(query, apiKey);

    const { data, error } = await supabase.rpc("match_legal_documents", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
    });

    if (error || !data || (data as DocChunk[]).length === 0) return [];

    return (data as DocChunk[]).map(
      (doc) =>
        `[${doc.title} | ${doc.category}${doc.source ? " | Source: " + doc.source : ""}]\n${doc.content}`,
    );
  } catch (err) {
    console.error("RAG retrieval error:", err);
    return [];
  }
}
