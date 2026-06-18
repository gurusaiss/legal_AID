import Layout from "@/components/Layout";
import { useCases } from "@/state/cases";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, Clock, AlertCircle, BarChart3, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  Submitted: { label: "Submitted", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Clock },
  submitted: { label: "Submitted", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Clock },
  "Under Investigation": { label: "Under Investigation", color: "text-amber-600 bg-amber-50 border-amber-200", icon: AlertCircle },
  "In Review": { label: "In Review", color: "text-purple-600 bg-purple-50 border-purple-200", icon: AlertCircle },
  Resolved: { label: "Resolved", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
};

export default function Dashboard() {
  const { cases } = useCases();

  // Aggregate by status
  const byStatus = cases.reduce<Record<string, number>>((acc, c) => {
    const key = c.status || "Submitted";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Aggregate by issue type (top 5)
  const byType = Object.entries(
    cases.reduce<Record<string, number>>((acc, c) => {
      acc[c.issueType] = (acc[c.issueType] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const apiCases = cases.filter((c) => c.source === "api").length;
  const localCases = cases.filter((c) => c.source === "local").length;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Case Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Overview of all submitted grievances</p>
          </div>
          <Link to="/submit-grievance">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <PlusCircle className="w-4 h-4" /> New Case
            </Button>
          </Link>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Cases", value: cases.length, color: "text-slate-700", bg: "bg-slate-50" },
            { label: "Submitted", value: (byStatus["Submitted"] || 0) + (byStatus["submitted"] || 0), color: "text-blue-700", bg: "bg-blue-50" },
            { label: "In Progress", value: (byStatus["Under Investigation"] || 0) + (byStatus["In Review"] || 0), color: "text-amber-700", bg: "bg-amber-50" },
            { label: "Resolved", value: byStatus["Resolved"] || 0, color: "text-green-700", bg: "bg-green-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`rounded-xl ${bg} border border-slate-200 p-4 text-center`}>
              <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
              <div className="text-sm text-slate-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {cases.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="font-semibold text-slate-800 text-lg mb-2">No cases yet</h2>
            <p className="text-slate-500 text-sm mb-6">
              Submit your first grievance to start tracking it here.
            </p>
            <Link to="/submit-grievance">
              <Button className="bg-blue-600 hover:bg-blue-700">Submit a Grievance</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cases by type */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <h2 className="font-bold text-slate-900 mb-4">Cases by Issue Type</h2>
              <div className="space-y-2">
                {byType.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className="flex-1 text-sm text-slate-700 truncate">{type}</div>
                    <div className="text-sm font-semibold text-slate-900 w-6 text-right">{count}</div>
                    <div className="w-24 bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 rounded-full h-1.5"
                        style={{ width: `${(count / cases.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage + recent */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="font-bold text-slate-900 mb-3">Storage</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Synced to database</span>
                    <span className="font-semibold text-green-700">{apiCases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Saved offline (local)</span>
                    <span className="font-semibold text-amber-700">{localCases}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="font-bold text-slate-900 mb-3">Recent Cases</h2>
                <div className="space-y-2">
                  {cases.slice(0, 3).map((c) => {
                    const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG["Submitted"];
                    const Icon = cfg.icon;
                    return (
                      <div key={c.id} className="flex items-start gap-2">
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color.split(" ")[0]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-700 truncate">{c.id}</div>
                          <div className="text-xs text-slate-500 truncate">{c.issueType}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link to="/my-cases" className="text-xs text-blue-600 hover:underline mt-3 block">
                  View all cases →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
