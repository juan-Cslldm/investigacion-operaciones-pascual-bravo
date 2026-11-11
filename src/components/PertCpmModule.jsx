import React, { useState, useMemo } from 'react';
import { Plus, Trash2, RotateCcw, ArrowRight } from 'lucide-react';
import { calculatePertCpm } from '../algorithms/pertCpm';
import NetworkDiagram from './NetworkDiagram';
import GanttChart from './GanttChart';

// Preset Diapositiva 34: Caso Hospital Mi Salud
const PRESET_HOSPITAL = [
  { id: 'A', name: 'Actividad A', duration: 12, predecessors: '' },
  { id: 'B', name: 'Actividad B', duration: 2, predecessors: '' },
  { id: 'C', name: 'Actividad C', duration: 8, predecessors: '' },
  { id: 'D', name: 'Actividad D', duration: 2, predecessors: 'C' },
  { id: 'E', name: 'Actividad E', duration: 1, predecessors: 'A, B, D' },
  { id: 'F', name: 'Actividad F', duration: 8, predecessors: '' },
  { id: 'G', name: 'Actividad G', duration: 1, predecessors: 'E' },
  { id: 'H', name: 'Actividad H', duration: 2, predecessors: 'E, F' },
  { id: 'I', name: 'Actividad I', duration: 1, predecessors: 'G, H' },
];

const PRESET_CASA = [
  { id: 'A', name: 'Cimientos y paredes', duration: 4, predecessors: '' },
  { id: 'B', name: 'Plomería y electricidad', duration: 2, predecessors: 'A' },
  { id: 'C', name: 'Techos', duration: 3, predecessors: 'A' },
  { id: 'D', name: 'Pintura exterior', duration: 1, predecessors: 'A' },
  { id: 'E', name: 'Pintura interior', duration: 5, predecessors: 'B, C' },
];

