import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import KnowledgeBase from "./pages/KnowledgeBase";
import SubmitGrievance from "./pages/SubmitGrievance";
import MyCases from "./pages/MyCases";
import { I18nProvider } from "@/i18n";
import { CasesProvider } from "@/state/cases";
import TalkToLegal from "./pages/TalkToLegal";
import OfflineForms from "./pages/OfflineForms";
import References from "./pages/References";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <I18nProvider>
        <CasesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/submit-grievance" element={<SubmitGrievance />} />
              <Route path="/my-cases" element={<MyCases />} />
              <Route path="/talk-to-legal" element={<TalkToLegal />} />
              <Route path="/offline-forms" element={<OfflineForms />} />
              <Route path="/references" element={<References />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CasesProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
