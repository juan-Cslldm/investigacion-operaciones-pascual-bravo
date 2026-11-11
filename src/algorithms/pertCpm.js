/**
 * Algoritmo PERT / CPM para cálculo de Red de Actividades,
 * Tiempos Tempranos (ES, EF), Tardíos (LS, LF), Holguras y Ruta Crítica.
 * Basado en la metodología de la presentación '6-Proyecto Pert-Cpm.pptx' (I.U. Pascual Bravo).
 */

export function calculatePertCpm(activitiesInput) {
  // activitiesInput: [{ id, name, duration, predecessors }]
  const cleanActivities = activitiesInput
    .filter(a => a.id && a.id.trim() !== '')
    .map(a => {
      const preds = Array.isArray(a.predecessors)
        ? a.predecessors
        : (a.predecessors || '')
            .split(',')
            .map(p => p.trim().toUpperCase())
            .filter(p => p !== '' && p !== '-');
      return {
        id: a.id.trim().toUpperCase(),
        name: a.name ? a.name.trim() : `Actividad ${a.id.trim().toUpperCase()}`,
        duration: Math.max(0, parseFloat(a.duration) || 0),
        predecessors: preds,
        successors: [],
        es: 0,
        ef: 0,
        ls: 0,
        lf: 0,
        slack: 0,
        freeSlack: 0,
        isCritical: false
      };
    });

  if (cleanActivities.length === 0) {
    return {
      activities: [],
      criticalPaths: [],
      criticalActivities: [],
      projectDuration: 0,
      nodes: [],
      links: [],
      error: 'No se ingresaron actividades válidas.'
    };
  }

  const actMap = new Map();
  cleanActivities.forEach(a => actMap.set(a.id, a));

  // Validar predecesores existentes
  for (const act of cleanActivities) {
    for (const p of act.predecessors) {
      if (!actMap.has(p)) {
        return {
          activities: [],
          criticalPaths: [],
          criticalActivities: [],
          projectDuration: 0,
          nodes: [],
          links: [],
          error: `El predecesor "${p}" de la actividad "${act.id}" no existe en la tabla.`
        };
      }
    }
  }

  // Populate successors
  cleanActivities.forEach(a => {
    a.predecessors.forEach(p => {
      const parent = actMap.get(p);
      if (parent && !parent.successors.includes(a.id)) {
        parent.successors.push(a.id);
      }
    });
  });

  // Check for cycles using Kahn's algorithm (Topological sort)
  const inDegree = new Map();
  cleanActivities.forEach(a => inDegree.set(a.id, a.predecessors.length));

  const queue = cleanActivities.filter(a => a.predecessors.length === 0);
  const topoOrder = [];

  while (queue.length > 0) {
    const curr = queue.shift();
    topoOrder.push(curr);
    for (const sId of curr.successors) {
      inDegree.set(sId, inDegree.get(sId) - 1);
      if (inDegree.get(sId) === 0) {
        queue.push(actMap.get(sId));
      }
    }
  }

  if (topoOrder.length !== cleanActivities.length) {
    return {
      activities: [],
      criticalPaths: [],
      criticalActivities: [],
      projectDuration: 0,
      nodes: [],
      links: [],
      error: 'Se detectó una dependencia circular (ciclo) en los predecesores.'
    };
  }

  // Forward Pass (Ida): Calcular ES y EF
  topoOrder.forEach(act => {
    if (act.predecessors.length === 0) {
      act.es = 0;
    } else {
      let maxEf = 0;
      act.predecessors.forEach(pId => {
        const p = actMap.get(pId);
        if (p.ef > maxEf) maxEf = p.ef;
      });
      act.es = maxEf;
    }
    act.ef = act.es + act.duration;
  });

  const projectDuration = Math.max(...cleanActivities.map(a => a.ef), 0);

  // Backward Pass (Regreso): Calcular LF y LS
  const reverseTopo = [...topoOrder].reverse();
  reverseTopo.forEach(act => {
    if (act.successors.length === 0) {
      act.lf = projectDuration;
    } else {
      let minLs = Infinity;
      act.successors.forEach(sId => {
        const s = actMap.get(sId);
        if (s.ls < minLs) minLs = s.ls;
      });
      act.lf = minLs;
    }
    act.ls = act.lf - act.duration;
    act.slack = Number((act.ls - act.es).toFixed(4));
    act.isCritical = Math.abs(act.slack) < 1e-6;

    // Free Slack (Holgura libre)
    if (act.successors.length === 0) {
      act.freeSlack = Number((projectDuration - act.ef).toFixed(4));
    } else {
      let minSuccEs = Infinity;
      act.successors.forEach(sId => {
        const s = actMap.get(sId);
        if (s.es < minSuccEs) minSuccEs = s.es;
      });
      act.freeSlack = Number((minSuccEs - act.ef).toFixed(4));
    }
  });

  // Encontrar todas las rutas críticas (desde Inicio hasta Fin)
  const criticalActivities = cleanActivities.filter(a => a.isCritical);
  const startCritical = criticalActivities.filter(a => a.predecessors.length === 0);

  const criticalPaths = [];
  function traceCritical(currentId, path) {
    const act = actMap.get(currentId);
    const criticalSuccessors = act.successors.filter(sId => actMap.get(sId).isCritical);
    if (criticalSuccessors.length === 0) {
      criticalPaths.push([...path, 'Fin']);
      return;
    }
    for (const succ of criticalSuccessors) {
      traceCritical(succ, [...path, succ]);
    }
  }

  startCritical.forEach(startAct => {
    traceCritical(startAct.id, ['Inicio', startAct.id]);
  });

  // Si ninguna es crítica explícita o vacío
  if (criticalPaths.length === 0 && cleanActivities.length > 0) {
    criticalPaths.push(['Inicio', ...criticalActivities.map(a => a.id), 'Fin']);
  }

  // Topological Layers for Network Diagram layout
  const layers = new Map();
  // Inicio is layer 0
  cleanActivities.forEach(a => {
    if (a.predecessors.length === 0) {
      layers.set(a.id, 1);
    }
  });

  topoOrder.forEach(a => {
    if (a.predecessors.length > 0) {
      const maxPredLayer = Math.max(...a.predecessors.map(p => layers.get(p) || 1));
      layers.set(a.id, maxPredLayer + 1);
    }
  });

  const maxLayer = Math.max(...cleanActivities.map(a => layers.get(a.id) || 1), 1);

  // Build nodes for network graph
  const nodes = [];
  // Dummy 'Inicio' node
  nodes.push({
    id: 'INICIO',
    name: 'Inicio',
    duration: 0,
    es: 0,
    ef: 0,
    ls: 0,
    lf: 0,
    slack: 0,
    isCritical: true,
    layer: 0
  });

  cleanActivities.forEach(a => {
    nodes.push({
      ...a,
      layer: layers.get(a.id)
    });
  });

  // Dummy 'Fin' node
  nodes.push({
    id: 'FIN',
    name: 'Fin',
    duration: 0,
    es: projectDuration,
    ef: projectDuration,
    ls: projectDuration,
    lf: projectDuration,
    slack: 0,
    isCritical: true,
    layer: maxLayer + 1
  });

  // Build links
  const links = [];
  // Connect Inicio to all activities without predecessors
  cleanActivities.forEach(a => {
    if (a.predecessors.length === 0) {
      links.push({
        source: 'INICIO',
        target: a.id,
        isCritical: a.isCritical
      });
    }
  });

  // Connect activities
  cleanActivities.forEach(a => {
    a.successors.forEach(sId => {
      const targetAct = actMap.get(sId);
      links.push({
        source: a.id,
        target: sId,
        isCritical: a.isCritical && targetAct.isCritical && a.ef === targetAct.es
      });
    });
    // If no successors, connect to Fin
    if (a.successors.length === 0) {
      links.push({
        source: a.id,
        target: 'FIN',
        isCritical: a.isCritical
      });
    }
  });

  return {
    activities: cleanActivities,
    criticalPaths,
    criticalActivities: criticalActivities.map(a => a.id),
    projectDuration,
    nodes,
    links,
    error: null
  };
}
