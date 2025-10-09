import Layout from "@/components/Layout";

export default function OfflineForms() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold">Offline Forms</h1>
        <ul className="list-disc pl-6 text-sm text-slate-700 space-y-2">
          <li>Form K – Declaration by Tribal Vendee</li>
          <li>Form L – Permission for Registration by ITDA</li>
          <li>Inspection Report Template</li>
          <li>Check Memo Format</li>
          <li>PESA Resolution Template (తెలుగు)</li>
        </ul>
        <div className="text-xs text-slate-500">Downloads coming soon. Use References page for sources.</div>
      </div>
    </Layout>
  );
}
