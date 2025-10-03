import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import data from '../data/rigveda.json';

export default function MandalaMap({ onNodeClick }) {
  const ref = useRef();

  useEffect(() => {
    const container = ref.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 700;

    // Prepare nodes and links
    const nodes = [];
    const links = [];

    data.mandalas.forEach(m => {
      nodes.push({ id: 'm' + m.id, name: m.name, type: 'mandala' });
      m.suktas.forEach(s => {
        nodes.push({ id: s.id, name: s.name, type: 'sukta', parent: 'm' + m.id, parentName: m.name });
        links.push({ source: 'm' + m.id, target: s.id });
        s.mantras.forEach(man => {
          nodes.push({ id: man.id, name: man.id, type: 'mantra', parent: s.id, parentName: s.name });
          links.push({ source: s.id, target: man.id });
        });
      });
    });

    // unique nodes by id
    const nodeMap = new Map();
    nodes.forEach(n => nodeMap.set(n.id, n));
    const uniqNodes = Array.from(nodeMap.values());

    d3.select(container).selectAll('*').remove();
    const svg = d3.select(container).append('svg')
      .attr('viewBox', [0, 0, width, height]);

    const link = svg.append('g')
      .attr('stroke', '#cfcfcf')
      .selectAll('line')
      .data(links)
      .enter().append('line');

    const node = svg.append('g')
      .selectAll('g')
      .data(uniqNodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d);
      });

    node.append('circle')
      .attr('r', d => d.type === 'mandala' ? 18 : d.type === 'sukta' ? 9 : 5)
      .attr('fill', d => d.type === 'mandala' ? '#d84315' : d.type === 'sukta' ? '#1976d2' : '#43a047')
      .attr('opacity', 0.95);

    node.append('text')
      .text(d => d.type === 'mandala' ? d.name : '')
      .attr('font-size', 12)
      .attr('dy', -22)
      .attr('text-anchor', 'middle');

    const simulation = d3.forceSimulation(uniqNodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.source.startsWith('m') && d.target.startsWith('m') ? 140 : 80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source.x))
        .attr('y1', d => (d.source.y))
        .attr('x2', d => (d.target.x))
        .attr('y2', d => (d.target.y));

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // cleanup on unmount
    return () => simulation.stop();
  }, [onNodeClick]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}