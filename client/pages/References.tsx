import Layout from "@/components/Layout";

export default function References() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold">Sources & Legal Documents</h1>
        <ul className="list-disc pl-6 text-sm text-slate-700 space-y-2">
          <li><a className="underline" href="https://restthecase.com/knowledge-bank/rules-for-buying-land-of-scheduled-caste" target="_blank" rel="noreferrer">RestTheCase – Rules for Buying SC/ST Land</a></li>
          <li><a className="underline" href="https://www.arfjournals.com/image/catalog/Journals%20Papers/Anthropo/2023/No%201%20(2023)/7_Ravindra.pdf" target="_blank" rel="noreferrer">ARF Journals – Ravindra (2023)</a></li>
          <li>PESA Resolution (Telugu)</li>
          <li>Form K & L – ITDA Permission Documents</li>
        </ul>
      </div>
    </Layout>
  );
}
