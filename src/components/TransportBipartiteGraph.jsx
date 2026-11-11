import React, { useState } from 'react';

export default function TransportBipartiteGraph({
  origins,
  destinations,
  costs,
  allocations,
  supply,
  demand,
}) {
  const [viewMode, setViewMode] = useState('allocated'); // 'allocated' | 'all'

  if (!origins || origins.length === 0 || !destinations || destinations.length === 0) {
    return null;
  }

  const SVG_WIDTH = 760;
  const SVG_HEIGHT = Math.max(Math.max(origins.length, destinations.length) * 90 + 60, 380);

  const ORIG_X = 160;
  const DEST_X = 580;

  const origSpacing = SVG_HEIGHT / (origins.length + 1);
  const destSpacing = SVG_HEIGHT / (destinations.length + 1);

  const origPositions = origins.map((name, i) => ({
    x: ORIG_X,
    y: (i + 1) * origSpacing,
    name,
    supply: supply[i] || 0,
    index: i,
    nodeNumber: i + 1,
  }));

  const destPositions = destinations.map((name, j) => ({
    x: DEST_X,
    y: (j + 1) * destSpacing,
    name,
    demand: demand[j] || 0,
    index: j,
    nodeNumber: origins.length + j + 1,
  }));

  return (
    <div className="space-y-3">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">
          Red bipartita: orígenes a la izquierda, destinos a la derecha.
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
          <button
            onClick={() => setViewMode('allocated')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              viewMode === 'allocated' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500'
            }`}
          >
            Rutas asignadas
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              viewMode === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500'
            }`}
          >
            Todas las rutas
          </button>
        </div>
      </div>

      {/* SVG Canvas - Warm white / slate style */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 overflow-x-auto flex justify-center">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} className="select-none">
          <defs>
            <marker
              id="transport-arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0f172a" />
            </marker>
            <marker
              id="transport-arrow-faint"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#cbd5e1" />
            </marker>
          </defs>

          {/* Arcs */}
          {origPositions.map((orig) => {
            return destPositions.map((dest) => {
              const qty = allocations?.[orig.index]?.[dest.index] || 0;
              const cost = costs?.[orig.index]?.[dest.index] ?? 0;
              const isAllocated = qty > 0;

              if (viewMode === 'allocated' && !isAllocated) return null;

              const x1 = orig.x + 20;
              const y1 = orig.y;
              const x2 = dest.x - 20;
              const y2 = dest.y;

              const midX = (x1 + x2) / 2 + (dest.index - orig.index) * 8;
              const midY = (y1 + y2) / 2;

              return (
                <g key={`arc-${orig.index}-${dest.index}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isAllocated ? '#0f172a' : '#e2e8f0'}
                    strokeWidth={isAllocated ? Math.min(Math.max(qty / 400, 1.5), 3.5) : 1}
                    markerEnd={isAllocated ? 'url(#transport-arrow)' : 'url(#transport-arrow-faint)'}
                  />

                  {/* Flow / Cost badge */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-20"
                      y="-9"
                      width={isAllocated ? '50' : '30'}
                      height="18"
                      rx="4"
                      fill="#ffffff"
                      stroke={isAllocated ? '#0f172a' : '#cbd5e1'}
                      strokeWidth="1"
                    />
                    <text
                      x="5"
                      y="3.5"
                      textAnchor="middle"
                      fill={isAllocated ? '#0f172a' : '#64748b'}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight={isAllocated ? '600' : '400'}
                    >
                      {isAllocated ? `${qty} | $${cost}` : `$${cost}`}
                    </text>
                  </g>
                </g>
              );
            });
          })}

          {/* Origins (Left) */}
          {origPositions.map((node) => (
            <g key={`orig-${node.index}`} transform={`translate(${node.x}, ${node.y})`}>
              <text x="-28" y="-4" textAnchor="end" fill="#0f172a" fontSize="12" fontWeight="600">
                {node.name}
              </text>
              <text x="-28" y="12" textAnchor="end" fill="#64748b" fontSize="10.5" fontFamily="monospace">
                S={node.supply}
              </text>

              <circle r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
              <text textAnchor="middle" dy="4" fill="#0f172a" fontSize="11" fontWeight="700" fontFamily="monospace">
                {node.nodeNumber}
              </text>
            </g>
          ))}

          {/* Destinations (Right) */}
          {destPositions.map((node) => (
            <g key={`dest-${node.index}`} transform={`translate(${node.x}, ${node.y})`}>
              <circle r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
              <text textAnchor="middle" dy="4" fill="#0f172a" fontSize="11" fontWeight="700" fontFamily="monospace">
                {node.nodeNumber}
              </text>

              <text x="28" y="-4" textAnchor="start" fill="#0f172a" fontSize="12" fontWeight="600">
                {node.name}
              </text>
              <text x="28" y="12" textAnchor="start" fill="#64748b" fontSize="10.5" fontFamily="monospace">
                D={node.demand}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
