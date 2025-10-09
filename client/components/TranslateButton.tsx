import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export default function TranslateButton() {
  const { lang, setLang } = useI18n();
  const next = lang === "en" ? "te" : lang === "te" ? "hi" : "en";
  const cycle = () => setLang(next);
  const title = next === "en" ? "Switch to English" : next === "te" ? "తెలుగుకి మార్చు" : "हिन्दी में बदलें";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="translate"
      onClick={cycle}
      className="rounded-full"
      title={title}
    >
      <Languages className="opacity-80" />
    </Button>
  );
}
