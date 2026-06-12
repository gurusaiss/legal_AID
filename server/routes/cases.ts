import { RequestHandler } from "express";
import { getSupabase } from "../lib/supabase";

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
  const supabase = getSupabase();

  if (!supabase) {
    // No Supabase — return a locally-generated case number so the client can still track it
    res.json({ caseNumber, offline: true, message: "Case recorded (database not configured)" });
    return;
  }

  const { data, error } = await supabase
    .from("cases")
    .insert({
      case_number: caseNumber,
      session_id: sessionId || null,
      name: name.trim(),
      category: issueType.trim(),
      district: district?.trim() || null,
      description: description.trim(),
      status: "submitted",
      language_submitted: language || "en",
    })
    .select("id, case_number")
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    // Fall back gracefully — return locally-generated number
    res.json({ caseNumber, offline: true, message: "Case recorded (DB write failed)" });
    return;
  }

  // Record initial status entry (non-fatal if this fails — response already committed)
  const { error: updateErr } = await supabase.from("case_updates").insert({
    case_id: data.id,
    update_text: "Case submitted. Our team will review it shortly.",
    updated_by: "system",
  });
  if (updateErr) {
    console.error("case_updates insert failed for case", data.id, updateErr.message);
  }

  res.json({ caseNumber: data.case_number, id: data.id });
};

export const handleGetCases: RequestHandler = async (req, res) => {
  const { sessionId } = req.query;
  const supabase = getSupabase();

  if (!supabase || !sessionId) {
    res.json({ cases: [] });
    return;
  }

  const { data, error } = await supabase
    .from("cases")
    .select("id, case_number, category, district, description, status, language_submitted, created_at, updated_at")
    .eq("session_id", String(sessionId))
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Supabase select error:", error);
    res.json({ cases: [] });
    return;
  }

  res.json({ cases: data ?? [] });
};
