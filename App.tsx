import React, { useState } from 'react';
import { IncidentForm } from './components/IncidentForm';
import { ActionPlan } from './components/ActionPlan';
import { DocumentGenerator } from './components/DocumentGenerator';
import { LegalBasis } from './components/LegalBasis';
import { IncidentData, AnalysisResult, RiskLevel } from './types';
import { analyzeIncident } from './services/incidentProcessor';
import { Scale, AlertTriangle, FileText, ArrowLeft, ShieldCheck, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [incidentData, setIncidentData] = useState<IncidentData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'guia' | 'docs' | 'legal'>('guia');
  const [isLoading, setIsLoading] = useState(false);

  const handleIncidentSubmit = async (data: IncidentData) => {
    setIsLoading(true);
    try {
      const result = await analyzeIncident(data);
      setIncidentData(data);
      setAnalysis(result);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`No se pudo completar el análisis: ${errorMessage}\n\nPor favor verifica tu conexión o intenta nuevamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIncidentData(null);
    setAnalysis(null);
    setActiveTab('guia');
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.ALTO: return 'bg-red-100 text-red-700 border-red-200';
      case RiskLevel.MEDIO: return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="min-h-screen pb-12 relative">
      {/* Header */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Scale size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">EduLegal</h1>
              <p className="text-[10px] text-green-600 font-medium tracking-wide">ASISTENTE SEV / LEY 303</p>
            </div>
          </div>
          {incidentData && !isLoading && (
            <button 
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-green-700 font-medium flex items-center gap-1"
            >
              <ArrowLeft size={16} /> Nuevo Reporte
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-full shadow-sm border border-green-100">
                <Loader2 size={48} className="text-green-600 animate-spin" />
              </div>
            </div>
            <h3 className="mt-8 text-xl font-bold text-slate-800">Analizando Incidente...</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md">
              Consultando Protocolos SEV, Ley 303 y Ley General de NNA para determinar la ruta de actuación más segura.
            </p>
          </div>
        ) : !incidentData || !analysis ? (
          /* Intake View */
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-green-800 text-xs font-bold mb-4">
                <Sparkles size={12} /> IMPULSADO POR IA JURÍDICA
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Reporte de Incidente Escolar</h2>
              <p className="text-slate-600">Completa el formulario para recibir un análisis legal inteligente y la documentación oficial basada en los protocolos vigentes de Veracruz.</p>
            </div>
            <IncidentForm onSubmit={handleIncidentSubmit} />
          </div>
        ) : (
          /* Results Dashboard */
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Classification Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Diagnóstico IA</p>
                <h2 className="text-2xl font-bold text-slate-800">{analysis.classification}</h2>
              </div>
              
              <div className={`px-5 py-3 rounded-xl border ${getRiskColor(analysis.riskLevel)} flex items-center gap-3`}>
                <AlertTriangle size={24} />
                <div>
                  <p className="text-xs font-bold uppercase opacity-80">Nivel de Riesgo</p>
                  <p className="text-lg font-bold">{analysis.riskLevel}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('guia')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'guia' ? 'bg-white text-green-700 border-x border-t border-slate-200 shadow-sm relative top-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <ShieldCheck size={18} /> Guía de Actuación
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'docs' ? 'bg-white text-green-700 border-x border-t border-slate-200 shadow-sm relative top-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <FileText size={18} /> Documentos Legales
              </button>
              <button 
                onClick={() => setActiveTab('legal')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-colors whitespace-nowrap ${activeTab === 'legal' ? 'bg-white text-green-700 border-x border-t border-slate-200 shadow-sm relative top-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <Scale size={18} /> Fundamento
              </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
              {activeTab === 'guia' && <ActionPlan analysis={analysis} />}
              {activeTab === 'docs' && <DocumentGenerator data={incidentData} analysis={analysis} />}
              {activeTab === 'legal' && <LegalBasis analysis={analysis} />}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;