import { RequestHandler } from "express";
import { getDb } from "../lib/db";

function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(100000 + Math.random() * 900000);
  return `CAS-${year}-${n}`;
}

export const handleSubmitCase: RequestHandler = async (req, res) => {
  const { name, issueType, description, district, language, sessionId } = req.body;

  if (!name?.trim() || !issueType?.trim() || !description?.trim()) {
    res.status(400).json({ error: "name, issueType and description are required" });
    return;
  }

  const caseNumber = generateCaseNumber();
  const db = getDb();

  if (!db) {
    res.json({ caseNumber, offline: true, message: "Case recorded (database not configured)" });
    return;
  }

  try {
    const { rows } = await db.query<{ id: string; case_number: string }>(
      `INSERT INTO cases
         (case_number, session_id, name, category, district, description, status, language_submitted)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, case_number`,
      [
        caseNumber,
        sessionId || null,
        name.trim(),
        issueType.trim(),
        district?.trim() || null,
        description.trim(),
        "submitted",
        language || "en",
      ],
    );

    const newCase = rows[0];

    // Record initial status update (non-fatal if it fails)
    db.query(
      `INSERT INTO case_updates (case_id, update_text, updated_by) VALUES ($1, $2, $3)`,
      [newCase.id, "Case submitted. Our team will review it shortly.", "system"],
    ).catch((err: unknown) => {
      console.error("case_updates insert failed for case", newCase.id, err);
    });

    res.json({ caseNumber: newCase.case_number, id: newCase.id });
  } catch (error: unknown) {
    console.error("DB insert error:", error);
    res.json({ caseNumber, offline: true, message: "Case recorded (DB write failed)" });
  }
};

export const handleGetCases: RequestHandler = async (req, res) => {
  const { sessionId } = req.query;
  const db = getDb();

  if (!db || !sessionId) {
    res.json({ cases: [] });
    return;
  }

  try {
    const { rows } = await db.query(
      `SELECT id, case_number, category, district, description,
              status, language_submitted, created_at, updated_at
       FROM cases
       WHERE session_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [String(sessionId)],
    );
    res.json({ cases: rows });
  } catch (error: unknown) {
    console.error("DB select error:", error);
    res.json({ cases: [] });
  }
};
