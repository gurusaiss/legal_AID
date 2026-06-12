-- LegalAID — initial schema
-- Run this in Supabase SQL Editor before starting the server

-- Enable pgvector for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ──────────────────────────────────────────────
-- Cases table
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  session_id TEXT,                    -- anonymous browser session identifier
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT,
  state TEXT DEFAULT 'Telangana',
  description TEXT NOT NULL,
  status TEXT DEFAULT 'submitted'
    CHECK (status IN ('submitted','acknowledged','in-progress','resolved','closed')),
  language_submitted TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_session ON cases (session_id);
CREATE INDEX IF NOT EXISTS idx_cases_status   ON cases (status);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ──────────────────────────────────────────────
-- Case updates / status history
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  update_text TEXT NOT NULL,
  status_change TEXT,
  updated_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_updates_case ON case_updates (case_id);

-- ──────────────────────────────────────────────
-- Legal documents + embeddings (RAG corpus)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  source TEXT,
  chunk_index INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  embedding vector(768),             -- Gemini text-embedding-004 dimension
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IVFFlat index for fast approximate nearest-neighbour cosine search
-- Requires at least one row before CREATE INDEX. Run after seeding.
-- CREATE INDEX IF NOT EXISTS idx_legal_docs_embedding
--   ON legal_documents USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 50);

-- RPC: cosine similarity search over legal documents
CREATE OR REPLACE FUNCTION match_legal_documents(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  category text,
  source text,
  similarity float
)
LANGUAGE sql STABLE AS $$
  SELECT
    id,
    title,
    content,
    category,
    source,
    1 - (embedding <=> query_embedding) AS similarity
  FROM legal_documents
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ──────────────────────────────────────────────
-- Legal aid centers directory
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_aid_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('DLSA','NGO','Pro-bono','Tribunal','Other')),
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Telangana',
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  services TEXT[],
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_centers_district ON legal_aid_centers (district);

-- ──────────────────────────────────────────────
-- Seed District Legal Services Authorities
-- Telangana + Andhra Pradesh
-- ──────────────────────────────────────────────
INSERT INTO legal_aid_centers (name, type, district, state, address, phone, services, lat, lng)
VALUES
  ('DLSA Hyderabad', 'DLSA', 'Hyderabad', 'Telangana',
   'District Court Complex, Nampally, Hyderabad - 500001',
   '040-23232323',
   ARRAY['Free Legal Aid','Lok Adalat','Mediation','SC/ST Cases'],
   17.3850, 78.4867),

  ('DLSA Warangal', 'DLSA', 'Hanumakonda', 'Telangana',
   'District Courts Complex, Warangal - 506370',
   '0870-2420201',
   ARRAY['Free Legal Aid','Lok Adalat','Tribal Rights','Land Disputes'],
   17.9689, 79.5941),

  ('DLSA Karimnagar', 'DLSA', 'Karimnagar', 'Telangana',
   'District Courts, Karimnagar - 505001',
   '0878-2242345',
   ARRAY['Free Legal Aid','Lok Adalat','Women Cases','SC/ST Cases'],
   18.4386, 79.1288),

  ('DLSA Adilabad', 'DLSA', 'Adilabad', 'Telangana',
   'District Court Complex, Adilabad - 504001',
   '08732-225566',
   ARRAY['Free Legal Aid','Forest Rights (FRA)','PESA Act','Tribal Land'],
   19.6641, 78.5320),

  ('DLSA Khammam', 'DLSA', 'Khammam', 'Telangana',
   'District Courts, Khammam - 507001',
   '08742-232323',
   ARRAY['Free Legal Aid','Lok Adalat','Forest Rights','SC/ST Atrocities'],
   17.2473, 80.1514),

  ('DLSA Nalgonda', 'DLSA', 'Nalgonda', 'Telangana',
   'District Court Complex, Nalgonda - 508001',
   '08682-222345',
   ARRAY['Free Legal Aid','Lok Adalat','Land Disputes','RTI Help'],
   17.0579, 79.2671),

  ('DLSA Nizamabad', 'DLSA', 'Nizamabad', 'Telangana',
   'District Courts, Nizamabad - 503001',
   '08462-223456',
   ARRAY['Free Legal Aid','Lok Adalat','Women and Children','Labour Cases'],
   18.6725, 78.0942),

  ('DLSA Visakhapatnam', 'DLSA', 'Visakhapatnam', 'Andhra Pradesh',
   'District Court Complex, Visakhapatnam - 530001',
   '0891-2564040',
   ARRAY['Free Legal Aid','Lok Adalat','Tribal Rights','Coastal Land'],
   17.6868, 83.2185),

  ('DLSA East Godavari', 'DLSA', 'East Godavari', 'Andhra Pradesh',
   'District Courts Complex, Rajamahendravaram - 533101',
   '0883-2430280',
   ARRAY['Free Legal Aid','Forest Rights','SC/ST Cases','Land Disputes'],
   17.0005, 81.8040),

  ('DLSA Srikakulam', 'DLSA', 'Srikakulam', 'Andhra Pradesh',
   'District Courts, Srikakulam - 532001',
   '08942-226801',
   ARRAY['Free Legal Aid','Tribal Rights','Labour Cases','Women Rights'],
   18.2949, 83.8938),

  ('Samatha (Tribal Land Rights NGO)', 'NGO', 'Visakhapatnam', 'Andhra Pradesh',
   '1-1-12, Adivasi Colony, Araku Valley Road, Visakhapatnam',
   '0891-2560100',
   ARRAY['Forest Rights (FRA)','PESA Act','Tribal Land Protection','RTI Filing'],
   17.7260, 83.3120),

  ('Human Rights Forum Hyderabad', 'NGO', 'Hyderabad', 'Telangana',
   '12-13-452, Street No. 1, Tarnaka, Hyderabad - 500017',
   '040-27015003',
   ARRAY['SC/ST Atrocities','Police Complaints','Human Rights','Legal Literacy'],
   17.4239, 78.5596)
ON CONFLICT DO NOTHING;
