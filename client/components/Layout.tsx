import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import TranslateButton from "@/components/TranslateButton";
import { useI18n } from "@/i18n";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/knowledge-base", label: "Knowledge" },
  { to: "/submit-grievance", label: "Grievance" },
  { to: "/document-templates", label: "Documents" },
  { to: "/my-cases", label: "My Cases" },
  { to: "/talk-to-legal", label: "AI Chat" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/home" className="font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
            <span>⚖️</span> {t("brand")}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden gap-1 text-sm font-medium md:flex">
            {NAV_LINKS.map(({ to, label }) => (
              <NavItem key={to} to={to} label={label} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <TranslateButton />
            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded-md p-1.5 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {open && (
          <div className="md:hidden border-t bg-white shadow-lg">
            <nav className="container mx-auto flex flex-col py-2 px-4 gap-0.5">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 ${
                      isActive ? "bg-slate-100 text-blue-700" : "text-slate-700"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-6">{children}</main>

      <footer className="border-t py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {t("brand")} — Free legal AI for tribal &amp; rural communities</p>
        <p className="mt-1">
          National Legal Services Helpline:{" "}
          <a href="tel:15100" className="text-blue-600 underline font-medium">15100</a>
          {" "}· Women: <a href="tel:181" className="text-blue-600 underline">181</a>
          {" "}· Police: <a href="tel:100" className="text-blue-600 underline">100</a>
        </p>
      </footer>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-1 transition-colors hover:bg-slate-100 ${
          isActive ? "bg-slate-100 text-blue-700 font-semibold" : ""
        }`
      }
    >
      {label}
    </NavLink>
  );
}
