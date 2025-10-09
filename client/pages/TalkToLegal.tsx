import { useState } from 'react';
import Layout from "@/components/Layout";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { LegalAIChat } from "@/components/LegalAIChat";
import { LegalAidCenters } from "@/components/LegalAidCenters";
import { Phone, MessageSquare, MapPin, ArrowLeft } from 'lucide-react';

type View = 'main' | 'ai-chat' | 'legal-aid';

export default function TalkToLegal() {
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<View>('main');

  const handleBookCall = () => {
    // This would typically open a calendar or booking system
    window.open('https://calendly.com/your-legal-aid/consultation', '_blank');
  };

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
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{t("talk_to_legal")}</h1>
          <p className="text-slate-600">Get the legal support you need through our various assistance options.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div 
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleBookCall}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Book a Call</h3>
            <p className="text-sm text-slate-600 mb-4">Schedule a consultation with a legal volunteer</p>
            <Button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Schedule Now
            </Button>
          </div>
          
          <div 
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setCurrentView('ai-chat')}
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Legal Assistant</h3>
            <p className="text-sm text-slate-600 mb-4">Get answers to general legal questions 24/7</p>
            <Button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Chat Now
            </Button>
          </div>
          
          <div 
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer md:col-span-2"
            onClick={() => setCurrentView('legal-aid')}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Find Legal Aid</h3>
            <p className="text-sm text-slate-600 mb-4">Locate the nearest legal aid centers and services</p>
            <Button className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Find Centers
            </Button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Need immediate assistance?</span> Call our toll-free helpline:
          </p>
          <a 
            href="tel:18008742425" 
            className="mt-2 inline-flex items-center text-lg font-semibold text-blue-700 hover:text-blue-900"
          >
            <Phone className="w-4 h-4 mr-2" />
            1-800-TRIBAL-HELP
          </a>
          <p className="mt-1 text-xs text-slate-500">Available 24/7 for urgent legal matters</p>
        </div>
      </div>
    </Layout>
  );
}
