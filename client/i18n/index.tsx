import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import en from "./en";
import te from "./te";
import hi from "./hi";

export type Lang = "en" | "te" | "hi";

type Dict = typeof en;

interface I18nContextValue {
  t: (key: keyof Dict) => string;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const DICTS: Record<Lang, Dict> = { en, te, hi };
const I18N_KEY = "app.lang";

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(I18N_KEY) as Lang | null) : null;
    return stored === "en" || stored === "te" || stored === "hi" ? stored : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(I18N_KEY, l);
  };

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTS[lang];
    return {
      t: (key) => dict[key],
      lang,
      setLang,
    };
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang === "te" ? "te" : lang === "hi" ? "hi" : "en";
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
