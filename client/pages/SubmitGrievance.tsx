import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useCases } from "@/state/cases";
import { useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

const TELANGANA_DISTRICTS = [
  "Adilabad", "Asifabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad",
  "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy",
  "Karimnagar", "Khammam", "Kumurambheem Asifabad", "Mahabubabad", "Mahabubnagar",
  "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
  "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
  "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
  "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri",
];

const AP_DISTRICTS = [
  "Alluri Sitharama Raju", "Anakapalli", "Anantapur", "Annamayya",
  "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari",
  "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal",
  "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore",
  "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram",
  "West Godavari", "YSR Kadapa",
];

export default function SubmitGrievance() {
  const { t, lang } = useI18n();
  const { addCase, loading } = useCases();
  const nav = useNavigate();

  const [issueType, setIssueType] = useState("Land Rights");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("Telangana");
  const [district, setDistrict] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const districtList = state === "Andhra Pradesh" ? AP_DISTRICTS : TELANGANA_DISTRICTS;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value?.trim() || "";
    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    const files = Array.from(fileRef.current?.files || [])
      .map((f) => f.name)
      .join(", ");
    const desc = [description.trim(), files ? `Files: ${files}` : ""]
      .filter(Boolean)
      .join("\n");

    try {
      const created = await addCase({
        name,
        issueType,
        description: desc,
        district: district || undefined,
        submissionDate: new Date().toLocaleDateString(),
        status: "Submitted",
        language: lang,
      });
      toast.success(`✅ Case ${created.id} submitted. Track the status in My Cases.`);
      nav("/my-cases");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    }
  };

  return (
    <Layout>
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h1 className="text-xl font-bold">{t("submit_grievance")}</h1>

        {/* Name + Caste */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">{t("name")} *</label>
            <input
              ref={nameRef}
              required
              className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">
              {t("caste_optional") || "Caste / Community (optional)"}
            </label>
            <input className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300" />
          </div>
        </div>

        {/* State + District */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">State</label>
            <select
              value={state}
              onChange={(e) => { setState(e.target.value); setDistrict(""); }}
              className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option>Telangana</option>
              <option>Andhra Pradesh</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">— Select district —</option>
              {districtList.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Issue type */}
        <div className="space-y-1">
          <label className="text-sm font-medium">{t("issue_type")}</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option>Land Rights</option>
            <option>Forest Rights (FRA)</option>
            <option>PESA / Tribal Governance</option>
            <option>SC/ST Atrocity</option>
            <option>Domestic Violence</option>
            <option>MGNREGA / Wages</option>
            <option>RTI / Government Scheme</option>
            <option>Caste Certificate</option>
            <option>Child Rights / Education</option>
            <option>Encroachment</option>
            <option>Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium">{t("description")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe your issue in detail — what happened, where, when, who was involved…"
            className="w-full rounded-lg border bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* File upload */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            {t("upload_docs") || "Upload Supporting Documents (PDF / Images)"}
          </label>
          <input ref={fileRef} type="file" multiple className="block w-full text-sm" />
        </div>

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Submitting…" : t("submit")}
        </Button>

        <p className="text-xs text-slate-500">
          After submission you will receive a case number. Use it to track your
          case in "My Cases". Free legal aid is available at your District Legal
          Services Authority — call 15100.
        </p>
      </form>
    </Layout>
  );
}
