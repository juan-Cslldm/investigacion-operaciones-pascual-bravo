import React, { useState } from 'react';
import { Eye, Network, ArrowRight, Check } from 'lucide-react';

export default function TransportBipartiteGraph({
  origins,
  destinations,
  costs,
  allocations,
  supply,
  demand,
}) {
  const [viewMode, setViewMode] = useState('allocated'); // 'allocated' | 'all'
  const [hoveredNode, setHoveredNode] = useState(null); // { type: 'orig' | 'dest', index }

  if (!origins || origins.length === 0 || !destinations || destinations.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        No hay datos de transporte para graficar la red.
      </div>
    );
  }

  // Calculate layout coordinates
  const SVG_WIDTH = 850;
  const SVG_HEIGHT = Math.max(Math.max(origins.length, destinations.length) * 110 + 60, 480);

  const ORIG_X = 180;
  const DEST_X = 640;

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
    <div className="space-y-4">
      {/* Graph Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            Gráfica de Red de Transporte (Estilo Diapositiva 11)
          </h3>
          <p className="text-xs text-slate-500">
            Nodos de Suministros (Oferta) a la izquierda y Nodos de Demanda a la derecha con flechas de asignación.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setViewMode('allocated')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'allocated'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rutas Asignadas (Flujos)
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas las Rutas (Diapositiva 11)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-inner overflow-x-auto flex justify-center">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="select-none"
          style={{ minWidth: `${SVG_WIDTH}px` }}
        >
          <defs>
            {/* Arrowheads */}
            <marker
              id="transport-arrow-normal"
              viewBox="0 0 10 10"
              refX="19"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>

            <marker
              id="transport-arrow-active"
              viewBox="0 0 10 10"
              refX="20"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0.5 L 10 5 L 0 9.5 z" fill="#38bdf8" />
            </marker>

            <marker
              id="transport-arrow-highlight"
              viewBox="0 0 10 10"
              refX="20"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0.5 L 10 5 L 0 9.5 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Section Titles in SVG */}
          <text
            x={ORIG_X}
            y={28}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="14"
            fontWeight="bold"
            letterSpacing="0.5"
          >
            Nodos de Suministros (Oferta)
          </text>
          <text
            x={DEST_X}
            y={28}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="14"
            fontWeight="bold"
            letterSpacing="0.5"
          >
            Nodos de Demanda
          </text>

          {/* Render Connections / Arcs */}
          {origPositions.map((orig) => {
            return destPositions.map((dest) => {
              const qty = allocations?.[orig.index]?.[dest.index] || 0;
              const cost = costs?.[orig.index]?.[dest.index] ?? 0;
              const isAllocated = qty > 0;

              // If viewMode is 'allocated' and qty is 0, only show faint or skip
              if (viewMode === 'allocated' && !isAllocated) {
                return null;
              }

              const isHighlighted =
                hoveredNode &&
                ((hoveredNode.type === 'orig' && hoveredNode.index === orig.index) ||
                  (hoveredNode.type === 'dest' && hoveredNode.index === dest.index));

              // Arc line geometry
              const x1 = orig.x + 28;
              const y1 = orig.y;
              const x2 = dest.x - 28;
              const y2 = dest.y;

              // Midpoint for label
              const midX = (x1 + x2) / 2 + (dest.index - orig.index) * 10;
              const midY = (y1 + y2) / 2;

              let strokeColor = '#334155';
              let strokeWidth = 1;
              let marker = 'url(#transport-arrow-normal)';

              if (isAllocated) {
                strokeColor = isHighlighted ? '#f59e0b' : '#0284c7';
                strokeWidth = Math.min(Math.max(qty / 350, 2), 5);
                marker = isHighlighted
                  ? 'url(#transport-arrow-highlight)'
                  : 'url(#transport-arrow-active)';
              } else if (isHighlighted) {
                strokeColor = '#f59e0b';
                strokeWidth = 2;
                marker = 'url(#transport-arrow-highlight)';
              }

              return (
                <g key={`arc-${orig.index}-${dest.index}`} className="transition-all">
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={isAllocated || isHighlighted ? 0.9 : 0.3}
                    markerEnd={marker}
                  />

                  {/* Cost & Quantity Pill on Arc */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-22"
                      y="-11"
                      width={isAllocated ? '54' : '34'}
                      height="20"
                      rx="6"
                      fill={isAllocated ? '#0369a1' : '#1e293b'}
                      stroke={isAllocated ? '#38bdf8' : '#475569'}
                      strokeWidth="1"
                      opacity={isAllocated || isHighlighted || viewMode === 'all' ? 0.95 : 0.4}
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {isAllocated ? `${qty} | $${cost}` : `$${cost}`}
                    </text>
                  </g>
                </g>
              );
            });
          })}

          {/* Render Origin Nodes (Left side) */}
          {origPositions.map((node) => {
            const isHovered =
              hoveredNode?.type === 'orig' && hoveredNode?.index === node.index;

            return (
              <g
                key={`orig-${node.index}`}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode({ type: 'orig', index: node.index })}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {/* Text on left side of node: Supply and Name */}
                <text
                  x="-38"
                  y="-8"
                  textAnchor="end"
                  fill="#f8fafc"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {node.name}
                </text>
                <text
                  x="-38"
                  y="12"
                  textAnchor="end"
                  fill="#38bdf8"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Oferta: {node.supply}
                </text>

                {/* Node Circle (Numbered like slide 11: 1, 2, 3) */}
                <circle
                  r="26"
                  fill={isHovered ? '#0284c7' : '#0f172a'}
                  stroke={isHovered ? '#38bdf8' : '#38bdf8'}
                  strokeWidth="2.5"
                  className="transition-colors shadow-lg"
                />
                <text
                  textAnchor="middle"
                  dy="5"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="extrabold"
                  fontFamily="monospace"
                >
                  {node.nodeNumber}
                </text>
              </g>
            );
          })}

          {/* Render Destination Nodes (Right side) */}
          {destPositions.map((node) => {
            const isHovered =
              hoveredNode?.type === 'dest' && hoveredNode?.index === node.index;

            return (
              <g
                key={`dest-${node.index}`}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode({ type: 'dest', index: node.index })}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {/* Node Circle (Numbered like slide 11: 4, 5, 6, 7) */}
                <circle
                  r="26"
                  fill={isHovered ? '#0284c7' : '#0f172a'}
                  stroke={isHovered ? '#38bdf8' : '#38bdf8'}
                  strokeWidth="2.5"
                  className="transition-colors shadow-lg"
                />
                <text
                  textAnchor="middle"
                  dy="5"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="extrabold"
                  fontFamily="monospace"
                >
                  {node.nodeNumber}
                </text>

                {/* Text on right side of node: Name and Demand */}
                <text
                  x="38"
                  y="-8"
                  textAnchor="start"
                  fill="#f8fafc"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {node.name}
                </text>
                <text
                  x="38"
                  y="12"
                  textAnchor="start"
                  fill="#38bdf8"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Demanda: {node.demand}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
