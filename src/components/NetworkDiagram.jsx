import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function NetworkDiagram({ nodes, links, criticalPaths, projectDuration }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Ingresa actividades con sus duraciones para visualizar la red.
      </div>
    );
  }

  // Group nodes by topological layer
  const layerMap = new Map();
  nodes.forEach((n) => {
    const l = n.layer ?? 0;
    if (!layerMap.has(l)) layerMap.set(l, []);
    layerMap.get(l).push(n);
  });

  const NODE_W = 120;
  const NODE_H = 72;
  const X_GAP = 180;
  const Y_GAP = 96;

  const nodePositions = new Map();
  const sortedLayers = Array.from(layerMap.keys()).sort((a, b) => a - b);

  let maxNodesInLayer = 0;
  sortedLayers.forEach((l) => {
    const count = layerMap.get(l).length;
    if (count > maxNodesInLayer) maxNodesInLayer = count;
  });

  const totalHeight = Math.max(maxNodesInLayer * Y_GAP + 80, 400);

  sortedLayers.forEach((l, colIndex) => {
    const layerNodes = layerMap.get(l);
    const layerHeight = layerNodes.length * Y_GAP;
    const startY = (totalHeight - layerHeight) / 2 + 20;

    layerNodes.forEach((n, rowIndex) => {
      const x = 40 + colIndex * X_GAP;
      const y = startY + rowIndex * Y_GAP;
      nodePositions.set(n.id, { x, y });
    });
  });

  // Pan controls
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
      {/* Subtle Controls Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            <span className="text-slate-700 font-medium">Ruta crítica (H=0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span>No crítica</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5 shadow-2xs">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1 min-w-[36px] text-center text-slate-600">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3 bg-slate-200 mx-0.5"></div>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 40, y: 30 });
            }}
            className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
            title="Centrar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas - Warm Gray Paper Background */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[460px] bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
      >
        {/* Subtle architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            {/* Elegant thin arrowheads */}
            <marker
              id="edge-normal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
            </marker>
            <marker
              id="edge-critical"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
            </marker>
          </defs>

          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ transition: isDragging ? 'none' : 'transform 0.12s ease-out' }}
          >
            {/* Links / Connectors */}
            {links.map((link, idx) => {
              const src = nodePositions.get(link.source);
              const tgt = nodePositions.get(link.target);
              if (!src || !tgt) return null;

              const x1 = src.x + NODE_W;
              const y1 = src.y + NODE_H / 2;
              const x2 = tgt.x;
              const y2 = tgt.y + NODE_H / 2;

              const dx = x2 - x1;
              const cx1 = x1 + dx * 0.45;
              const cy1 = y1;
              const cx2 = x2 - dx * 0.45;
              const cy2 = y2;
              const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

              return (
                <path
                  key={`link-${idx}`}
                  d={pathData}
                  fill="none"
                  stroke={link.isCritical ? '#0f172a' : '#cbd5e1'}
                  strokeWidth={link.isCritical ? '2' : '1.25'}
                  markerEnd={`url(#${link.isCritical ? 'edge-critical' : 'edge-normal'})`}
                />
              );
            })}

            {/* Clean Editorial Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;

              const isCrit = node.isCritical;
              const isBoundary = node.id === 'INICIO' || node.id === 'FIN';

              return (
                <g key={`node-${node.id}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* Card Body */}
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx="8"
                    ry="8"
                    fill={isCrit ? '#ffffff' : '#ffffff'}
                    stroke={isCrit ? '#0f172a' : '#e2e8f0'}
                    strokeWidth={isCrit ? '2' : '1'}
                    className="shadow-2xs"
                  />

                  {/* Horizontal dividers */}
                  <line
                    x1="0"
                    y1={NODE_H * 0.44}
                    x2={NODE_W}
                    y2={NODE_H * 0.44}
                    stroke={isCrit ? '#0f172a' : '#f1f5f9'}
                    strokeWidth={isCrit ? '1.25' : '1'}
                  />
                  <line
                    x1="0"
                    y1={NODE_H * 0.74}
                    x2={NODE_W}
                    y2={NODE_H * 0.74}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />

                  {/* Vertical dividers */}
                  <line
                    x1={NODE_W * 0.3}
                    y1="0"
                    x2={NODE_W * 0.3}
                    y2={NODE_H * 0.74}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <line
                    x1={NODE_W * 0.7}
                    y1="0"
                    x2={NODE_W * 0.7}
                    y2={NODE_H * 0.74}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />

                  {/* Top: ES | ID | EF */}
                  <text
                    x={NODE_W * 0.15}
                    y={NODE_H * 0.3}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {node.es}
                  </text>

                  <text
                    x={NODE_W * 0.5}
                    y={NODE_H * 0.31}
                    textAnchor="middle"
                    fill={isCrit ? '#0f172a' : '#334155'}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {node.id}
                  </text>

                  <text
                    x={NODE_W * 0.85}
                    y={NODE_H * 0.3}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {node.ef}
                  </text>

                  {/* Middle: LS | Duration | LF */}
                  <text
                    x={NODE_W * 0.15}
                    y={NODE_H * 0.62}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {node.ls}
                  </text>

                  <text
                    x={NODE_W * 0.5}
                    y={NODE_H * 0.62}
                    textAnchor="middle"
                    fill={isCrit ? '#0f172a' : '#64748b'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    d={node.duration}
                  </text>

                  <text
                    x={NODE_W * 0.85}
                    y={NODE_H * 0.62}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {node.lf}
                  </text>

                  {/* Bottom: Slack */}
                  <rect
                    x="0"
                    y={NODE_H * 0.74}
                    width={NODE_W}
                    height={NODE_H * 0.26}
                    rx="0"
                    fill={isCrit ? '#0f172a' : '#f8fafc'}
                    clipPath={`url(#bottom-clip-${node.id})`}
                  />
                  <text
                    x={NODE_W * 0.5}
                    y={NODE_H * 0.91}
                    textAnchor="middle"
                    fill={isCrit ? '#ffffff' : '#64748b'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight={isCrit ? '600' : '500'}
                  >
                    {isCrit ? 'Crítica · H=0' : `Holgura H=${node.slack}`}
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
