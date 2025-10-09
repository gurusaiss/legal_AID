import Layout from "@/components/Layout";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

export default function TalkToLegal() {
  const { t } = useI18n();
  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold">{t("talk_to_legal")}</h1>
        <p className="text-sm text-slate-600">Connect with legal officers or volunteers for case support.</p>
        <div className="flex flex-wrap gap-3">
          <Button>Book a Call with Legal Volunteer</Button>
          <Button variant="secondary">Chat with AI Legal Assistant</Button>
          <Button variant="outline">Find Nearest Legal Aid Center</Button>
        </div>
        <p className="text-xs text-slate-500">📞 Toll-Free Helpline: 1800-TRIBAL-HELP</p>
      </div>
    </Layout>
  );
}
