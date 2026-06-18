/**
 * LegalAID — RAG corpus seeding script
 *
 * Run once after setting up .env credentials:
 *   node scripts/seed-corpus.mjs
 *
 * Or force re-seed:
 *   node scripts/seed-corpus.mjs --force
 *
 * Requires in .env:
 *   GEMINI_API_KEY=...
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *   SEED_SECRET=...         (same value you set in .env)
 *   PORT=3000               (or whatever port your server runs on)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency needed)
const envPath = resolve(__dirname, "../.env");
let envContent = "";
try {
  envContent = readFileSync(envPath, "utf8");
} catch {
  console.error("❌  .env file not found at", envPath);
  process.exit(1);
}

const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
}

const SEED_SECRET = env.SEED_SECRET;
const PORT = env.PORT || "3000";
const FORCE = process.argv.includes("--force");

// Pre-flight checks
const missing = [];
if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY.includes("your_")) missing.push("GEMINI_API_KEY");
if (!env.SUPABASE_URL || env.SUPABASE_URL.includes("your-project")) missing.push("SUPABASE_URL");
if (!env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY.includes("your_")) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (!SEED_SECRET || SEED_SECRET === "change_me_to_something_random") missing.push("SEED_SECRET");

if (missing.length) {
  console.error("\n❌  Missing or placeholder credentials in .env:\n");
  for (const k of missing) {
    console.error(`   • ${k}`);
  }
  console.error("\n📋  Fill these in .env before running the seed.\n");
  console.error("   Get them from:");
  console.error("   • GEMINI_API_KEY  → https://aistudio.google.com/app/apikey");
  console.error("   • SUPABASE_URL + SERVICE_ROLE_KEY → https://supabase.com → Project Settings → API");
  console.error("   • SEED_SECRET     → set any random string, e.g. seed_abc123xyz\n");
  process.exit(1);
}

const BASE_URL = `http://localhost:${PORT}`;

console.log("\n🌱  LegalAID — Seeding RAG corpus\n");
console.log(`   Server: ${BASE_URL}`);
console.log(`   Force re-seed: ${FORCE}`);

async function ping() {
  try {
    const r = await fetch(`${BASE_URL}/api/ping`);
    return r.ok;
  } catch {
    return false;
  }
}

async function seed() {
  // Check server is up
  console.log("\n⏳  Checking server…");
  let attempts = 0;
  while (!(await ping())) {
    attempts++;
    if (attempts > 20) {
      console.error("\n❌  Server not responding at", BASE_URL);
      console.error("   Start it first:  pnpm dev  (in a separate terminal)");
      process.exit(1);
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log("\n✅  Server is up\n");

  // Call seed endpoint
  const url = `${BASE_URL}/api/seed-corpus${FORCE ? "?force=true" : ""}`;
  console.log(`⚡  Calling ${url}`);
  console.log("   (This embeds 20 legal documents via Gemini — takes ~45 seconds)\n");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-seed-secret": SEED_SECRET,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    console.error("❌  Seed endpoint error:", body.error || res.status);
    process.exit(1);
  }

  console.log("✅ ", body.message || "Done");

  if (body.results) {
    const ok = body.results.filter((r) => r.ok);
    const fail = body.results.filter((r) => !r.ok);
    console.log(`\n   Embedded: ${ok.length} documents`);
    if (fail.length) {
      console.warn(`   Failed:   ${fail.length}`);
      for (const f of fail) console.warn(`   ✗ ${f.title}: ${f.error}`);
    }
    console.log("\n🎉  RAG corpus is ready. The AI will now use real Indian legal sources.");
    console.log("   Test it: open the AI Chat and ask 'How do I claim forest rights?'\n");
  }
}

seed().catch((err) => {
  console.error("\n❌  Unexpected error:", err.message);
  process.exit(1);
});
