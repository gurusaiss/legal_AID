import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  BookOpen,
  Mic,
  MapPin,
  Download,
  Phone,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useI18n } from "@/i18n";

const FEATURES = [
  {
    icon: MessageSquare,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "AI Legal Chat",
    desc: "Ask any legal question. Get answers grounded in real Indian law — FRA, PESA, RTI, SC/ST Act, and more.",
    to: "/talk-to-legal",
    badge: "RAG-powered",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Mic,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Voice Input & TTS",
    desc: "Speak your question in Telugu, Hindi, or English. Hear the AI answer read aloud — no typing needed.",
    to: "/talk-to-legal",
    badge: "Web Speech API",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    icon: FileText,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "Submit Grievance",
    desc: "File a case with your name and district. Receive a unique case number (CAS-YEAR-XXXXXX) to track status.",
    to: "/submit-grievance",
    badge: "Supabase DB",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    icon: Download,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Document Templates",
    desc: "Fill RTI applications, FIR complaints, Forest Rights claims, and Collector letters. Print as legal-grade PDF.",
    to: "/document-templates",
    badge: "Print to PDF",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    icon: MapPin,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "DLSA Locator",
    desc: "Find the District Legal Services Authority nearest to you. Free legal aid for every citizen — no fees.",
    to: "/talk-to-legal",
    badge: "48 Districts",
    badgeColor: "bg-rose-100 text-rose-700",
  },
  {
    icon: BookOpen,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    title: "Know Your Rights",
    desc: "Plain-language guides on FRA 2006, PESA, Land Acquisition, MGNREGA, and RTI Act in all 3 languages.",
    to: "/knowledge-base",
    badge: "12 Indian Laws",
    badgeColor: "bg-teal-100 text-teal-700",
  },
];

const STATS = [
  { num: "12+", label: "Indian Laws", sub: "Covered" },
  { num: "3", label: "Languages", sub: "EN · TE · HI" },
  { num: "48", label: "DLSA Districts", sub: "TS + AP" },
  { num: "100%", label: "Free", sub: "No hidden fees" },
];

const HELPLINES = [
  { label: "Legal Aid", number: "15100", color: "bg-blue-600", desc: "National Legal Services" },
  { label: "Police", number: "100", color: "bg-slate-700", desc: "Emergency" },
  { label: "Women", number: "181", color: "bg-pink-600", desc: "Mahila Helpline" },
  { label: "Childline", number: "1098", color: "bg-amber-600", desc: "Child Welfare" },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <Layout>
      <div className="space-y-6 pb-4">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
          {/* dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10 px-7 py-9 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium mb-5">
              <Shield className="w-3.5 h-3.5" />
              India's AI Legal Platform for Tribal & Rural Communities
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-3">
              Know Your Rights.
              <br className="hidden sm:block" />
              Get Help. <span className="text-blue-200">Free.</span>
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-md">
              AI-powered legal assistance in Telugu, Hindi & English — grounded in real Indian law.
              Built for tribal and rural communities across Telangana & Andhra Pradesh.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/talk-to-legal">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Ask AI Now
                </Button>
              </Link>
              <Link to="/submit-grievance">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Submit Grievance
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ num, label, sub }) => (
            <div
              key={label}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 text-center"
            >
              <div className="text-2xl font-extrabold text-blue-700">{num}</div>
              <div className="font-semibold text-slate-900 text-sm mt-0.5">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Feature cards ── */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">What LegalAID Can Do For You</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, iconBg, iconColor, title, desc, to, badge, badgeColor }) => (
              <Link key={title} to={to} className="group">
                <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex rounded-lg p-2.5 ${iconBg}`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 flex-1 leading-relaxed">{desc}</p>
                  <div className="flex items-center gap-1 text-blue-600 text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Emergency helplines ── */}
        <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-900">Emergency Legal Helplines</h3>
            <span className="ml-auto text-xs text-red-600 font-medium">Toll-free · 24×7</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HELPLINES.map(({ label, number, color, desc }) => (
              <a
                key={label}
                href={`tel:${number}`}
                className="rounded-xl bg-white border border-red-100 p-3 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white font-bold text-sm mb-2 ${color}`}
                >
                  {label[0]}
                </div>
                <div className="font-bold text-slate-900 text-lg leading-none">{number}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                <div className="text-[10px] text-slate-400">{desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Technology footer ── */}
        <div className="text-center py-1">
          <p className="text-xs text-slate-400">
            Powered by{" "}
            <span className="font-medium text-slate-500">Gemini 1.5 Flash</span>
            {" · "}
            <span className="font-medium text-slate-500">Supabase pgvector</span>
            {" · "}
            <span className="font-medium text-slate-500">RAG pipeline</span>
            {" · "}
            <span className="font-medium text-slate-500">Web Speech API</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {t("brand")} — Free legal assistance for every citizen. Not legal advice.
          </p>
        </div>
      </div>
    </Layout>
  );
}
