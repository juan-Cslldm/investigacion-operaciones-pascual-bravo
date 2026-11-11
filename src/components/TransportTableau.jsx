import React from 'react';

export default function TransportTableau({
  origins,
  destinations,
  costs,
  allocations,
  supply,
  demand,
  methodName,
  totalCost,
}) {
  if (!origins || !destinations || !costs) return null;

  const terms = [];
  origins.forEach((orig, i) => {
    destinations.forEach((dest, j) => {
      const qty = allocations?.[i]?.[j] || 0;
      if (qty > 0) {
        const c = costs[i][j];
        terms.push({ orig, dest, qty, cost: c, subtotal: qty * c });
      }
    });
  });

  return (
    <div className="space-y-4">
      {/* Tableau Grid */}
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <table className="w-full border-collapse text-xs select-none">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <th className="p-3 text-left w-36 font-semibold">Origen \ Destino</th>
              {destinations.map((dest, j) => (
                <th key={j} className="p-3 text-center border-l border-slate-200 font-semibold min-w-[120px]">
                  {dest}
                </th>
              ))}
              <th className="p-3 text-center border-l border-slate-200 font-semibold bg-slate-100/50 w-28">
                Oferta
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {origins.map((orig, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition">
                <td className="p-3 font-semibold text-slate-800 bg-slate-50/50">{orig}</td>
                {destinations.map((dest, j) => {
                  const unitCost = costs[i]?.[j] ?? 0;
                  const allocatedQty = allocations?.[i]?.[j] || 0;
                  const hasAllocation = allocatedQty > 0;

                  return (
                    <td
                      key={j}
                      className={`p-2 border-l border-slate-200 relative h-20 text-center transition ${
                        hasAllocation ? 'bg-slate-50/80' : ''
                      }`}
                    >
                      {/* Unit cost box in upper-left corner */}
                      <span className="absolute top-1.5 left-2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1 rounded">
                        ${unitCost}
                      </span>

                      {/* Allocated quantity */}
                      {hasAllocation && (
                        <div className="flex flex-col items-center justify-center pt-2">
                          <span className="font-mono text-sm font-bold text-slate-900 border border-slate-900 rounded-md px-2.5 py-0.5 bg-white shadow-2xs">
                            {allocatedQty}
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="p-3 text-center border-l border-slate-200 font-mono font-medium text-slate-700 bg-slate-50/40">
                  {supply[i]}
                </td>
              </tr>
            ))}

            {/* Demand Row */}
            <tr className="bg-slate-50/70 border-t-2 border-slate-300 font-medium">
              <td className="p-3 font-semibold text-slate-800">Demanda</td>
              {destinations.map((dest, j) => (
                <td key={j} className="p-3 text-center border-l border-slate-200 font-mono text-slate-700">
                  {demand[j]}
                </td>
              ))}
              <td className="p-3 text-center border-l border-slate-200 font-mono font-bold text-slate-900 bg-slate-100/80">
                {supply.reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cost Breakdown Formula Card */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-500 font-medium pb-2 border-b border-slate-100">
          <span>Función objetivo ({methodName})</span>
          <span className="font-mono font-bold text-sm text-slate-900">
            Z = ${Number(totalCost).toLocaleString()}
          </span>
        </div>

        <div className="font-mono text-[11px] text-slate-600 flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Z =</span>
          {terms.map((t, idx) => (
            <span key={idx} className="whitespace-nowrap">
              <span>{t.qty}</span>
              <span className="text-slate-400">×</span>
              <span>{t.cost}</span>
              <span className="text-slate-400 text-[10px]">({t.orig}➔{t.dest})</span>
              {idx < terms.length - 1 ? <span className="text-slate-400 mx-1">+</span> : ''}
            </span>
          ))}
          <span className="font-bold text-slate-900 ml-1">= ${Number(totalCost).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