export default function PertCpmModule() {
  const [activities, setActivities] = useState(PRESET_HOSPITAL);
  const [activeSubTab, setActiveSubTab] = useState('network'); // 'network' | 'gantt' | 'table'

  const result = useMemo(() => calculatePertCpm(activities), [activities]);

  const handleAddRow = () => {
    const nextCode = String.fromCharCode(65 + activities.length);
    setActivities([
      ...activities,
      { id: nextCode, name: `Actividad ${nextCode}`, duration: 1, predecessors: '' }
    ]);
  };

  const handleRemoveRow = (index) => {
    if (activities.length <= 1) return;
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const handleSetRowCount = (count) => {
    const n = Math.max(1, Math.min(26, parseInt(count) || 1));
    if (n === activities.length) return;
    if (n > activities.length) {
      const added = [];
      for (let i = activities.length; i < n; i++) {
        const code = String.fromCharCode(65 + i);
        added.push({ id: code, name: `Actividad ${code}`, duration: 1, predecessors: '' });
      }
      setActivities([...activities, ...added]);
    } else {
      setActivities(activities.slice(0, n));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Planificación de Proyectos · PERT / CPM
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Determinación de tiempos tempranos, tardíos, holguras de eventos y ruta crítica.
          </p>
        </div>

        {/* Subtle presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1">Casos:</span>
          <button
            onClick={() => setActivities(PRESET_HOSPITAL)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          >
            Hospital Mi Salud (10 Act.)
          </button>
          <button
            onClick={() => setActivities(PRESET_CASA)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          >
            Construcción de Casa
          </button>
        </div>
      </div>

      {/* Input Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Actividades:</span>
            <input
              type="number"
              min="1"
              max="26"
              value={activities.length}
              onChange={(e) => handleSetRowCount(e.target.value)}
              className="w-14 px-2 py-1 text-center font-mono border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-slate-900"
            />
            <button
              onClick={handleAddRow}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Fila
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivities([])}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              Limpiar
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => setActivities(PRESET_HOSPITAL)}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Restablecer
            </button>
          </div>
        </div>

        {/* Clean Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4 w-12 text-slate-400">#</th>
                <th className="py-2.5 px-3 w-24">Actividad</th>
                <th className="py-2.5 px-3">Descripción</th>
                <th className="py-2.5 px-3 w-48">Predecesores inmediatos</th>
                <th className="py-2.5 px-3 w-32 text-center">Duración (días)</th>
                <th className="py-2.5 px-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((act, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition">
                  <td className="py-2 px-4 font-mono text-slate-400 text-[11px]">{index + 1}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={act.id}
                      onChange={(e) => handleChange(index, 'id', e.target.value.toUpperCase())}
                      className="w-12 px-1.5 py-0.5 font-bold text-center border border-slate-200 rounded uppercase font-mono focus:outline-none focus:border-slate-900"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={act.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      placeholder={`Tarea ${act.id}`}
                      className="w-full px-2 py-0.5 border border-transparent hover:border-slate-200 focus:border-slate-900 rounded focus:outline-none text-slate-700"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={act.predecessors}
                      onChange={(e) => handleChange(index, 'predecessors', e.target.value)}
                      placeholder="-"
                      className="w-full px-2 py-0.5 font-mono uppercase border border-slate-200 rounded focus:outline-none focus:border-slate-900 text-slate-700"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={act.duration}
                      onChange={(e) => handleChange(index, 'duration', e.target.value)}
                      className="w-20 px-2 py-0.5 text-center font-mono border border-slate-200 rounded focus:outline-none focus:border-slate-900 font-medium"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleRemoveRow(index)}
                      className="text-slate-300 hover:text-slate-500 p-1"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Cards */}
      {!result.error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Duración total del proyecto
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
              {result.projectDuration} <span className="text-xs font-normal text-slate-500">días</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs sm:col-span-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Ruta crítica identificada (Holgura = 0)
            </span>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
              {result.criticalPaths[0] ? (
                result.criticalPaths[0].map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        step === 'Inicio' || step === 'Fin'
                          ? 'bg-slate-100 text-slate-600 font-normal'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {step}
                    </span>
                    {idx < result.criticalPaths[0].length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="text-slate-400">Sin ruta crítica</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Switcher Tabs */}
      {!result.error && (
        <div className="space-y-3">
          <div className="flex items-center gap-1 border-b border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('network')}
              className={`pb-2.5 px-3 font-medium transition border-b-2 -mb-px ${
                activeSubTab === 'network'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Red de Actividades (AON)
            </button>
            <button
              onClick={() => setActiveSubTab('gantt')}
              className={`pb-2.5 px-3 font-medium transition border-b-2 -mb-px ${
                activeSubTab === 'gantt'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Diagrama de Gantt
            </button>
            <button
              onClick={() => setActiveSubTab('table')}
              className={`pb-2.5 px-3 font-medium transition border-b-2 -mb-px ${
                activeSubTab === 'table'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tabla de Tiempos y Holguras
            </button>
          </div>

          {/* Subtab Contents */}
          {activeSubTab === 'network' && (
            <NetworkDiagram
              nodes={result.nodes}
              links={result.links}
              criticalPaths={result.criticalPaths}
              projectDuration={result.projectDuration}
            />
          )}

          {activeSubTab === 'gantt' && (
            <GanttChart activities={result.activities} projectDuration={result.projectDuration} />
          )}

          {activeSubTab === 'table' && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-sans">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Actividad</th>
                    <th className="py-2.5 px-3 font-medium">Descripción</th>
                    <th className="py-2.5 px-3 text-center font-medium">Duración</th>
                    <th className="py-2.5 px-3 font-medium">Predecesores</th>
                    <th className="py-2.5 px-3 text-center font-medium">ES</th>
                    <th className="py-2.5 px-3 text-center font-medium">EF</th>
                    <th className="py-2.5 px-3 text-center font-medium">LS</th>
                    <th className="py-2.5 px-3 text-center font-medium">LF</th>
                    <th className="py-2.5 px-3 text-center font-medium">Holgura (H)</th>
                    <th className="py-2.5 px-3 text-center font-medium">¿Crítica?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.activities.map((act) => (
                    <tr
                      key={act.id}
                      className={act.isCritical ? 'bg-slate-50/70 font-semibold text-slate-900' : 'text-slate-600'}
                    >
                      <td className="py-2 px-3 font-bold">{act.id}</td>
                      <td className="py-2 px-3 font-sans text-slate-800">{act.name}</td>
                      <td className="py-2 px-3 text-center">{act.duration}</td>
                      <td className="py-2 px-3">{act.predecessors.length > 0 ? act.predecessors.join(', ') : '-'}</td>
                      <td className="py-2 px-3 text-center text-slate-500">{act.es}</td>
                      <td className="py-2 px-3 text-center text-slate-800">{act.ef}</td>
                      <td className="py-2 px-3 text-center text-slate-500">{act.ls}</td>
                      <td className="py-2 px-3 text-center text-slate-800">{act.lf}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={act.slack === 0 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                          {act.slack}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-sans">
                        {act.isCritical ? (
                          <span className="text-[11px] font-semibold text-slate-900">Sí</span>
                        ) : (
                          <span className="text-[11px] text-slate-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
