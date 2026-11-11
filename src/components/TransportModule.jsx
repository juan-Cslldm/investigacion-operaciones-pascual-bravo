import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, RotateCcw, Truck, DollarSign, ListOrdered, 
  Network, Table, Sparkles, CheckCircle2, AlertCircle, TrendingDown,
  FileSpreadsheet
} from 'lucide-react';
import { 
  solveVogel, solveMinCost, solveNorthwest, solveOptimalTransport, 
  balanceTransportProblem 
} from '../algorithms/transportation';
import TransportTableau from './TransportTableau';
import TransportStepByStep from './TransportStepByStep';
import TransportBipartiteGraph from './TransportBipartiteGraph';

// Preset Diapositivas 11-17: Diario El Tiempo
const PRESET_EL_TIEMPO = {
  origins: ['Bogotá', 'Medellín', 'Cali'],
  destinations: ['Villavicencio', 'Ibagué', 'Bucaramanga', 'Barranquilla'],
  costs: [
    [5, 3, 2, 6],
    [4, 7, 8, 10],
    [6, 5, 3, 8],
  ],
  supply: [1700, 2000, 1700],
  demand: [1700, 1000, 1500, 1200],
};

// Preset Diapositivas 18-20: Motores E-4 (Puertos a Plantas)
const PRESET_MOTORES = {
  origins: ['Ámsterdam', 'Amberes', 'El Havre'],
  destinations: ['Leipzig', 'Nancy', 'Lieja', 'Tilburgo'],
  costs: [
    [12, 13, 4, 6],
    [6, 4, 10, 11],
    [10, 9, 12, 4],
  ],
  supply: [500, 700, 800],
  demand: [400, 900, 200, 500],
};

