import Layout from "@/components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-lg font-bold">Cases by Category</h2>
          <div className="text-sm text-slate-500">Chart coming soon.</div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-lg font-bold">Case Status Overview</h2>
          <div className="text-sm text-slate-500">Chart coming soon.</div>
        </div>
      </div>
    </Layout>
  );
}
