import React, { useState } from 'react';
import Header from './components/Header';
import PertCpmModule from './components/PertCpmModule';
import TransportModule from './components/TransportModule';
import TheoryGuide from './components/TheoryGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState('pert'); // 'pert' | 'transport' | 'theory'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'pert' && <PertCpmModule />}
        {activeTab === 'transport' && <TransportModule />}
        {activeTab === 'theory' && <TheoryGuide />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            Investigación de Operaciones · Institución Universitaria Pascual Bravo
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Optimización de Redes & Programación Lineal
          </div>
        </div>
      </footer>
    </div>
  );
}