export default function TransportModule() {
  const [origins, setOrigins] = useState(PRESET_EL_TIEMPO.origins);
  const [destinations, setDestinations] = useState(PRESET_EL_TIEMPO.destinations);
  const [costs, setCosts] = useState(PRESET_EL_TIEMPO.costs);
  const [supply, setSupply] = useState(PRESET_EL_TIEMPO.supply);
  const [demand, setDemand] = useState(PRESET_EL_TIEMPO.demand);

  const [selectedMethod, setSelectedMethod] = useState('VAM'); // 'VAM' | 'MCM' | 'MEN' | 'SOLVER'
  const [activeSubTab, setActiveSubTab] = useState('tableau'); // 'tableau' | 'steps' | 'graph'

  // Load Preset
  const handleLoadPreset = (preset) => {
    setOrigins([...preset.origins]);
    setDestinations([...preset.destinations]);
    setCosts(preset.costs.map((r) => [...r]));
    setSupply([...preset.supply]);
    setDemand([...preset.demand]);
  };

  // Add / Remove Origin (Rows)
  const handleAddOrigin = () => {
    const nextIdx = origins.length + 1;
    setOrigins([...origins, `Origen ${nextIdx}`]);
    setSupply([...supply, 100]);
    setCosts([...costs, new Array(destinations.length).fill(1)]);
  };

  const handleRemoveOrigin = (index) => {
    if (origins.length <= 1) return;
    setOrigins(origins.filter((_, i) => i !== index));
    setSupply(supply.filter((_, i) => i !== index));
    setCosts(costs.filter((_, i) => i !== index));
  };

  // Add / Remove Destination (Columns)
  const handleAddDestination = () => {
    const nextIdx = destinations.length + 1;
    setDestinations([...destinations, `Destino ${nextIdx}`]);
    setDemand([...demand, 100]);
    setCosts(costs.map((row) => [...row, 1]));
  };

  const handleRemoveDestination = (index) => {
    if (destinations.length <= 1) return;
    setDestinations(destinations.filter((_, j) => j !== index));
    setDemand(demand.filter((_, j) => j !== index));
    setCosts(costs.map((row) => row.filter((_, j) => j !== index)));
  };

  // Change cell value
  const handleCostChange = (i, j, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    const updated = costs.map((row, rIdx) =>
      rIdx === i ? row.map((cell, cIdx) => (cIdx === j ? num : cell)) : [...row]
    );
    setCosts(updated);
  };

  const handleSupplyChange = (i, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    const updated = [...supply];
    updated[i] = num;
    setSupply(updated);
  };

  const handleDemandChange = (j, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    const updated = [...demand];
    updated[j] = num;
    setDemand(updated);
  };

  // Balance Check
  const balanceInfo = useMemo(() => {
    return balanceTransportProblem(origins, destinations, costs, supply, demand);
  }, [origins, destinations, costs, supply, demand]);

  // Compute Solution based on chosen method
  const solution = useMemo(() => {
    const { origins: bOrig, destinations: bDest, costs: bCost, supply: bSup, demand: bDem } = balanceInfo;

    if (selectedMethod === 'VAM') {
      return solveVogel(bOrig, bDest, bCost, bSup, bDem);
    } else if (selectedMethod === 'MCM') {
      return solveMinCost(bOrig, bDest, bCost, bSup, bDem);
    } else if (selectedMethod === 'MEN') {
      return solveNorthwest(bOrig, bDest, bCost, bSup, bDem);
    } else {
      // SOLVER
      const opt = solveOptimalTransport(bOrig, bDest, bCost, bSup, bDem);
      const vogel = solveVogel(bOrig, bDest, bCost, bSup, bDem);
      return {
        ...opt,
        steps: vogel.steps,
      };
    }
  }, [balanceInfo, selectedMethod]);

  const totalSupply = supply.reduce((a, b) => a + b, 0);
  const totalDemand = demand.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Case Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Módulo 2
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Modelo de Transporte: Vogel, Costo Mínimo & Solver
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Configura orígenes, destinos, costos de transporte y analiza la asignación con penalizaciones por fila y columna, conforme a las diapositivas del Diario El Tiempo y Motores E-4.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Casos Diapositivas:
            </span>
            <button
              onClick={() => handleLoadPreset(PRESET_EL_TIEMPO)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Diapositiva 11-17: Diario El Tiempo (3×4)</span>
            </button>
            <button
              onClick={() => handleLoadPreset(PRESET_MOTORES)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Diapositiva 18-20: Motores E-4 (3×4)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table Dimension Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Orígenes (Filas):
              </span>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">
                {origins.length}
              </span>
              <button
                onClick={handleAddOrigin}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-md transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Fila
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Destinos (Columnas):
              </span>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">
                {destinations.length}
              </span>
              <button
                onClick={handleAddDestination}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-md transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Columna
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Balance Status indicator */}
            <div className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
              totalSupply === totalDemand
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                Oferta: {totalSupply} | Demanda: {totalDemand}{' '}
                {totalSupply === totalDemand ? '(Balanceado)' : '(Se añade ficticio)'}
              </span>
            </div>

            <button
              onClick={() => handleLoadPreset(PRESET_EL_TIEMPO)}
              className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restablecer El Tiempo
            </button>
          </div>
        </div>

        {/* Editable Matrix */}
        <div className="mt-4 overflow-x-auto border border-slate-300 rounded-xl shadow-inner bg-white">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-100 text-slate-800 uppercase font-bold border-b border-slate-300">
              <tr>
                <th className="p-2.5 text-left border-r border-slate-300 min-w-[140px]">
                  Origen \ Destino
                </th>
                {destinations.map((dest, j) => (
                  <th key={j} className="p-2 border-r border-slate-300 min-w-[130px]">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        value={dest}
                        onChange={(e) => {
                          const updated = [...destinations];
                          updated[j] = e.target.value;
                          setDestinations(updated);
                        }}
                        className="w-full font-bold text-center bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-blue-600 text-slate-800"
                      />
                      {destinations.length > 1 && (
                        <button
                          onClick={() => handleRemoveDestination(j)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Eliminar destino"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-2.5 bg-amber-100/70 text-amber-900 min-w-[120px]">
                  Oferta ($S_i$)
                </th>
                <th className="p-2 w-12 text-center text-slate-400">Acción</th>
              </tr>
            </thead>
            <tbody>
              {origins.map((orig, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-blue-50/20 transition">
                  {/* Origin Name Editable */}
                  <td className="p-2 text-left font-bold border-r border-slate-300 bg-slate-50">
                    <input
                      type="text"
                      value={orig}
                      onChange={(e) => {
                        const updated = [...origins];
                        updated[i] = e.target.value;
                        setOrigins(updated);
                      }}
                      className="w-full font-bold bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </td>

                  {/* Unit Costs Inputs */}
                  {destinations.map((dest, j) => (
                    <td key={j} className="p-2 border-r border-slate-200">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-slate-400 text-[11px]">$</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={costs[i]?.[j] ?? 0}
                          onChange={(e) => handleCostChange(i, j, e.target.value)}
                          className="w-16 px-1.5 py-1 font-mono font-bold text-center border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </td>
                  ))}

                  {/* Supply Input */}
                  <td className="p-2 bg-amber-50/70">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={supply[i] ?? 0}
                      onChange={(e) => handleSupplyChange(i, e.target.value)}
                      className="w-20 px-2 py-1 font-mono font-extrabold text-center text-slate-900 border border-amber-300 bg-white rounded focus:border-blue-500 focus:outline-none"
                    />
                  </td>

                  {/* Delete Row Button */}
                  <td className="p-2 text-center">
                    {origins.length > 1 && (
                      <button
                        onClick={() => handleRemoveOrigin(i)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="Eliminar origen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {/* Demand Input Row */}
              <tr className="bg-amber-100/50 font-bold border-t-2 border-slate-300">
                <td className="p-2.5 text-left border-r border-slate-300 text-amber-950 uppercase">
                  Demanda ($D_j$)
                </td>
                {destinations.map((dest, j) => (
                  <td key={j} className="p-2 border-r border-slate-200">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={demand[j] ?? 0}
                      onChange={(e) => handleDemandChange(j, e.target.value)}
                      className="w-20 px-2 py-1 font-mono font-extrabold text-center text-slate-900 border border-amber-300 bg-white rounded focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                ))}
                <td className="p-2 text-center font-mono font-extrabold text-sm text-blue-900 bg-blue-100/80">
                  {totalSupply}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Method Selector Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Selecciona el Método de Solución de Transporte:
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <button
                onClick={() => setSelectedMethod('VAM')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedMethod === 'VAM'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Método de Vogel (VAM)</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                  $23.100
                </span>
              </button>

              <button
                onClick={() => setSelectedMethod('MCM')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedMethod === 'MCM'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>2. Costo Mínimo (MCM - Diapositiva 16)</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                  $24.600
                </span>
              </button>

              <button
                onClick={() => setSelectedMethod('SOLVER')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedMethod === 'SOLVER'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>3. Solución Óptima / Solver (Diapositiva 17)</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                  $23.100 (Óptimo)
                </span>
              </button>

              <button
                onClick={() => setSelectedMethod('MEN')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedMethod === 'MEN'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>4. Esquina Noroeste (MEN)</span>
              </button>
            </div>
          </div>

          {/* Results Badge */}
          <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Costo Total Obtenido
              </span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                ${Number(solution.totalCost).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs for Visualizations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('tableau')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'tableau'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Cuadro de Transporte (Diapositiva 16)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('steps')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'steps'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Procedimiento Paso a Paso & Penalizaciones</span>
            </button>

            <button
              onClick={() => setActiveSubTab('graph')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'graph'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Gráfica de Red de Transporte (Diapositiva 11)</span>
            </button>
          </div>
        </div>

        {/* Subtab 1: Tableau */}
        {activeSubTab === 'tableau' && (
          <TransportTableau
            origins={balanceInfo.origins}
            destinations={balanceInfo.destinations}
            costs={balanceInfo.costs}
            allocations={solution.allocations}
            supply={balanceInfo.supply}
            demand={balanceInfo.demand}
            methodName={solution.methodName}
            totalCost={solution.totalCost}
            steps={solution.steps}
          />
        )}

        {/* Subtab 2: Step by step with penalties */}
        {activeSubTab === 'steps' && (
          <TransportStepByStep
            steps={solution.steps}
            origins={balanceInfo.origins}
            destinations={balanceInfo.destinations}
            costs={balanceInfo.costs}
            method={selectedMethod}
          />
        )}

        {/* Subtab 3: Bipartite Graph */}
        {activeSubTab === 'graph' && (
          <TransportBipartiteGraph
            origins={balanceInfo.origins}
            destinations={balanceInfo.destinations}
            costs={balanceInfo.costs}
            allocations={solution.allocations}
            supply={balanceInfo.supply}
            demand={balanceInfo.demand}
          />
        )}
      </div>
    </div>
  );
}
