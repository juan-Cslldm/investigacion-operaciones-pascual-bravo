import React, { useState } from 'react';
import { Clock, X, ArrowRight } from 'lucide-react';

export default function GanttChart({ activities, projectDuration }) {
  const [selectedTask, setSelectedTask] = useState(null);

  if (!activities || activities.length === 0 || projectDuration <= 0) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        No hay datos para construir el cronograma.
      </div>
    );
  }

  const ticks = Array.from({ length: Math.ceil(projectDuration) + 1 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Legend & Instructions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500">
        <div>
          Haz clic en cualquier barra para examinar el <span className="font-semibold text-slate-900">tiempo de duración</span> y holguras.
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
            <span className="text-slate-800 font-medium">Actividad crítica</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
            <span>Actividad estándar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border border-slate-300 border-dashed bg-slate-100"></span>
            <span>Holgura disponible</span>
          </div>
        </div>
      </div>

      {/* Gantt Matrix Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-x-auto p-4">
        <div className="min-w-[640px]">
          {/* Timeline Header */}
          <div className="grid grid-cols-[140px_1fr] items-center border-b border-slate-100 pb-2.5 mb-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Actividad
            </div>
            <div className="relative h-5">
              {ticks.map((t) => {
                const leftPercent = (t / projectDuration) * 100;
                return (
                  <div
                    key={t}
                    className="absolute text-[11px] font-mono text-slate-400 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${leftPercent}%` }}
                  >
                    <span>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Rows */}
          <div className="space-y-1">
            {activities.map((act) => {
              const startPercent = (act.es / projectDuration) * 100;
              const durationPercent = (act.duration / projectDuration) * 100;
              const slackPercent = (act.slack / projectDuration) * 100;

              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedTask(act)}
                  className={`grid grid-cols-[140px_1fr] items-center py-1.5 px-2 rounded-lg cursor-pointer transition ${
                    selectedTask?.id === act.id
                      ? 'bg-slate-100/80 ring-1 ring-slate-300'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Left Label */}
                  <div className="flex items-center gap-2 pr-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold ${
                        act.isCritical
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {act.id}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-medium text-slate-800 truncate">
                        {act.name || `Actividad ${act.id}`}
                      </div>
                    </div>
                  </div>

                  {/* Track Bar */}
                  <div className="relative h-6 bg-slate-50 rounded overflow-hidden">
                    {/* Vertical grid guidelines */}
                    {ticks.map((t) => (
                      <div
                        key={t}
                        className="absolute top-0 bottom-0 w-px bg-slate-100 pointer-events-none"
                        style={{ left: `${(t / projectDuration) * 100}%` }}
                      />
                    ))}

                    {/* Slack Bar (Holgura) */}
                    {act.slack > 0 && (
                      <div
                        className="absolute top-1 bottom-1 border border-dashed border-slate-300 bg-slate-100 rounded-r text-[10px] text-slate-400 flex items-center justify-end pr-1 font-mono"
                        style={{
                          left: `${startPercent + durationPercent}%`,
                          width: `${slackPercent}%`,
                        }}
                      >
                        +{act.slack}
                      </div>
                    )}

                    {/* Main Bar */}
                    <div
                      className={`absolute top-0.5 bottom-0.5 rounded flex items-center justify-between px-2 text-xs font-mono font-medium transition ${
                        act.isCritical
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-300 text-slate-800'
                      }`}
                      style={{
                        left: `${startPercent}%`,
                        width: `${Math.max(durationPercent, 2)}%`,
                      }}
                    >
                      <span>{act.id}</span>
                      <span className="text-[10px] opacity-80">{act.duration}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Task Details Sheet / Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in duration-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                    selectedTask.isCritical ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {selectedTask.id}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {selectedTask.name || `Actividad ${selectedTask.id}`}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {selectedTask.isCritical ? 'Pertenece a la ruta crítica' : 'Actividad con holgura'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Highlighted Duration (Demora en la tarea) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Tiempo demorado en la tarea
                  </span>
                  <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                    {selectedTask.duration} {selectedTask.duration === 1 ? 'día' : 'días'}
                  </div>
                </div>
                <Clock className="w-6 h-6 text-slate-400" />
              </div>

              {/* Early and Late Bounds */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Inicio temprano (ES)
                  </span>
                  <span className="text-base font-semibold text-slate-800 font-mono">
                    Día {selectedTask.es}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Fin (EF): Día {selectedTask.ef}</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Inicio tardío (LS)
                  </span>
                  <span className="text-base font-semibold text-slate-800 font-mono">
                    Día {selectedTask.ls}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Fin (LF): Día {selectedTask.lf}</div>
                </div>
              </div>

              {/* Slack & Relations */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Holgura total (H):</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedTask.slack} {selectedTask.slack === 1 ? 'día' : 'días'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Predecesores:</span>
                  <span className="font-mono text-slate-800">
                    {selectedTask.predecessors.length > 0 ? selectedTask.predecessors.join(', ') : 'Ninguno (Inicial)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Sucesores:</span>
                  <span className="font-mono text-slate-800">
                    {selectedTask.successors.length > 0 ? selectedTask.successors.join(', ') : 'Ninguno (Final)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
