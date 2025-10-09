import { Link, NavLink } from "react-router-dom";
import TranslateButton from "@/components/TranslateButton";
import { useI18n } from "@/i18n";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/home" className="font-extrabold tracking-tight text-slate-900">
            <span className="mr-2">⚖️</span> {t("brand")}
          </Link>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <NavItem to="/home" label={t("home")} />
            <NavItem to="/knowledge-base" label={t("knowledge_base")} />
            <NavItem to="/submit-grievance" label={t("submit_grievance")} />
            <NavItem to="/my-cases" label={t("my_cases")} />
          </nav>
          <div className="flex items-center gap-2">
            <TranslateButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {t("brand")}
      </footer>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-1 transition-colors hover:bg-slate-100 ${isActive ? "bg-slate-100" : ""}`
      }
    >
      {label}
    </NavLink>
  );
}
