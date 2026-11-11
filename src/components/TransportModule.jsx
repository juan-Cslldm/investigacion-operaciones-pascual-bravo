import React, { useState, useMemo } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { 
  solveVogel, solveMinCost, solveNorthwest, solveOptimalTransport, 
  balanceTransportProblem 
} from '../algorithms/transportation';
import TransportTableau from './TransportTableau';
import TransportStepByStep from './TransportStepByStep';
import TransportBipartiteGraph from './TransportBipartiteGraph';

// Presets
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

  const [selectedMethod, setSelectedMethod] = useState('VAM'); // 'VAM' | 'MCM' | 'SOLVER' | 'MEN'
  const [activeSubTab, setActiveSubTab] = useState('tableau'); // 'tableau' | 'steps' | 'graph'

  const handleLoadPreset = (preset) => {
    setOrigins([...preset.origins]);
    setDestinations([...preset.destinations]);
    setCosts(preset.costs.map((r) => [...r]));
    setSupply([...preset.supply]);
    setDemand([...preset.demand]);
  };

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

  const balanceInfo = useMemo(() => {
    return balanceTransportProblem(origins, destinations, costs, supply, demand);
  }, [origins, destinations, costs, supply, demand]);

  const solution = useMemo(() => {
    const { origins: bOrig, destinations: bDest, costs: bCost, supply: bSup, demand: bDem } = balanceInfo;
    if (selectedMethod === 'VAM') {
      return solveVogel(bOrig, bDest, bCost, bSup, bDem);
    } else if (selectedMethod === 'MCM') {
      return solveMinCost(bOrig, bDest, bCost, bSup, bDem);
    } else if (selectedMethod === 'SOLVER') {
      const opt = solveOptimalTransport(bOrig, bDest, bCost, bSup, bDem);
      const vogel = solveVogel(bOrig, bDest, bCost, bSup, bDem);
      return { ...opt, steps: vogel.steps };
    } else {
      return solveNorthwest(bOrig, bDest, bCost, bSup, bDem);
    }
  }, [balanceInfo, selectedMethod]);

  const totalSupply = supply.reduce((a, b) => a + b, 0);
  const totalDemand = demand.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Modelo de Transporte · Optimización de Envíos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Asignación de recursos mediante Método de Vogel, Costo Mínimo y Solver.
          </p>
        </div>

        {/* Subtle presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1">Casos:</span>
          <button
            onClick={() => handleLoadPreset(PRESET_EL_TIEMPO)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          >
            Diario El Tiempo (3×4)
          </button>
          <button
            onClick={() => handleLoadPreset(PRESET_MOTORES)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          >
            Motores E-4
          </button>
        </div>
      </div>

      {/* Matrix Setup Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Orígenes:</span>
              <span className="font-mono text-slate-800 font-bold">{origins.length}</span>
              <button
                onClick={handleAddOrigin}
                className="px-2 py-0.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition"
              >
                + Fila
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Destinos:</span>
              <span className="font-mono text-slate-800 font-bold">{destinations.length}</span>
              <button
                onClick={handleAddDestination}
                className="px-2 py-0.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition"
              >
                + Columna
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span>Oferta: {totalSupply}</span>
            <span>·</span>
            <span>Demanda: {totalDemand}</span>
            <span>·</span>
            <span className={totalSupply === totalDemand ? 'text-slate-800 font-medium' : 'text-slate-500'}>
              {totalSupply === totalDemand ? 'Balanceado' : 'Ficticio requerido'}
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="p-2.5 text-left w-36 font-semibold">Origen \ Destino</th>
                {destinations.map((dest, j) => (
                  <th key={j} className="p-2 border-l border-slate-200 min-w-[120px]">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        value={dest}
                        onChange={(e) => {
                          const updated = [...destinations];
                          updated[j] = e.target.value;
                          setDestinations(updated);
                        }}
                        className="w-full text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none font-semibold text-slate-800"
                      />
                      {destinations.length > 1 && (
                        <button
                          onClick={() => handleRemoveDestination(j)}
                          className="text-slate-300 hover:text-slate-500 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-2.5 border-l border-slate-200 font-semibold bg-slate-100/50 w-28">
                  Oferta
                </th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {origins.map((orig, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="p-2 text-left font-sans font-medium text-slate-800 bg-slate-50/30">
                    <input
                      type="text"
                      value={orig}
                      onChange={(e) => {
                        const updated = [...origins];
                        updated[i] = e.target.value;
                        setOrigins(updated);
                      }}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none font-semibold text-slate-800"
                    />
                  </td>

                  {destinations.map((dest, j) => (
                    <td key={j} className="p-2 border-l border-slate-100">
                      <div className="flex items-center justify-center gap-0.5">
                        <span className="text-slate-300 text-[10px]">$</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={costs[i]?.[j] ?? 0}
                          onChange={(e) => handleCostChange(i, j, e.target.value)}
                          className="w-14 px-1 py-0.5 font-mono text-center border border-slate-200 rounded focus:border-slate-900 focus:outline-none"
                        />
                      </div>
                    </td>
                  ))}

                  <td className="p-2 border-l border-slate-100 bg-slate-50/40">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={supply[i] ?? 0}
                      onChange={(e) => handleSupplyChange(i, e.target.value)}
                      className="w-20 px-1.5 py-0.5 font-mono font-semibold text-center border border-slate-200 rounded focus:border-slate-900 focus:outline-none text-slate-900"
                    />
                  </td>

                  <td className="p-2 text-center font-sans">
                    {origins.length > 1 && (
                      <button
                        onClick={() => handleRemoveOrigin(i)}
                        className="text-slate-300 hover:text-slate-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {/* Demand row */}
              <tr className="bg-slate-50/70 border-t border-slate-200 font-sans font-medium">
                <td className="p-2 text-left font-semibold text-slate-800">Demanda</td>
                {destinations.map((dest, j) => (
                  <td key={j} className="p-2 border-l border-slate-100">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={demand[j] ?? 0}
                      onChange={(e) => handleDemandChange(j, e.target.value)}
                      className="w-20 px-1.5 py-0.5 font-mono font-semibold text-center border border-slate-200 rounded focus:border-slate-900 focus:outline-none text-slate-900"
                    />
                  </td>
                ))}
                <td className="p-2 border-l border-slate-100 font-mono font-bold text-slate-900 bg-slate-100/60">
                  {totalSupply}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Method Bar & Result */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedMethod('VAM')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              selectedMethod === 'VAM'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Vogel (VAM) · $23.100
          </button>
          <button
            onClick={() => setSelectedMethod('MCM')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              selectedMethod === 'MCM'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Costo Mínimo · $24.600
          </button>
          <button
            onClick={() => setSelectedMethod('SOLVER')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              selectedMethod === 'SOLVER'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Solver Óptimo · $23.100
          </button>
          <button
            onClick={() => setSelectedMethod('MEN')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              selectedMethod === 'MEN'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Esquina Noroeste
          </button>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Costo total calculado</span>
          <span className="text-lg font-bold font-mono text-slate-900">
            ${Number(solution.totalCost).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="space-y-3">
        <div className="flex items-center gap-1 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('tableau')}
            className={`pb-2.5 px-3 font-medium transition border-b-2 -mb-px ${
              activeSubTab === 'tableau'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cuadro de Transporte
          </button>
          <button
            onClick={() => setActiveSubTab('steps')}
            className={`pb-2.5 px-3 font-medium transition border-b-2 -mb-px ${
              activeSubTab === 'steps'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paso a Paso & Penalizaciones
          </button>
          <button
            onClick={() => setActiveSubTab('graph')}
            className={`pb-2.5 px-3 font-medium transition border-b-2 -mb-px ${
              activeSubTab === 'graph'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Red de Distribución
          </button>
        </div>

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
          />
        )}

        {activeSubTab === 'steps' && (
          <TransportStepByStep
            steps={solution.steps}
            origins={balanceInfo.origins}
            destinations={balanceInfo.destinations}
            costs={balanceInfo.costs}
            method={selectedMethod}
          />
        )}

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
