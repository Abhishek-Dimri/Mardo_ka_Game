import React from 'react';
import { useSelector } from 'react-redux';

const Logs = () => {
  const logs = useSelector(state => state.game.logs) || [];
  return (
    <div className="logs-container" style={{padding:'0.5rem', fontSize:'0.85rem', lineHeight:1.3, maxHeight:'100%', overflowY:'auto'}}>
      <ul className="logs-list" style={{listStyle:'none', margin:0, padding:0}}>
        {logs.length === 0 && <li style={{opacity:0.6}}>No events yet. Roll the dice to begin.</li>}
        {logs.map(l => (
          <li key={l.id} style={{marginBottom:'4px'}}>
            <span style={{opacity:0.55, marginRight:4}}>{new Date(l.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span>
            <span>{l.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Logs;
