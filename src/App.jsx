import React, { useState } from 'react';
import Header from './components/Header';
import PertCpmModule from './components/PertCpmModule';
import TransportModule from './components/TransportModule';
import TheoryGuide from './components/TheoryGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState('pert'); // 'pert' | 'transport' | 'theory'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'pert' && <PertCpmModule />}
        {activeTab === 'transport' && <TransportModule />}
        {activeTab === 'theory' && <TheoryGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bold text-slate-200">
              Investigación de Operaciones — Plataforma de Métodos Cuantitativos
            </p>
            <p className="text-slate-500 mt-0.5">
              Institución Universitaria Pascual Bravo · Medellín, Colombia
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              Vite + React + Tailwind
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              ● Vercel Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
