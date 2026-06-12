import Layout from "@/components/Layout";
import { useI18n } from "@/i18n";
import { useCases } from "@/state/cases";

const STATUS_STYLES: Record<string, string> = {
  submitted:      "bg-yellow-100 text-yellow-800",
  "Submitted":    "bg-yellow-100 text-yellow-800",
  acknowledged:   "bg-blue-100 text-blue-800",
  "in-progress":  "bg-purple-100 text-purple-800",
  "In Review":    "bg-purple-100 text-purple-800",
  resolved:       "bg-green-100 text-green-800",
  closed:         "bg-slate-100 text-slate-600",
  "Pending Review": "bg-yellow-100 text-yellow-800",
  "Under Investigation": "bg-orange-100 text-orange-800",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export default function MyCases() {
  const { t } = useI18n();
  const { cases, loading } = useCases();

  return (
    <Layout>
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("my_cases")}</h1>
          {loading && (
            <span className="text-xs text-slate-500">Syncing…</span>
          )}
        </div>

        {cases.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No cases yet</p>
            <p className="text-sm mt-1">
              Submit a grievance and it will appear here with a tracking number.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4 font-medium">Case ID</th>
                  <th className="py-2 pr-4 font-medium">{t("issue_type")}</th>
                  <th className="py-2 pr-4 font-medium hidden sm:table-cell">District</th>
                  <th className="py-2 pr-4 font-medium">{t("description")}</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-0 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((it) => (
                  <tr key={it.id} className="border-t hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs">{it.id}</span>
                      {it.source === "local" && (
                        <span className="ml-1 text-[10px] text-slate-400" title="Saved locally — will sync when online">
                          (local)
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{it.issueType}</td>
                    <td className="py-3 pr-4 text-slate-500 hidden sm:table-cell">
                      {it.district || "—"}
                    </td>
                    <td
                      className="py-3 pr-4 max-w-[260px] truncate text-slate-600"
                      title={it.description}
                    >
                      {it.description}
                    </td>
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                      {it.submissionDate}
                    </td>
                    <td className="py-3 pr-0">
                      <StatusBadge status={it.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          For case status updates call the National Legal Services Helpline:{" "}
          <a href="tel:15100" className="text-blue-600 underline">15100</a> (free)
        </p>
      </div>
    </Layout>
  );
}
