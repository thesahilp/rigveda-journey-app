import React from 'react';

export default function MantraPanel({ mantra }) {
  if (!mantra) {
    return (
      <div className="panel">
        <h3>Welcome</h3>
        <p>Click a Mandala, Sukta or Mantra node to explore a hymn. This demo includes sample mandalas and suktas.</p>
        <p>Data source: VedaWeb (Universität zu Köln). Audio from Internet Archive where available.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>{mantra.suktaName ? `${mantra.suktaName} (${mantra.suktaId})` : mantra.id}</h3>

      <div style={{marginTop:8}}>
        <div className="mantra-sanskrit">{mantra.text_sanskrit}</div>
        <div style={{marginTop:10, fontStyle:'italic'}}>{mantra.transliteration}</div>
      </div>

      {mantra.audio && (
        <div style={{marginTop:12}}>
          <audio controls style={{width:'100%'}}>
            <source src={mantra.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div style={{marginTop:12, fontSize:13, color:'#555'}}>
        <strong>Deity:</strong> {mantra.deity || '—'}<br/>
        <strong>Source:</strong> {mantra.source_attribution || 'VedaWeb'}
      </div>

      <div style={{marginTop:14}}>
        <a href={mantra.translation_link} target="_blank" rel="noreferrer">Open translation / reference</a>
      </div>
    </div>
  );
}