import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, RotateCcw, FastForward, CheckCircle2, 
  ArrowRight, ShieldAlert, Sparkles, Layers, ListOrdered
} from 'lucide-react';

export default function TransportStepByStep({ steps, origins, destinations, costs, method }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        No hay pasos disponibles para este método.
      </div>
    );
  }

  const step = steps[currentStepIndex];
  const isVogel = method === 'VAM' || step.method === 'VAM';

  return (
    <div className="space-y-5">
      {/* Header and Step Navigator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-blue-600" />
            Procedimiento Paso a Paso: {isVogel ? 'Método de Vogel (VAM)' : 'Método del Costo Mínimo (MCM)'}
          </h3>
          <p className="text-xs text-slate-500">
            {isVogel
              ? 'Cálculo de penalizaciones por fila y columna, selección del máximo y asignación de unidades.'
              : 'Selección de la celda no tachada de costo mínimo y asignación de recursos.'}
          </p>
        </div>

        {/* Navigation Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
            title="Paso Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold font-mono px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-800">
            Paso {currentStepIndex + 1} de {steps.length}
          </span>

          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1))}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
            title="Siguiente Paso"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStepIndex(steps.length - 1)}
            className="px-2.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
            title="Ir al resultado final"
          >
            Ver Final
          </button>
        </div>
      </div>

      {/* Step Explanation Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-extrabold text-xs shadow-sm">
              Iteración #{step.iteration}
            </span>
            <span className="text-xs font-bold text-blue-900">
              Asignación: {step.originName} ➔ {step.destinationName}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-white/80 px-2.5 py-1 rounded-md border border-blue-200">
            Cantidad: {step.allocatedQty} unid. @ ${step.unitCost} = ${step.subtotalCost}
          </span>
        </div>

        <p className="text-sm font-medium text-slate-800 leading-relaxed">
          {step.description}
        </p>

        {/* Before vs After status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
            <span className="text-slate-500 font-semibold block mb-0.5">Estado Oferta ({step.originName}):</span>
            <div className="font-mono text-slate-800">
              Oferta antes: <strong className="text-blue-900">{step.remSupplyBefore}</strong> ➔ Asignados:{' '}
              <strong className="text-rose-600">-{step.allocatedQty}</strong> ➔ Queda:{' '}
              <strong className="text-emerald-700">{step.remSupplyBefore - step.allocatedQty}</strong>
              {step.rowStruck && (
                <span className="ml-2 px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">
                  (Fila Tachada)
                </span>
              )}
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
            <span className="text-slate-500 font-semibold block mb-0.5">Estado Demanda ({step.destinationName}):</span>
            <div className="font-mono text-slate-800">
              Demanda antes: <strong className="text-blue-900">{step.remDemandBefore}</strong> ➔ Satisfechos:{' '}
              <strong className="text-rose-600">-{step.allocatedQty}</strong> ➔ Queda:{' '}
              <strong className="text-emerald-700">{step.remDemandBefore - step.allocatedQty}</strong>
              {step.colStruck && (
                <span className="ml-2 px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">
                  (Columna Tachada)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* If Vogel: Display Penalties by Row and Column (User's specific requirement!) */}
      {isVogel && step.rowPenalties && step.colPenalties && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Row Penalties Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 px-4 py-2.5 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider">
                Penalizaciones por Fila (Oferta)
              </span>
              <span className="text-[10px] text-slate-400">
                (Diferencia 2 menores costos)
              </span>
            </div>
            <div className="p-3">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                    <th className="pb-1.5">Origen / Fila</th>
                    <th className="pb-1.5">Detalle Operación</th>
                    <th className="pb-1.5 text-center">Penalización</th>
                    <th className="pb-1.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {origins.map((orig, i) => {
                    const pen = step.rowPenalties[i];
                    const isChosen = step.chosenType === 'row' && step.chosenIndex === i;
                    const isStruck = pen === null;

                    return (
                      <tr
                        key={i}
                        className={`transition ${
                          isChosen
                            ? 'bg-amber-100/70 font-bold text-amber-950'
                            : isStruck
                            ? 'bg-slate-50 text-slate-400 line-through'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 font-bold font-sans">{orig}</td>
                        <td className="py-2 text-[11px] text-slate-600">
                          {step.rowDetails?.[i] || '-'}
                        </td>
                        <td className="py-2 text-center text-sm font-extrabold">
                          {pen !== null ? pen : '-'}
                        </td>
                        <td className="py-2 text-center">
                          {isChosen ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                              Máxima ★
                            </span>
                          ) : isStruck ? (
                            <span className="text-[10px] text-slate-400">Agotada</span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-semibold">Activa</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column Penalties Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 px-4 py-2.5 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider">
                Penalizaciones por Columna (Demanda)
              </span>
              <span className="text-[10px] text-slate-400">
                (Diferencia 2 menores costos)
              </span>
            </div>
            <div className="p-3">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                    <th className="pb-1.5">Destino / Columna</th>
                    <th className="pb-1.5">Detalle Operación</th>
                    <th className="pb-1.5 text-center">Penalización</th>
                    <th className="pb-1.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {destinations.map((dest, j) => {
                    const pen = step.colPenalties[j];
                    const isChosen = step.chosenType === 'col' && step.chosenIndex === j;
                    const isStruck = pen === null;

                    return (
                      <tr
                        key={j}
                        className={`transition ${
                          isChosen
                            ? 'bg-amber-100/70 font-bold text-amber-950'
                            : isStruck
                            ? 'bg-slate-50 text-slate-400 line-through'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 font-bold font-sans">{dest}</td>
                        <td className="py-2 text-[11px] text-slate-600">
                          {step.colDetails?.[j] || '-'}
                        </td>
                        <td className="py-2 text-center text-sm font-extrabold">
                          {pen !== null ? pen : '-'}
                        </td>
                        <td className="py-2 text-center">
                          {isChosen ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                              Máxima ★
                            </span>
                          ) : isStruck ? (
                            <span className="text-[10px] text-slate-400">Satisfecha</span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-semibold">Activa</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Matrix Snapshot at this step */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Estado del Cuadro en este paso:
        </div>
        <div className="overflow-x-auto border border-slate-300 rounded-lg">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300 text-left">Origen</th>
                {destinations.map((d, j) => (
                  <th key={j} className="p-2 border-r border-slate-300">
                    {d}
                  </th>
                ))}
                <th className="p-2 bg-amber-50">Oferta Restante</th>
              </tr>
            </thead>
            <tbody>
              {origins.map((orig, i) => {
                const remS = step.remSupplyAfter ? step.remSupplyAfter[i] : '-';
                const isRowExhausted = remS === 0;

                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-200 ${
                      isRowExhausted ? 'bg-slate-50 opacity-80' : ''
                    }`}
                  >
                    <td className="p-2 font-bold text-left border-r border-slate-300 bg-slate-50">
                      {orig}
                    </td>
                    {destinations.map((dest, j) => {
                      const cost = costs[i][j];
                      const currentAlloc = step.allocationsSnapshot?.[i]?.[j] || 0;
                      const isCurrentCell =
                        step.chosenI === i && step.chosenJ === j;

                      return (
                        <td
                          key={j}
                          className={`p-2 border-r border-slate-200 relative h-16 ${
                            isCurrentCell
                              ? 'bg-amber-100 ring-2 ring-amber-500 font-bold'
                              : currentAlloc > 0
                              ? 'bg-blue-50'
                              : ''
                          }`}
                        >
                          <span className="absolute top-1 left-1 text-[10px] font-mono text-slate-500 border border-slate-300 px-1 rounded bg-white">
                            {cost}
                          </span>
                          {currentAlloc > 0 && (
                            <span className="font-mono font-bold text-sm text-blue-900 block mt-2">
                              {currentAlloc}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2 font-mono font-bold bg-amber-50 text-slate-900">
                      {remS}
                    </td>
                  </tr>
                );
              })}
              {/* Demand footer */}
              <tr className="bg-amber-50 font-bold border-t border-slate-300">
                <td className="p-2 text-left border-r border-slate-300">Demanda Restante</td>
                {destinations.map((d, j) => {
                  const remD = step.remDemandAfter ? step.remDemandAfter[j] : '-';
                  return (
                    <td key={j} className="p-2 border-r border-slate-300 font-mono">
                      {remD}
                    </td>
                  );
                })}
                <td className="p-2 font-mono">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
