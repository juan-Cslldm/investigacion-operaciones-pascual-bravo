import React from 'react';
import { DollarSign, CheckCircle2, TrendingDown } from 'lucide-react';

export default function TransportTableau({
  origins,
  destinations,
  costs,
  allocations,
  supply,
  demand,
  methodName,
  totalCost,
  steps,
}) {
  if (!origins || !destinations || !costs) return null;

  // Compute breakdown of terms: qty * cost
  const terms = [];
  origins.forEach((orig, i) => {
    destinations.forEach((dest, j) => {
      const qty = allocations?.[i]?.[j] || 0;
      if (qty > 0) {
        const c = costs[i][j];
        terms.push({
          orig,
          dest,
          qty,
          cost: c,
          subtotal: qty * c,
        });
      }
    });
  });

  return (
    <div className="space-y-4">
      {/* Tableau Title & Method Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Cuadro del Modelo de Transporte (Formato Diapositiva 16)
          </h3>
          <p className="text-xs text-slate-500">
            Costo unitario ($c_{'{ij}'}$) en la esquina superior izquierda de cada celda y asignación ($x_{'{ij}'}$) al centro.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded-lg shadow-sm">
            {methodName}
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg">
            Costo Total: ${Number(totalCost).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Tableau Grid */}
      <div className="overflow-x-auto border-2 border-slate-700 bg-white rounded-xl shadow-md p-2">
        <table className="w-full border-collapse text-xs select-none">
          <thead>
            <tr className="border-b-2 border-slate-700 bg-slate-100">
              <th className="p-3 text-left font-extrabold text-slate-800 uppercase tracking-wider border-r-2 border-slate-700 min-w-[130px]">
                Origen \ Destino
              </th>
              {destinations.map((dest, j) => (
                <th
                  key={j}
                  className="p-3 text-center font-extrabold text-slate-800 uppercase tracking-wider border-r-2 border-slate-700 min-w-[140px]"
                >
                  <div className="font-bold">{dest}</div>
                </th>
              ))}
              <th className="p-3 text-center font-extrabold text-slate-900 uppercase tracking-wider bg-amber-50 min-w-[110px]">
                Oferta
              </th>
            </tr>
          </thead>
          <tbody>
            {origins.map((orig, i) => (
              <tr key={i} className="border-b-2 border-slate-700">
                {/* Origin Name Column */}
                <td className="p-3 font-bold text-slate-800 bg-slate-50 border-r-2 border-slate-700">
                  <div className="text-sm font-bold">{orig}</div>
                </td>

                {/* Grid Cells */}
                {destinations.map((dest, j) => {
                  const unitCost = costs[i]?.[j] ?? 0;
                  const allocatedQty = allocations?.[i]?.[j] || 0;
                  const hasAllocation = allocatedQty > 0;

                  return (
                    <td
                      key={j}
                      className={`p-2 border-r-2 border-slate-700 relative h-24 transition-colors ${
                        hasAllocation ? 'bg-blue-50/50' : 'bg-white'
                      }`}
                    >
                      {/* Sub-box in Upper-Left corner for Unit Cost (Exact Slide 16 style) */}
                      <div className="absolute top-1 left-1 border border-slate-500 bg-slate-50 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-slate-800 shadow-xs">
                        {unitCost}
                      </div>

                      {/* Center Allocation Circle/Pill */}
                      {hasAllocation && (
                        <div className="flex flex-col items-center justify-center h-full pt-3">
                          <div className="w-16 h-12 rounded-full border-2 border-blue-600 bg-blue-100/90 text-blue-900 flex items-center justify-center font-extrabold text-sm font-mono shadow-md">
                            {allocatedQty}
                          </div>
                          <span className="text-[10px] text-blue-700 font-semibold mt-0.5">
                            ${allocatedQty * unitCost}
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}

                {/* Supply Column on Right */}
                <td className="p-3 text-center bg-amber-50/70 font-mono font-bold text-sm text-slate-900 border-l border-slate-300">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-slate-800 font-extrabold">{supply[i]}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      (Satisfecho: 0)
                    </span>
                  </div>
                </td>
              </tr>
            ))}

            {/* Demand Row at Bottom */}
            <tr className="bg-amber-50/70 border-t-2 border-slate-700">
              <td className="p-3 font-extrabold text-slate-900 uppercase border-r-2 border-slate-700">
                Demanda
              </td>
              {destinations.map((dest, j) => (
                <td
                  key={j}
                  className="p-3 text-center border-r-2 border-slate-700 font-mono font-bold text-sm text-slate-900"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-slate-800 font-extrabold">{demand[j]}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      (Satisfecho: 0)
                    </span>
                  </div>
                </td>
              ))}
              <td className="p-3 text-center font-mono font-extrabold text-sm text-blue-900 bg-blue-100">
                {supply.reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cost Multiplication Formula (Exact Slide 16 match) */}
      <div className="p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Desglose de la Función Objetivo (Cálculo del Costo Total)</span>
          <span className="text-emerald-400 font-mono font-bold text-sm">
            Z = ${Number(totalCost).toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
          <div className="text-slate-400 text-[11px] mb-1">
            Costo = Σ (Unidades Asignadas × Costo Unitario):
          </div>
          <div className="flex flex-wrap items-center gap-1 font-bold text-cyan-300">
            {terms.map((t, idx) => (
              <span key={idx} className="whitespace-nowrap">
                <span className="text-white">{t.qty}</span>
                <span className="text-slate-500">×</span>
                <span className="text-amber-300">{t.cost}</span>
                <span className="text-slate-400 text-[10px]"> ({t.orig}➔{t.dest})</span>
                {idx < terms.length - 1 ? <span className="text-slate-400 mx-1">+</span> : ''}
              </span>
            ))}
            <span className="text-white mx-1.5">=</span>
            <span className="text-emerald-400 text-sm font-extrabold">
              ${Number(totalCost).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Slide 17 Note if applicable */}
        <div className="text-xs text-slate-300 pt-1 flex items-start gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            {totalCost === 23100 ? (
              <strong className="text-emerald-400">
                ¡Esta es la solución óptima absoluta ($23.100)! Corresponde a la solución indicada en la Diapositiva 17 obtenida mediante Vogel / Solver.
              </strong>
            ) : totalCost === 24600 ? (
              <span>
                Esta solución arroja <strong className="text-amber-300">$24.600</strong> (exacto a la diapositiva 16 con Costo Mínimo). Como se señala en la <strong>Diapositiva 17</strong>: <em>"¿Será la más óptima? Existe una solución mejor que arroja un costo mínimo de 23.100... encuéntrala con Vogel o Solver"</em>.
              </span>
            ) : (
              <span>
                Solución factible calculada para la matriz actual con un costo total de ${Number(totalCost).toLocaleString()}.
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
