import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CaseItem = {
  id: string;            // case number, e.g. CAS-2026-123456
  name?: string;
  issueType: string;
  description: string;
  district?: string;
  submissionDate: string;
  status: string;
  source?: "api" | "local";
};

const LS_KEY = "cases.store.v1";
const SESSION_KEY = "legal_aid_session_id";

function getOrCreateSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

function loadFromStorage(): CaseItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CaseItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CaseItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

const CasesContext = createContext<{
  cases: CaseItem[];
  loading: boolean;
  addCase: (
    item: Omit<CaseItem, "id" | "source"> & { language?: string },
  ) => Promise<CaseItem>;
} | null>(null);

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<CaseItem[]>(() => {
    if (typeof window === "undefined") return [];
    return loadFromStorage();
  });
  const [loading, setLoading] = useState(false);

  // Sync to localStorage whenever cases change
  useEffect(() => {
    saveToStorage(cases);
  }, [cases]);

  // On mount, fetch any API-stored cases for this session and merge them in
  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    fetch(`/api/cases?sessionId=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data: { cases?: Array<{
        case_number: string;
        category: string;
        description: string;
        district?: string;
        status: string;
        created_at: string;
      }> }) => {
        if (!data.cases?.length) return;
        const apiItems: CaseItem[] = data.cases.map((c) => ({
          id: c.case_number,
          issueType: c.category,
          description: c.description,
          district: c.district,
          submissionDate: new Date(c.created_at).toLocaleDateString(),
          status: c.status,
          source: "api",
        }));
        setCases((prev) => {
          const existingIds = new Set(apiItems.map((c) => c.id));
          const localOnly = prev.filter((c) => !existingIds.has(c.id));
          const merged = [...apiItems, ...localOnly];
          saveToStorage(merged);
          return merged;
        });
      })
      .catch(() => {
        // API unavailable — localStorage cases remain
      });
  }, []);

  const addCase = useCallback(async (
    item: Omit<CaseItem, "id" | "source"> & { language?: string },
  ): Promise<CaseItem> => {
    const sessionId = getOrCreateSessionId();
    setLoading(true);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, sessionId }),
      });

      if (!res.ok) {
        // Server rejected the request (4xx/5xx) — parse its error and surface it
        // to the caller. Do NOT silently create a local fallback record here,
        // because the user would see a success toast for a case the server refused.
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Submission failed (${res.status})`);
      }

      const data = (await res.json()) as { caseNumber: string };
      const newItem: CaseItem = { ...item, id: data.caseNumber, source: "api" };
      setCases((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      // TypeError means the fetch itself failed (network unreachable / offline).
      // Fall back to local storage so the user can still submit without connectivity.
      // Any other error (server rejection) is re-thrown so the UI can display it.
      if (!(err instanceof TypeError)) {
        throw err;
      }
      const y = new Date().getFullYear();
      const n = Math.random().toString(36).slice(2, 6).toUpperCase();
      const fallbackItem: CaseItem = { ...item, id: `LA-${y}-${n}`, source: "local" };
      setCases((prev) => [fallbackItem, ...prev]);
      return fallbackItem;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ cases, loading, addCase }), [cases, loading, addCase]);
  return <CasesContext.Provider value={value}>{children}</CasesContext.Provider>;
}

export function useCases() {
  const ctx = useContext(CasesContext);
  if (!ctx) throw new Error("useCases must be used within CasesProvider");
  return ctx;
}
