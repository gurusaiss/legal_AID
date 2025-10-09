import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type CaseItem = {
  id: string;
  issueType: string;
  description: string;
  submissionDate: string;
  status: string;
};

const KEY = "cases.store.v1";

const CasesContext = createContext<{
  cases: CaseItem[];
  addCase: (item: Omit<CaseItem, "id">) => CaseItem;
} | null>(null);

function generateId(prefix = "LA") {
  const ts = new Date();
  const y = ts.getFullYear();
  const n = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${y}-${n}`;
}

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<CaseItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as CaseItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(cases));
  }, [cases]);

  const addCase = (item: Omit<CaseItem, "id">) => {
    const newItem: CaseItem = { ...item, id: generateId() };
    setCases((prev) => [newItem, ...prev]);
    return newItem;
  };

  const value = useMemo(() => ({ cases, addCase }), [cases]);
  return <CasesContext.Provider value={value}>{children}</CasesContext.Provider>;
}

export function useCases() {
  const ctx = useContext(CasesContext);
  if (!ctx) throw new Error("useCases must be used within CasesProvider");
  return ctx;
}
