import React from 'react';

// Milestone 3: Passing props into a reusable component
function AnimatronicCard({ character, onSelect, onSalvage, isSalvaged }) {
  return (
    <div style={{
      border: '2px solid #333',
      padding: '15px',
      margin: '10px',
      background: '#151515',
      borderRadius: '4px',
      textAlign: 'left'
    }}>
      <h3 style={{ color: '#ff0000', margin: '0 0 5px 0' }}>{character.name}</h3>
      <p style={{ color: '#aaa', margin: '0' }}>Origin: {character.game}</p>
      <p style={{ color: '#aaa', margin: '0 0 10px 0' }}>Risk Level: {character.risk}</p>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Triggering state changes on click */}
        <button onClick={() => onSelect(character.jumpscare)} style={{ background: '#330000', color: '#ff5555', border: '1px solid #ff0000', padding: '5px 10px', cursor: 'pointer' }}>
          Test Audio
        </button>
        
        <button onClick={() => onSalvage(character.name)} style={{ background: isSalvaged ? '#003300' : '#222', color: isSalvaged ? '#55ff55' : '#fff', border: '1px solid #444', padding: '5px 10px', cursor: 'pointer' }}>
          {isSalvaged ? '✅ Salvaged' : '📥 Salvage'}
        </button>
      </div>
    </div>
  );
}

export default AnimatronicCard;
