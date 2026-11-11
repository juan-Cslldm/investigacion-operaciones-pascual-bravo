import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, ShieldCheck, Flame } from 'lucide-react';

export default function NetworkDiagram({ nodes, links, criticalPaths, projectDuration }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        No hay datos para construir la red de actividades.
      </div>
    );
  }

  // Calculate layout coordinates based on topological layers
  // Layer spacing along X axis, vertical distribution along Y axis
  const layerMap = new Map();
  nodes.forEach((n) => {
    const l = n.layer ?? 0;
    if (!layerMap.has(l)) layerMap.set(l, []);
    layerMap.get(l).push(n);
  });

  const NODE_WIDTH = 130;
  const NODE_HEIGHT = 76;
  const X_SPACING = 200;
  const Y_SPACING = 110;

  const nodePositions = new Map();
  const sortedLayers = Array.from(layerMap.keys()).sort((a, b) => a - b);

  let maxNodesInLayer = 0;
  sortedLayers.forEach((l) => {
    const count = layerMap.get(l).length;
    if (count > maxNodesInLayer) maxNodesInLayer = count;
  });

  const totalHeight = Math.max(maxNodesInLayer * Y_SPACING + 100, 450);
  const totalWidth = Math.max((sortedLayers.length + 1) * X_SPACING + 100, 800);

  sortedLayers.forEach((l, colIndex) => {
    const layerNodes = layerMap.get(l);
    const layerHeight = layerNodes.length * Y_SPACING;
    const startY = (totalHeight - layerHeight) / 2 + 30;

    layerNodes.forEach((n, rowIndex) => {
      const x = 50 + colIndex * X_SPACING;
      const y = startY + rowIndex * Y_SPACING;
      nodePositions.set(n.id, { x, y });
    });
  });

  // Pan and drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="space-y-3">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            Red de Actividades (AON - Diapositiva 22, 26 y 33)
          </h3>
          <p className="text-xs text-slate-500">
            Formato estándar CPM: Tiempos más tempranos (ES, EF) arriba, tiempos tardíos (LS, LF) y duración abajo. Holgura en la base.
          </p>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
            title="Acercar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-600 px-1.5 min-w-[45px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
            title="Alejar (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 40, y: 30 });
            }}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition flex items-center gap-1 text-xs"
            title="Restablecer Vista"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[520px] bg-slate-900 rounded-xl border border-slate-800 shadow-inner overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-1.5 z-10 shadow-lg">
          <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Leyenda de la Red:
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-rose-500 shadow-sm shadow-rose-500"></div>
            <span className="font-semibold text-rose-300">Ruta Crítica (H = 0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-slate-500"></div>
            <span>Actividad no crítica</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
            [ES | ID | EF] / [LS | Dur | LF]
          </div>
        </div>

        {/* SVG Drawing */}
        <svg
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Arrow marker for non-critical */}
            <marker
              id="arrow-normal"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>
            {/* Arrow marker for critical */}
            <marker
              id="arrow-critical"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0.5 L 10 5 L 0 9.5 z" fill="#f43f5e" />
            </marker>
            {/* Glow filter for critical elements */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
          >
            {/* Render Links (Arrows) */}
            {links.map((link, idx) => {
              const srcPos = nodePositions.get(link.source);
              const tgtPos = nodePositions.get(link.target);
              if (!srcPos || !tgtPos) return null;

              const x1 = srcPos.x + NODE_WIDTH;
              const y1 = srcPos.y + NODE_HEIGHT / 2;
              const x2 = tgtPos.x;
              const y2 = tgtPos.y + NODE_HEIGHT / 2;

              // Smooth Bezier Curve
              const dx = x2 - x1;
              const cx1 = x1 + dx * 0.45;
              const cy1 = y1;
              const cx2 = x2 - dx * 0.45;
              const cy2 = y2;
              const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

              return (
                <g key={`link-${idx}`}>
                  {/* Background wider line for critical glow */}
                  {link.isCritical && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="5"
                      strokeOpacity="0.3"
                    />
                  )}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={link.isCritical ? '#f43f5e' : '#475569'}
                    strokeWidth={link.isCritical ? '2.5' : '1.5'}
                    markerEnd={`url(#${link.isCritical ? 'arrow-critical' : 'arrow-normal'})`}
                    className="transition-colors"
                  />
                </g>
              );
            })}

            {/* Render Nodes (Activity Boxes) */}
            {nodes.map((node) => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;

              const isCrit = node.isCritical;
              const isSpecial = node.id === 'INICIO' || node.id === 'FIN';

              return (
                <g
                  key={`node-${node.id}`}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                >
                  {/* Outer box */}
                  <rect
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx="8"
                    ry="8"
                    fill={isCrit ? '#1e1b2e' : '#0f172a'}
                    stroke={isCrit ? '#f43f5e' : '#334155'}
                    strokeWidth={isCrit ? '2.5' : '1.5'}
                    filter={isCrit ? 'url(#glow)' : undefined}
                    className="transition-all"
                  />

                  {/* Horizontal dividing lines */}
                  <line
                    x1="0"
                    y1={NODE_HEIGHT * 0.42}
                    x2={NODE_WIDTH}
                    y2={NODE_HEIGHT * 0.42}
                    stroke={isCrit ? '#881337' : '#1e293b'}
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1={NODE_HEIGHT * 0.76}
                    x2={NODE_WIDTH}
                    y2={NODE_HEIGHT * 0.76}
                    stroke={isCrit ? '#881337' : '#1e293b'}
                    strokeWidth="1"
                  />

                  {/* Vertical dividers in top section */}
                  <line
                    x1={NODE_WIDTH * 0.3}
                    y1="0"
                    x2={NODE_WIDTH * 0.3}
                    y2={NODE_HEIGHT * 0.42}
                    stroke={isCrit ? '#881337' : '#1e293b'}
                    strokeWidth="1"
                  />
                  <line
                    x1={NODE_WIDTH * 0.7}
                    y1="0"
                    x2={NODE_WIDTH * 0.7}
                    y2={NODE_HEIGHT * 0.42}
                    stroke={isCrit ? '#881337' : '#1e293b'}
                    strokeWidth="1"
                  />

                  {/* Vertical dividers in middle section */}
                  <line
                    x1={NODE_WIDTH * 0.3}
                    y1={NODE_HEIGHT * 0.42}
                    x2={NODE_WIDTH * 0.3}
                    y2={NODE_HEIGHT * 0.76}
                    stroke={isCrit ? '#881337' : '#1e293b'}
                    strokeWidth="1"
                  />
                  <line
                    x1={NODE_WIDTH * 0.7}
                    y1={NODE_HEIGHT * 0.42}
                    x2={NODE_WIDTH * 0.7}
                    y2={NODE_HEIGHT * 0.76}
                    stroke={isCrit ? '#881337' : '#1e293b'}
                    strokeWidth="1"
                  />

                  {/* Text labels */}
                  {/* Top-Left: ES */}
                  <text
                    x={NODE_WIDTH * 0.15}
                    y={NODE_HEIGHT * 0.28}
                    textAnchor="middle"
                    fill={isCrit ? '#fca5a5' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.es}
                  </text>

                  {/* Top-Center: Activity ID */}
                  <text
                    x={NODE_WIDTH * 0.5}
                    y={NODE_HEIGHT * 0.28}
                    textAnchor="middle"
                    fill={isCrit ? '#ffffff' : '#f8fafc'}
                    fontSize="13"
                    fontWeight="800"
                  >
                    {node.id}
                  </text>

                  {/* Top-Right: EF */}
                  <text
                    x={NODE_WIDTH * 0.85}
                    y={NODE_HEIGHT * 0.28}
                    textAnchor="middle"
                    fill={isCrit ? '#fca5a5' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {node.ef}
                  </text>

                  {/* Mid-Left: LS */}
                  <text
                    x={NODE_WIDTH * 0.15}
                    y={NODE_HEIGHT * 0.62}
                    textAnchor="middle"
                    fill={isCrit ? '#fda4af' : '#64748b'}
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {node.ls}
                  </text>

                  {/* Mid-Center: Duration */}
                  <text
                    x={NODE_WIDTH * 0.5}
                    y={NODE_HEIGHT * 0.62}
                    textAnchor="middle"
                    fill={isCrit ? '#f43f5e' : '#38bdf8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    t={node.duration}
                  </text>

                  {/* Mid-Right: LF */}
                  <text
                    x={NODE_WIDTH * 0.85}
                    y={NODE_HEIGHT * 0.62}
                    textAnchor="middle"
                    fill={isCrit ? '#fda4af' : '#64748b'}
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {node.lf}
                  </text>

                  {/* Bottom: Slack (H) */}
                  <text
                    x={NODE_WIDTH * 0.5}
                    y={NODE_HEIGHT * 0.92}
                    textAnchor="middle"
                    fill={isCrit ? '#fb7185' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {isCrit ? '★ H = 0 (CRÍTICA)' : `H = ${node.slack}`}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
