import { useState } from 'react';
import Layout from "@/components/Layout";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { LegalAIChat } from "@/components/LegalAIChat";
import { LegalAidCenters } from "@/components/LegalAidCenters";
import { Phone, MessageSquare, MapPin, Mic } from 'lucide-react';

type View = 'main' | 'ai-chat' | 'legal-aid';

export default function TalkToLegal() {
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<View>('main');

  if (currentView === 'ai-chat') {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl">
          <LegalAIChat onBack={() => setCurrentView('main')} />
        </div>
      </Layout>
    );
  }

  if (currentView === 'legal-aid') {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl">
          <LegalAidCenters onBack={() => setCurrentView('main')} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{t("talk_to_legal")}</h1>
          <p className="text-slate-500 text-sm">Choose how you want legal help — AI, helpline, or in-person.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* AI Chat */}
          <div
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            onClick={() => setCurrentView('ai-chat')}
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-1">AI Legal Assistant</h3>
            <p className="text-sm text-slate-500 mb-4">
              Ask any legal question in Telugu, Hindi, or English.
              Answers cite real Indian law sections. Voice input supported.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-4">
              <Mic className="w-3.5 h-3.5" /> Voice input · RAG-powered · Available 24/7
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Chat Now
            </Button>
          </div>

          {/* Find DLSA */}
          <div
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            onClick={() => setCurrentView('legal-aid')}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Find Legal Aid Center</h3>
            <p className="text-sm text-slate-500 mb-4">
              Locate the nearest District Legal Services Authority (DLSA) office.
              Free representation for SC/ST, women, and all tribal citizens.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium mb-4">
              <MapPin className="w-3.5 h-3.5" /> 48 districts · 100% free · No income test for SC/ST
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Find Centers
            </Button>
          </div>
        </div>

        {/* Helplines grid */}
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-blue-700" />
            <h3 className="font-semibold text-blue-900">Call a Helpline Directly</h3>
            <span className="ml-auto text-xs text-blue-600 font-medium">Toll-free · 24×7</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "National Legal Aid", number: "15100", desc: "NALSA — free lawyer" },
              { label: "Police Emergency", number: "100", desc: "Immediate danger" },
              { label: "Women's Helpline", number: "181", desc: "Mahila · domestic violence" },
              { label: "Childline", number: "1098", desc: "Child welfare" },
            ].map(({ label, number, desc }) => (
              <a
                key={number}
                href={`tel:${number}`}
                className="rounded-xl bg-white border border-blue-100 p-3 hover:shadow-md transition-shadow"
              >
                <div className="font-bold text-blue-700 text-xl leading-none">{number}</div>
                <div className="text-xs font-medium text-slate-800 mt-0.5">{label}</div>
                <div className="text-xs text-slate-400">{desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
