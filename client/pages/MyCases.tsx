import Layout from "@/components/Layout";
import { useI18n } from "@/i18n";
import { useCases } from "@/state/cases";

export default function MyCases() {
  const { t } = useI18n();
  const { cases } = useCases();
  const sample = [
    { id: "LA-2025-001", issueType: t("land_dispute"), description: "Encroachment on family patta land in Vanthala village.", submissionDate: new Date().toLocaleDateString(), status: t("under_investigation") },
    { id: "LA-2025-002", issueType: t("forest_rights"), description: "Request for forest land cultivation certificate.", submissionDate: new Date().toLocaleDateString(), status: t("in_review") },
  ];
  const items = [...cases, ...sample];
  return (
    <Layout>
      <div className="mx-auto max-w-4xl overflow-x-auto rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="mb-4 text-xl font-bold">{t("my_cases")}</h1>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">{t("case_id") || "Case ID"}</th>
              <th className="py-2 pr-4">{t("issue_type")}</th>
              <th className="py-2 pr-4">{t("description")}</th>
              <th className="py-2 pr-4">{t("submission_date") || "Submission Date"}</th>
              <th className="py-2 pr-0">{t("status") || "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="py-3 pr-4 font-mono text-xs">{it.id}</td>
                <td className="py-3 pr-4">{it.issueType}</td>
                <td className="py-3 pr-4 max-w-[360px] truncate" title={it.description}>{it.description}</td>
                <td className="py-3 pr-4">{it.submissionDate}</td>
                <td className="py-3 pr-0">{it.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
