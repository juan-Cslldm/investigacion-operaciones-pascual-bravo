import React from 'react';
import { BookOpen, CheckCircle, Network, Truck, TrendingDown, Layers, FileText } from 'lucide-react';

export default function TheoryGuide() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Fundamentos Teóricos & Diapositivas de Clase
            </h2>
            <p className="text-sm text-slate-300">
              Institución Universitaria Pascual Bravo — Asignatura: Investigación de Operaciones
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: PERT/CPM Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Network className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              1. Proyectos PERT - CPM (Presentación 6)
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>Concepto:</strong> Un proyecto es cualquier empresa humana con un claro principio y un claro final (Gallagher). Requiere planeación, programación y control para determinar la duración mínima y las tareas críticas.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-800 block text-xs uppercase">
                Cálculo de los 4 Tiempos de Cada Actividad:
              </span>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px]">
                <li>
                  <strong className="text-blue-700">ES (Early Start / Inicio Temprano):</strong> Tiempo más temprano posible para iniciar una actividad. Se calcula de izquierda a derecha:<br />
                  <span className="text-slate-800">ES = máx(EF de las actividades anteriores)</span>
                </li>
                <li>
                  <strong className="text-blue-700">EF (Early Finish / Terminación Temprana):</strong><br />
                  <span className="text-slate-800">EF = ES + duración de la actividad</span>
                </li>
                <li>
                  <strong className="text-slate-800">LF (Late Finish / Terminación Tardía):</strong> Tiempo más tardío en que puede terminar sin retrasar el proyecto. Se calcula de derecha a izquierda:<br />
                  <span className="text-slate-800">LF = mín(LS de las actividades sucesoras)</span>
                </li>
                <li>
                  <strong className="text-slate-800">LS (Late Start / Inicio Tardío):</strong><br />
                  <span className="text-slate-800">LS = LF - duración de la actividad</span>
                </li>
                <li>
                  <strong className="text-rose-600">Holgura Total (H):</strong> Margen de retraso permitido:<br />
                  <span className="text-rose-700 font-bold">H = LS - ES = LF - EF</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <strong className="text-rose-900 block text-xs mb-1">
                ¿Cómo se determina la Ruta Crítica?
              </strong>
              <p className="text-rose-800">
                La ruta crítica está formada por todas aquellas actividades cuya <strong>Holgura es cero (H = 0)</strong>. Cualquier retraso en ellas incrementa la duración total del proyecto.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <strong className="text-blue-900 block text-xs mb-1">
                Caso Hospital Mi Salud (Diapositiva 34):
              </strong>
              <p className="text-blue-800">
                10 actividades identificadas (A a I). Ruta crítica obtenida: <strong className="font-mono">Inicio ➔ A ➔ E ➔ H ➔ I ➔ Fin</strong> con una duración total de <strong>16 días</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Module 2: Transporte Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Truck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              2. Modelo de Transporte (Presentación 5)
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>Objetivo:</strong> Determinar un plan de transporte óptimo desde múltiples fuentes u orígenes ($m$) hasta múltiples destinos ($n$) que satisfaga las restricciones de oferta y demanda al menor costo total.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-[11px]">
              <div className="font-bold text-slate-800 uppercase font-sans text-xs mb-1">
                Modelo Matemático de Programación Lineal:
              </div>
              <div className="text-blue-700">Minimizar Z = Σ Σ (c_ij × x_ij)</div>
              <div>Sujeto a:</div>
              <div>• Σ_j x_ij ≤ Oferta_i (Restricciones de capacidad de plantas/orígenes)</div>
              <div>• Σ_i x_ij = Demanda_j (Restricciones de requerimientos de destinos)</div>
              <div>• x_ij ≥ 0 y enteras (No negatividad e integralidad)</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-800 block text-xs uppercase">
                Métodos de Solución:
              </span>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong>Método del Costo Mínimo (MCM) (Diapositiva 16):</strong> Asigna la mayor cantidad posible a la celda con menor costo unitario no tachada. Arroja un costo inicial de <strong>$24.600</strong> en el caso de El Tiempo.
                </li>
                <li>
                  <strong>Método de Aproximación de Vogel (VAM):</strong> Calcula penalizaciones (diferencia entre los dos menores costos por fila y columna) y asigna en la mayor penalización para evitar sobrecostos futuros.
                </li>
                <li>
                  <strong>Solución Óptima / Solver (Diapositiva 17):</strong> Encuentra el óptimo global de <strong>$23.100</strong>, logrando un ahorro de <strong>$1.500</strong> frente al Costo Mínimo.
                </li>
              </ul>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <strong className="text-emerald-900 block text-xs mb-1 flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                Respuesta a la incógnita de la Diapositiva 17:
              </strong>
              <p className="text-emerald-800">
                La diapositiva 17 plantea: <em>"¿Será la más óptima? Existe una solución mejor que arroja un costo mínimo de 23.100..."</em>. En esta plataforma, tanto el <strong>Método de Vogel</strong> como el <strong>Solver</strong> encuentran exactamente esa asignación de $23.100.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bibliographic References from Slides 35-36 */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600">
        <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
          Referencias Bibliográficas Citadas en las Diapositivas:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
          <div>• Hillier, F. S., & Lieberman, G. J. (2021). <em>Introduction to Operations Research</em> (11th ed.). McGraw-Hill.</div>
          <div>• Taha, H. A. (2017). <em>Investigación de operaciones</em> (9a y 10a edición). Pearson Educación.</div>
          <div>• Rendy, B. (2009). <em>Principios de administración de operaciones</em> (7a ed.). Pearson Educación México.</div>
          <div>• Martín Martín, Q., Santos Martín, M. T., & De Paz Santana, Y. (2005). <em>Investigación operativa</em>. Pearson Prentice Hall.</div>
        </div>
      </div>
    </div>
  );
}
