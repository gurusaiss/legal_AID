import Layout from "@/components/Layout";
import { useI18n } from "@/i18n";
import { Search, ChevronDown } from "lucide-react";
import { topics as DATA } from "@/data/knowledge";
import { useMemo, useState } from "react";

export default function KnowledgeBase() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");

  const topics = useMemo(() => {
    return DATA.filter((tp) =>
      (tp.labels[lang] + tp.sections.flatMap((s) => s.bullets[lang]).join(" ")).toLowerCase().includes(q.toLowerCase()),
    );
  }, [q, lang]);

  return (
    <Layout>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center gap-3 rounded-xl border bg-slate-50 p-3">
          <Search className="text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((tp) => (
            <article key={tp.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-2 text-base font-semibold">{tp.labels[lang]}</h3>
              <div className="space-y-3">
                {tp.sections.map((sec, i) => (
                  <details key={i} className="group rounded-xl border bg-white p-3 open:shadow-soft">
                    <summary className="flex cursor-pointer list-none items-center justify-between">
                      <span className="font-medium">{sec.heading[lang]}</span>
                      <ChevronDown className="transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {sec.bullets[lang].map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                    {sec.source && (
                      <a className="mt-2 inline-block text-xs text-slate-500 underline" href={sec.source} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    )}
                  </details>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
