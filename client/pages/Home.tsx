import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpenCheck, FileText, MessageCircle, WifiOff } from "lucide-react";
import { useI18n } from "@/i18n";

export default function Home() {
  const { t } = useI18n();
  const actions = [
    { icon: BookOpenCheck, label: t("know_your"), to: "/knowledge-base" },
    { icon: FileText, label: t("submit_grievance"), to: "/submit-grievance" },
    { icon: MessageCircle, label: t("talk_to_legal"), to: "/talk-to-legal" },
    { icon: WifiOff, label: t("offline_forms"), to: "/offline-forms" },
  ] as const;

  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-lg font-bold text-slate-900">{t("home").toUpperCase()}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {actions.map(({ icon: Icon, label, to }) => (
              <Link key={label} to={to} className="group">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors group-hover:bg-slate-100">
                  <Icon className="text-slate-600" />
                  <span className="font-medium">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-lg font-bold text-slate-900">{t("knowledge_base").toUpperCase()}</h2>
          <div className="grid gap-3">
            {[t("land_rights"), t("forest_rights"), t("legal_schemes"), t("education")].map((x) => (
              <Link key={x} to="/knowledge-base">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100">{x}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-lg font-bold text-slate-900">{t("submit_grievance").toUpperCase()}</h2>
          <p className="text-sm text-slate-500 mb-3">{t("submit_grievance")}</p>
          <Link to="/submit-grievance">
            <Button>{t("submit")}</Button>
          </Link>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-lg font-bold text-slate-900">{t("my_cases").toUpperCase()}</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold">{t("land_dispute")}</div>
              <div className="text-xs text-slate-500">{t("under_investigation")}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold">{t("forest_rights")}</div>
              <div className="text-xs text-slate-500">{t("in_review")}</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
