# ⚖️ LegalAID — AI Legal Assistant for Tribal & Rural Communities

> **India's first multilingual AI legal platform built for tribal and rural communities in Telangana & Andhra Pradesh.**
> Powered by Gemini 1.5 Flash · Supabase pgvector · RAG pipeline · Web Speech API

---

## What is LegalAID?

LegalAID is a full-stack AI-powered legal assistance platform that makes Indian law accessible to the 500M+ rural citizens who lack access to lawyers. Users can ask legal questions in **Telugu, Hindi, or English** by typing or speaking, receive structured answers with exact law citations (e.g. *"Under Section 3(1)(a) of the Forest Rights Act, 2006..."*), submit grievances with tracked case numbers, and generate print-ready legal documents — all for free.

**Built to showcase to:** Legal tech companies · Compliance firms · NGOs · Government departments · Big Tech partnerships (Anthropic/Infosys, Google for India, Microsoft AI for Good)

---

## Key Features

| Feature | Technology | Details |
|---|---|---|
| 🤖 **AI Legal Chat** | Gemini 1.5 Flash + RAG | Structured responses with exact section citations from 20 Indian legal documents |
| 🎤 **Voice Input** | Web Speech API | Speak in Telugu, Hindi, or English — transcript fills the chat input |
| 🔊 **Text-to-Speech** | Web Speech API | AI responses read aloud in the user's selected language |
| 📋 **Document Templates** | Print-to-PDF | RTI Application, FIR Complaint to SP, Forest Rights Claim (FRA), Collector Grievance |
| 📁 **Case Tracking** | Supabase PostgreSQL | Grievances stored with `CAS-YEAR-XXXXXX` case numbers, tracked per session |
| 🏛️ **DLSA Locator** | Supabase DB | 48 District Legal Services Authority offices across Telangana & AP |
| 🌐 **Multilingual** | i18n provider | Full EN / TE / HI UI with AI responses in the selected language |
| 📚 **RAG Pipeline** | pgvector (768-dim) | Gemini text-embedding-004 embeds 20 legal chunks; cosine similarity retrieval |

---

## Indian Laws Covered (RAG Corpus — 20 chunks)

- Forest Rights Act, 2006 (FRA) — eligibility + step-by-step claim process
- PESA Act, 1996 — Gram Sabha powers in Scheduled Areas
- SC/ST Prevention of Atrocities Act, 1989 (+ 2015 Amendment)
- Right to Information Act, 2005 — RTI filing + appeal process
- Land Acquisition Act, 2013 — compensation and rehabilitation rights
- Code of Criminal Procedure, 1973 — FIR filing, police duties
- MGNREGA, 2005 — 100-day employment rights + wage dispute process
- Protection of Women from Domestic Violence Act, 2005
- AP Land Transfer Regulation (1/70 LTR) — tribal land alienation void
- Hindu Succession Act (2005 Amendment) — daughters' equal property rights
- Gram Sabha rights (PESA + FRA) — meeting rules, powers
- District Legal Services Authority — who qualifies for free legal aid
- Caste certificate application process (TS + AP)
- Pension schemes — Aasara (Telangana) + Jagananna (AP)
- Child Rights — RTE Act, POCSO Act, scholarships

---

## Tech Stack

```
client/                 React 18 + TypeScript + Tailwind CSS + shadcn/ui
server/                 Express.js v5 + TypeScript
AI/ML                   Google Gemini 1.5 Flash (chat) + text-embedding-004 (RAG)
Database                Supabase (PostgreSQL + pgvector extension)
RAG Pipeline            768-dim embeddings → cosine similarity → top-3 chunk injection
Voice                   Web Speech API (SpeechRecognition + SpeechSynthesis)
Package manager         pnpm
Build                   Vite (client) + tsc (server)
```

---

## Architecture

```
User (browser)
    │
    ├─ Voice Input (SpeechRecognition) ──► Chat Input
    │
    ├─ POST /api/legal-ai
    │       │
    │       ├─ embedText(query) ─────────► Gemini text-embedding-004
    │       ├─ pgvector cosine search ──► Supabase legal_documents
    │       ├─ top-3 chunks injected into system prompt
    │       └─ Gemini 1.5 Flash generates structured response
    │               └─ bold citations + numbered steps + DLSA reference
    │
    ├─ POST /api/cases ─────────────────► Supabase cases table (CAS-YEAR-XXXXXX)
    │
    └─ GET  /api/legal-aid-centers ─────► Supabase legal_aid_centers (48 DLSA offices)
```

---

## Setup

### Prerequisites
- Node.js 20+, pnpm
- Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))
- Supabase project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/gurusaiss/legal_AID.git
cd legal_AID
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SEED_SECRET=any_random_string_eg_seed_xyz789
PORT=3000
```

### 3. Set up Supabase database

Run the migration in Supabase SQL editor:
```sql
-- File: supabase/migrations/001_initial.sql
-- Creates: cases, legal_documents (pgvector), legal_aid_centers tables
```

### 4. Start the dev server

```bash
pnpm dev
```

### 5. Seed the RAG corpus (one-time)

In a second terminal:
```bash
node scripts/seed-corpus.mjs
```

This embeds all 20 legal documents via Gemini and stores them in Supabase pgvector (~45 seconds).

### 6. Open the app

```
http://localhost:5173
```

---

## Demo Flow (for presentations)

1. **Home** — hero banner, impact stats (12 laws · 3 languages · 48 DLSA districts · 100% free)
2. **Switch language to Telugu** (top-right translate button)
3. **AI Chat** → click mic → speak *"అటవీ హక్కుల చట్టం గురించి చెప్పండి"* → structured Telugu response with `Section 3(1)(a) of the Forest Rights Act, 2006` citation
4. **Click speaker icon** → AI reads answer aloud in Telugu
5. **Submit Grievance** → receive `CAS-2026-XXXXXX` tracking number
6. **Document Templates** → fill RTI application → "Print / Save as PDF" → professional legal letter
7. **DLSA Locator** → find free legal aid office by district

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (client + server) |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `node scripts/seed-corpus.mjs` | Seed RAG corpus (run once after credentials are set) |
| `node scripts/seed-corpus.mjs --force` | Re-seed (wipes and re-embeds all documents) |

---

## License

MIT — Free to use, modify, and deploy. Built as a portfolio/social impact project.

---

*For legal advice, consult a qualified advocate or contact your District Legal Services Authority (DLSA). National Legal Services Helpline: **15100** (toll-free, all India).*
