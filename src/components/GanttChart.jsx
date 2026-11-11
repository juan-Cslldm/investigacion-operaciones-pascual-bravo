import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, X, Info } from 'lucide-react';

export default function GanttChart({ activities, projectDuration }) {
  const [selectedTask, setSelectedTask] = useState(null);

  if (!activities || activities.length === 0 || projectDuration <= 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        No hay datos para construir el Diagrama de Gantt.
      </div>
    );
  }

  // Generate day ticks 0 to projectDuration
  const ticks = Array.from({ length: Math.ceil(projectDuration) + 1 }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Diagrama de Gantt Interactivo (CPM)
          </h3>
          <p className="text-xs text-slate-500">
            Haz clic en cualquier barra de tarea para ver el <strong className="text-blue-600">tiempo demorado</strong>, holguras y detalles.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-600 inline-block shadow-sm"></span>
            <span className="text-slate-700">Ruta Crítica (Holgura = 0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-500 inline-block shadow-sm"></span>
            <span className="text-slate-700">No Crítica</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-400 border-dashed inline-block"></span>
            <span className="text-slate-700">Holgura Total (H)</span>
          </div>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto p-4">
        <div className="min-w-[700px]">
          {/* Header Time Scale */}
          <div className="grid grid-cols-[160px_1fr] items-center border-b border-slate-200 pb-2 mb-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Actividad
            </div>
            <div className="relative h-6 flex items-center">
              {ticks.map((t) => {
                const leftPercent = (t / projectDuration) * 100;
                return (
                  <div
                    key={t}
                    className="absolute text-[11px] font-mono font-medium text-slate-400 transform -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${leftPercent}%` }}
                  >
                    <span>{t}</span>
                    <span className="w-px h-1.5 bg-slate-300 mt-0.5"></span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Rows */}
          <div className="space-y-2.5">
            {activities.map((act) => {
              const startPercent = (act.es / projectDuration) * 100;
              const durationPercent = (act.duration / projectDuration) * 100;
              const slackPercent = (act.slack / projectDuration) * 100;

              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedTask(act)}
                  className={`grid grid-cols-[160px_1fr] items-center py-1.5 px-2 rounded-lg cursor-pointer transition group ${
                    selectedTask?.id === act.id
                      ? 'bg-blue-50/80 ring-1 ring-blue-400'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Task Info Label */}
                  <div className="flex items-center gap-2 pr-2">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                        act.isCritical ? 'bg-rose-600' : 'bg-slate-700'
                      }`}
                    >
                      {act.id}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">
                        {act.name || `Actividad ${act.id}`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {act.duration} {act.duration === 1 ? 'día' : 'días'}
                      </div>
                    </div>
                  </div>

                  {/* Task Bar Track */}
                  <div className="relative h-7 bg-slate-100 rounded-md overflow-hidden">
                    {/* Vertical grid lines */}
                    {ticks.map((t) => (
                      <div
                        key={t}
                        className="absolute top-0 bottom-0 w-px bg-slate-200 pointer-events-none"
                        style={{ left: `${(t / projectDuration) * 100}%` }}
                      />
                    ))}

                    {/* Slack Bar (Holgura) */}
                    {act.slack > 0 && (
                      <div
                        className="absolute top-1 bottom-1 bg-amber-100/90 border border-dashed border-amber-400 rounded-r-md flex items-center justify-end pr-1 text-[10px] text-amber-800 font-semibold"
                        style={{
                          left: `${startPercent + durationPercent}%`,
                          width: `${slackPercent}%`,
                        }}
                        title={`Holgura: ${act.slack} días`}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition truncate">
                          +H:{act.slack}
                        </span>
                      </div>
                    )}

                    {/* Main Duration Bar */}
                    <div
                      className={`absolute top-0.5 bottom-0.5 rounded-md flex items-center justify-between px-2 text-white text-xs font-bold shadow-sm transition-transform duration-150 group-hover:scale-y-105 ${
                        act.isCritical
                          ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-rose-500/20'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-blue-500/20'
                      }`}
                      style={{
                        left: `${startPercent}%`,
                        width: `${Math.max(durationPercent, 1.5)}%`,
                      }}
                    >
                      <span className="truncate">{act.id}</span>
                      <span className="text-[10px] font-mono opacity-90 ml-1">
                        {act.duration}d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Details Modal / Drawer on Click */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className={`p-4 text-white flex justify-between items-center ${
              selectedTask.isCritical
                ? 'bg-gradient-to-r from-rose-600 to-red-600'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                  {selectedTask.id}
                </div>
                <div>
                  <h4 className="font-bold text-base leading-tight">
                    {selectedTask.name || `Actividad ${selectedTask.id}`}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    {selectedTask.isCritical ? (
                      <span className="text-[11px] bg-red-950/40 text-rose-100 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Tarea en Ruta Crítica
                      </span>
                    ) : (
                      <span className="text-[11px] bg-blue-950/40 text-blue-100 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tarea No Crítica
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Highlighted Time Demorado en la Tarea (User requirement!) */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                    Tiempo Demorado en la Tarea
                  </span>
                  <p className="text-2xl font-extrabold text-blue-950 mt-0.5">
                    {selectedTask.duration} {selectedTask.duration === 1 ? 'Día' : 'Días'} / Unidades de Tiempo
                  </p>
                  <span className="text-xs text-blue-600">
                    Duración esperada según estimación del proyecto
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Tiempos Tempranos y Tardíos */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    Inicio Temprano (ES)
                  </div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    Día {selectedTask.es}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Fin Temprano (EF): <span className="font-semibold text-slate-700">Día {selectedTask.ef}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">
                    Inicio Tardío (LS)
                  </div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    Día {selectedTask.ls}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Fin Tardío (LF): <span className="font-semibold text-slate-700">Día {selectedTask.lf}</span>
                  </div>
                </div>
              </div>

              {/* Holguras */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="text-[11px] font-bold text-amber-800 uppercase">
                    Holgura Total (H = LS - ES)
                  </div>
                  <div className="text-xl font-bold text-amber-900 mt-0.5 font-mono">
                    {selectedTask.slack} días
                  </div>
                  <div className="text-[11px] text-amber-700 mt-1">
                    {selectedTask.slack === 0
                      ? 'No permite retrasos sin afectar el proyecto'
                      : `Puede retrasarse hasta ${selectedTask.slack} días`}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">
                    Holgura Libre (HL)
                  </div>
                  <div className="text-xl font-bold text-emerald-900 mt-0.5 font-mono">
                    {selectedTask.freeSlack} días
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    Margen sin retrasar la siguiente tarea
                  </div>
                </div>
              </div>

              {/* Relaciones */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Predecesores Inmediatos:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedTask.predecessors.length > 0
                      ? selectedTask.predecessors.join(', ')
                      : 'Ninguno (Actividad Inicial)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Actividades Sucesoras:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedTask.successors.length > 0
                      ? selectedTask.successors.join(', ')
                      : 'Ninguno (Actividad Final)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
