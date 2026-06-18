import "./global.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import KnowledgeBase from "./pages/KnowledgeBase";
import SubmitGrievance from "./pages/SubmitGrievance";
import MyCases from "./pages/MyCases";
import { I18nProvider } from "./i18n";
import { CasesProvider } from "./state/cases";
import TalkToLegal from "./pages/TalkToLegal";
import OfflineForms from "./pages/OfflineForms";
import References from "./pages/References";
import Dashboard from "./pages/Dashboard";
import DocumentTemplates from "./pages/DocumentTemplates";

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-800">
      <p>Something went wrong:</p>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const App = () => (
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace('/')}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <I18nProvider>
            <CasesProvider>
              <Suspense fallback={<Loading />}>
                <BrowserRouter basename={process.env.BASE_URL || '/'}>
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
                    <Route path="/document-templates" element={<DocumentTemplates />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </BrowserRouter>
              </Suspense>
            </CasesProvider>
          </I18nProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Render the app
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(<App />);
