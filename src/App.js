import React, { useState } from 'react';
import MandalaMap from './components/MandalaMap';
import MantraPanel from './components/MantraPanel';
import data from './data/rigveda.json';

export default function App() {
  const [selected, setSelected] = useState(null);

  const handleNodeClick = (node) => {
    if (!node) return;
    if (node.type === 'mantra') {
      // find mantra in data
      const mantra = data.mandalas
        .flatMap(m => m.suktas)
        .flatMap(s => s.mantras)
        .find(x => x.id === node.id);
      setSelected(mantra ? {...mantra, suktaId: node.parent, suktaName: node.parentName} : null);
    } else if (node.type === 'sukta') {
      // open first mantra of sukta
      const sukta = data.mandalas.flatMap(m => m.suktas).find(s => s.id === node.id);
      if (sukta && sukta.mantras && sukta.mantras.length) {
        setSelected({...sukta.mantras[0], suktaId: sukta.id, suktaName: sukta.name});
      } else setSelected(null);
    } else {
      setSelected(null);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Rig Veda Journey Map</h1>
        <p className="subtitle">Interactive map of Mandalas, Suktas and Mantras (Demo)</p>
      </header>
      <main className="app-main">
        <section className="map-area">
          <MandalaMap onNodeClick={handleNodeClick} />
        </section>
        <aside className="side-panel">
          <MantraPanel mantra={selected} />
        </aside>
      </main>
      <footer className="app-footer">
        <small>Data source: VedaWeb (Universität zu Köln). Audio: Internet Archive (public domain where available).</small>
      </footer>
    </div>
  );
}