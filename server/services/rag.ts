import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDb } from "../lib/db";

/** Generate a 768-dim embedding vector for the given text using Gemini. */
export async function embedText(text: string, apiKey: string): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "models/text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Embed a user query and retrieve the top-k most similar legal document chunks
 * from Neon pgvector. Returns formatted strings ready to inject into a prompt.
 * Returns an empty array if the database is not configured or the query fails.
 */
export async function retrieveRelevantChunks(
  query: string,
  apiKey: string,
  limit = 3,
): Promise<string[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const embedding = await embedText(query, apiKey);
    const vectorLiteral = `[${embedding.join(",")}]`;

    const { rows } = await db.query<{
      title: string;
      content: string;
      category: string;
      source: string | null;
      similarity: number;
    }>(
      `SELECT title, content, category, source,
              1 - (embedding <=> $1::vector) AS similarity
       FROM legal_documents
       WHERE 1 - (embedding <=> $1::vector) > $2
       ORDER BY similarity DESC
       LIMIT $3`,
      [vectorLiteral, 0.5, limit],
    );

    if (!rows.length) return [];

    return rows.map(
      (doc) =>
        `[${doc.title} | ${doc.category}${doc.source ? " | Source: " + doc.source : ""}]\n${doc.content}`,
    );
  } catch (err) {
    console.error("RAG retrieval error:", err);
    return [];
  }
}
