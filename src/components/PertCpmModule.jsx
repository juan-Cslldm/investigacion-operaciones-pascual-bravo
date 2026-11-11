import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, RotateCcw, Play, CheckCircle2, AlertTriangle, 
  Layers, ArrowRight, Table, Network, Calendar, HelpCircle, FileSpreadsheet
} from 'lucide-react';
import { calculatePertCpm } from '../algorithms/pertCpm';
import NetworkDiagram from './NetworkDiagram';
import GanttChart from './GanttChart';

// Preset Diapositiva 34: Caso Hospital Mi Salud (Pascual Bravo)
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

// Preset Diapositiva 16-22: Construcción de una casa
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

  // Run calculation
  const result = useMemo(() => {
    return calculatePertCpm(activities);
  }, [activities]);

  // Handlers for table manipulation
  const handleAddRow = () => {
    // Generate next letter
    const nextCode = String.fromCharCode(65 + activities.length);
    setActivities([
      ...activities,
      { id: nextCode, name: `Actividad ${nextCode}`, duration: 1, predecessors: '' }
    ]);
  };

  const handleRemoveRow = (index) => {
    if (activities.length <= 1) return;
    const newAct = activities.filter((_, i) => i !== index);
    setActivities(newAct);
  };

  const handleChange = (index, field, value) => {
    const updated = [...activities];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
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
      {/* Top Banner / Case Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Módulo 1
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Planificación de Proyectos PERT / CPM & Ruta Crítica
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Calcula tiempos tempranos (ES, EF), tardíos (LS, LF), holguras y dibuja la red de actividades y el Diagrama de Gantt conforme a los lineamientos de la Institución Universitaria Pascual Bravo.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Casos Diapositivas:
            </span>
            <button
              onClick={() => setActivities(PRESET_HOSPITAL)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Diapositiva 34: Hospital Mi Salud (10 Act.)</span>
            </button>
            <button
              onClick={() => setActivities(PRESET_CASA)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Diapositiva 16: Construcción Casa (5 Act.)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table Configuration Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              Cantidad de Actividades (Filas):
            </label>
            <input
              type="number"
              min="1"
              max="26"
              value={activities.length}
              onChange={(e) => handleSetRowCount(e.target.value)}
              className="w-16 px-2.5 py-1 text-sm font-bold text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Añadir Fila
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivities([])}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpiar Todo
            </button>
            <button
              onClick={() => setActivities(PRESET_HOSPITAL)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restablecer Caso Hospital
            </button>
          </div>
        </div>

        {/* Input Table */}
        <div className="mt-4 overflow-x-auto border border-slate-200 rounded-xl shadow-inner">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">#</th>
                <th className="py-2.5 px-3 w-28">Actividad (ID)</th>
                <th className="py-2.5 px-3">Descripción de la Tarea</th>
                <th className="py-2.5 px-3 w-52">Predecesores Inmediatos</th>
                <th className="py-2.5 px-3 w-40 text-center">Tiempo Esperado (días)</th>
                <th className="py-2.5 px-3 w-16 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((act, index) => (
                <tr key={index} className="hover:bg-blue-50/40 transition">
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={act.id}
                      onChange={(e) => handleChange(index, 'id', e.target.value.toUpperCase())}
                      className="w-full px-2 py-1 font-bold text-center border border-slate-200 rounded-md focus:border-blue-500 focus:outline-none uppercase font-mono"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={act.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      placeholder={`Descripción tarea ${act.id}`}
                      className="w-full px-2 py-1 border border-slate-200 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={act.predecessors}
                      onChange={(e) => handleChange(index, 'predecessors', e.target.value)}
                      placeholder="Ej: A, B  (o vacío si ninguno)"
                      className="w-full px-2 py-1 font-mono uppercase border border-slate-200 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={act.duration}
                      onChange={(e) => handleChange(index, 'duration', e.target.value)}
                      className="w-24 px-2 py-1 text-center font-mono font-bold border border-slate-200 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleRemoveRow(index)}
                      className="p-1 hover:bg-rose-100 rounded text-rose-500 hover:text-rose-700 transition"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning or Error Message if any */}
        {result.error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{result.error}</span>
          </div>
        )}
      </div>

      {/* Results Summary Dashboard */}
      {!result.error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Project Duration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Duración Total del Proyecto
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {result.projectDuration}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                días / unidades
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Tiempo mínimo requerido para completar todas las actividades sin retrasos.
            </p>
          </div>

          {/* Card 2: Critical Path */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl border border-rose-200 p-5 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Ruta Crítica Determinada (Holgura = 0)
              </span>
              <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                {result.criticalActivities.length} actividades críticas
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {result.criticalPaths.length > 0 ? (
                result.criticalPaths.map((path, pIdx) => (
                  <div key={pIdx} className="flex flex-wrap items-center gap-1.5 bg-white/90 px-3 py-2 rounded-xl border border-rose-200 shadow-sm">
                    {path.map((actId, idx) => (
                      <React.Fragment key={idx}>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                          actId === 'Inicio' || actId === 'Fin'
                            ? 'bg-slate-800 text-white'
                            : 'bg-rose-600 text-white shadow-sm shadow-rose-500/30'
                        }`}>
                          {actId}
                        </span>
                        {idx < path.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-500 font-medium">No se detectó ruta crítica continua</span>
              )}
            </div>
            <p className="text-xs text-rose-700 mt-2">
              Cualquier retraso en estas actividades aplazará directamente la fecha de finalización del proyecto.
            </p>
          </div>
        </div>
      )}

      {/* Subtabs for Visualizations */}
      {!result.error && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('network')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeSubTab === 'network'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Network className="w-4 h-4" />
                <span>Red de Actividades (Diapositiva 22)</span>
              </button>

              <button
                onClick={() => setActiveSubTab('gantt')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeSubTab === 'gantt'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Diagrama de Gantt Interactivo</span>
              </button>

              <button
                onClick={() => setActiveSubTab('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeSubTab === 'table'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>Tabla de Tiempos y Holguras</span>
              </button>
            </div>
          </div>

          {/* Subtab 1: Network Diagram */}
          {activeSubTab === 'network' && (
            <NetworkDiagram
              nodes={result.nodes}
              links={result.links}
              criticalPaths={result.criticalPaths}
              projectDuration={result.projectDuration}
            />
          )}

          {/* Subtab 2: Gantt Chart */}
          {activeSubTab === 'gantt' && (
            <GanttChart
              activities={result.activities}
              projectDuration={result.projectDuration}
            />
          )}

          {/* Subtab 3: Detailed Table */}
          {activeSubTab === 'table' && (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-white uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Actividad</th>
                      <th className="py-3 px-3">Nombre</th>
                      <th className="py-3 px-3 text-center">Duración (t)</th>
                      <th className="py-3 px-3">Predecesores</th>
                      <th className="py-3 px-3 text-center bg-blue-900/60">ES (Temprano)</th>
                      <th className="py-3 px-3 text-center bg-blue-900/60">EF (Temprano)</th>
                      <th className="py-3 px-3 text-center bg-slate-900/80">LS (Tardío)</th>
                      <th className="py-3 px-3 text-center bg-slate-900/80">LF (Tardío)</th>
                      <th className="py-3 px-3 text-center bg-amber-900/60">Holgura Total (H)</th>
                      <th className="py-3 px-3 text-center bg-emerald-900/60">Holgura Libre (HL)</th>
                      <th className="py-3 px-3 text-center">¿Crítica?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {result.activities.map((act) => (
                      <tr
                        key={act.id}
                        className={`transition ${
                          act.isCritical
                            ? 'bg-rose-50/70 font-semibold text-rose-950'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-sm">
                          <span className={`px-2 py-0.5 rounded ${
                            act.isCritical ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {act.id}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                          {act.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">{act.duration}</td>
                        <td className="py-2.5 px-3">
                          {act.predecessors.length > 0 ? act.predecessors.join(', ') : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-blue-50/50 font-bold">{act.es}</td>
                        <td className="py-2.5 px-3 text-center bg-blue-50/50 font-bold">{act.ef}</td>
                        <td className="py-2.5 px-3 text-center bg-slate-100/50">{act.ls}</td>
                        <td className="py-2.5 px-3 text-center bg-slate-100/50">{act.lf}</td>
                        <td className={`py-2.5 px-3 text-center font-bold ${
                          act.slack === 0 ? 'text-rose-600 bg-rose-100/50' : 'text-amber-800 bg-amber-50/50'
                        }`}>
                          {act.slack}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-emerald-50/50 text-emerald-800 font-bold">
                          {act.freeSlack}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {act.isCritical ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                              Sí (Crítica)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-wider">
                              No
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Formulas Note */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Fórmulas empleadas (conforme a las Diapositivas):</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div>• ES = máx(EF de predecesores)</div>
                  <div>• EF = ES + duración</div>
                  <div>• LF = mín(LS de sucesores)</div>
                  <div>• LS = LF - duración</div>
                  <div>• Holgura H = LS - ES = LF - EF</div>
                  <div>• Holgura Libre HL = mín(ES sucesores) - EF</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
