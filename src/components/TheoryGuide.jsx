import React from 'react';

export default function TheoryGuide() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Fundamentos Metodológicos
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Resumen teórico y formulaciones matemáticas aplicadas en los módulos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
        {/* PERT/CPM */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            1. Método de la Ruta Crítica (CPM)
          </h2>
          <p>
            El análisis de redes de actividades permite identificar el cuello de botella temporal de cualquier proyecto.
          </p>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-2">
            <span className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider block">
              Formulaciones de Ida y Regreso:
            </span>
            <ul className="space-y-1.5 font-mono text-[11px] text-slate-700">
              <li>• <span className="font-semibold text-slate-900">ES:</span> máx(EF de predecesores inmediatos)</li>
              <li>• <span className="font-semibold text-slate-900">EF:</span> ES + duración</li>
              <li>• <span className="font-semibold text-slate-900">LF:</span> mín(LS de sucesores inmediatos)</li>
              <li>• <span className="font-semibold text-slate-900">LS:</span> LF - duración</li>
              <li>• <span className="font-semibold text-slate-900">Holgura Total (H):</span> LS - ES = LF - EF</li>
            </ul>
          </div>
          <p className="text-slate-500">
            Una actividad es <strong className="text-slate-900 font-semibold">crítica</strong> si su holgura es cero ($H = 0$), lo que significa que no admite ninguna demora sin aplazar la fecha final del proyecto.
          </p>
        </div>

        {/* Transporte */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            2. Modelo Clásico de Transporte
          </h2>
          <p>
            Problema de programación lineal enfocado en minimizar los costos totales de envío desde $m$ orígenes hasta $n$ destinos.
          </p>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-2">
            <span className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider block">
              Formulación Matemática:
            </span>
            <div className="font-mono text-[11px] text-slate-700 space-y-1">
              <div>Min Z = Σ_i Σ_j (c_ij × x_ij)</div>
              <div className="text-slate-500 text-[10px] mt-1">Restricciones:</div>
              <div>• Σ_j x_ij ≤ Oferta_i (para cada origen)</div>
              <div>• Σ_i x_ij = Demanda_j (para cada destino)</div>
              <div>• x_ij ≥ 0 (no negatividad)</div>
            </div>
          </div>
          <p className="text-slate-500">
            El <strong className="text-slate-900 font-semibold">Método de Vogel (VAM)</strong> penaliza las líneas con mayor riesgo de sobrecosto, obteniendo una solución inicial que generalmente coincide con el óptimo global del Solver.
          </p>
        </div>
      </div>
    </div>
  );
}
