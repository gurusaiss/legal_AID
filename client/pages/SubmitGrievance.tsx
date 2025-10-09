import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useCases } from "@/state/cases";
import { useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function SubmitGrievance() {
  const { t } = useI18n();
  const { addCase } = useCases();
  const nav = useNavigate();
  const [issueType, setIssueType] = useState(t("land_rights"));
  const [description, setDescription] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const casteRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submissionDate = new Date().toLocaleDateString();
    const files = Array.from(fileRef.current?.files || []).map((f) => f.name).join(", ");
    const desc = [description, files ? `\nFiles: ${files}` : ""].filter(Boolean).join("\n");
    const created = addCase({
      issueType,
      description: desc,
      submissionDate,
      status: t("pending_review") || "Pending Review",
    });
    toast.success("✅ Your grievance has been recorded successfully. It now appears in 'My Cases'.");
    nav("/my-cases");
  };

  return (
    <Layout>
      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold">{t("submit_grievance")}</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("name")}</label>
            <input ref={nameRef} required className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("caste_optional") || "Caste / Community (optional)"}</label>
            <input ref={casteRef} className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("issue_type")}</label>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300">
            <option>{t("land_rights")}</option>
            <option>{t("forest_rights")}</option>
            <option>Encroachment</option>
            <option>Caste Certificate</option>
            <option>Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("description")}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("upload_docs") || "Upload Supporting Documents (PDF / Images)"}</label>
          <input ref={fileRef} type="file" multiple className="block w-full text-sm" />
        </div>
        <Button type="submit" className="mt-2">{t("submit")}</Button>
      </form>
    </Layout>
  );
}
