import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransportStepByStep({ steps, origins, destinations, costs, method }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No hay pasos disponibles para este método.
      </div>
    );
  }

  const step = steps[currentStepIndex];
  const isVogel = method === 'VAM' || step.method === 'VAM';

  return (
    <div className="space-y-4">
      {/* Step Navigator Header */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
        <div className="font-semibold text-slate-800">
          Iteración {step.iteration} de {steps.length} · {isVogel ? 'Método de Vogel' : 'Costo Mínimo'}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
            className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-500 px-2">
            {currentStepIndex + 1}/{steps.length}
          </span>
          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1))}
            className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Narrative Card */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">
            Asignación: {step.originName} ➔ {step.destinationName}
          </span>
          <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {step.allocatedQty} unid. @ ${step.unitCost} = ${step.subtotalCost}
          </span>
        </div>
        <p className="text-slate-600 leading-relaxed font-sans">{step.description}</p>
      </div>

      {/* Vogel Penalties Tables */}
      {isVogel && step.rowPenalties && step.colPenalties && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Row Penalties */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 space-y-2">
            <div className="font-semibold text-slate-800 pb-1.5 border-b border-slate-100 flex justify-between">
              <span>Penalizaciones por fila (Oferta)</span>
              <span className="text-slate-400 text-[11px]">Δ 2 menores</span>
            </div>
            <table className="w-full text-left font-mono">
              <tbody className="divide-y divide-slate-100">
                {origins.map((orig, i) => {
                  const pen = step.rowPenalties[i];
                  const isChosen = step.chosenType === 'row' && step.chosenIndex === i;

                  return (
                    <tr key={i} className={isChosen ? 'bg-slate-50 font-bold text-slate-900' : 'text-slate-600'}>
                      <td className="py-1.5 font-sans">{orig}</td>
                      <td className="py-1.5 text-right font-mono">
                        {pen !== null ? (
                          <span>
                            {pen}{' '}
                            {isChosen && <span className="ml-1 text-[10px] uppercase font-bold text-slate-900">★ Máx</span>}
                          </span>
                        ) : (
                          <span className="text-slate-300">Agotada</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Col Penalties */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 space-y-2">
            <div className="font-semibold text-slate-800 pb-1.5 border-b border-slate-100 flex justify-between">
              <span>Penalizaciones por columna (Demanda)</span>
              <span className="text-slate-400 text-[11px]">Δ 2 menores</span>
            </div>
            <table className="w-full text-left font-mono">
              <tbody className="divide-y divide-slate-100">
                {destinations.map((dest, j) => {
                  const pen = step.colPenalties[j];
                  const isChosen = step.chosenType === 'col' && step.chosenIndex === j;

                  return (
                    <tr key={j} className={isChosen ? 'bg-slate-50 font-bold text-slate-900' : 'text-slate-600'}>
                      <td className="py-1.5 font-sans">{dest}</td>
                      <td className="py-1.5 text-right font-mono">
                        {pen !== null ? (
                          <span>
                            {pen}{' '}
                            {isChosen && <span className="ml-1 text-[10px] uppercase font-bold text-slate-900">★ Máx</span>}
                          </span>
                        ) : (
                          <span className="text-slate-300">Satisfecha</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
