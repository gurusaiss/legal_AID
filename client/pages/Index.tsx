import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export default function Index() {
  const nav = useNavigate();
  const { setLang, t } = useI18n();

  const select = (l: "en" | "te" | "hi") => {
    setLang(l);
    // Fallback navigate in case Link default is prevented by platform
    nav("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 text-center">
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">{t("welcome_title")}</div>
          <p className="mt-2 text-sm text-slate-500">{t("choose_language")}</p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full h-12 text-base" onClick={() => select("en")}>
            <Link to="/home">{t("english")}</Link>
          </Button>
          <Button asChild className="w-full h-12 text-base" variant="secondary" onClick={() => select("te")}>
            <Link to="/home">{t("telugu")}</Link>
          </Button>
          <Button asChild className="w-full h-12 text-base" variant="outline" onClick={() => select("hi")}>
            <Link to="/home">{t("hindi")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
