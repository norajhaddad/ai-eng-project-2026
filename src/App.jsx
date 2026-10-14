import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import fnafData from './fnaf-data.json';
import AnimatronicCard from './AnimatronicCard';

// Page 1: Main Dex View
function DexView({ onSelect, onSalvage, salvagedList }) {
  return (
    <div>
      <h2>🗃️ Security Database Roster</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {/* Milestone 4: Rendering a list from a JSON file with .map() */}
        {fnafData.map((character) => (
          <AnimatronicCard 
            key={character.id} 
            character={character}
            onSelect={onSelect}
            onSalvage={onSalvage}
            isSalvaged={salvagedList.includes(character.name)}
          />
        ))}
      </div>
    </div>
  );
}

// Page 2: Office Inventory View (The "Cart" style state output)
function InventoryView({ salvagedList }) {
  return (
    <div>
      <h2>🔌 Parts & Service Inventory</h2>
      {salvagedList.length === 0 ? (
        <p style={{ color: '#666' }}>No animatronics salvaged yet. Office parts secure.</p>
      ) : (
        <ul style={{ textAlign: 'left', background: '#111', padding: '20px', border: '1px dashed #555' }}>
          {salvagedList.map((item, index) => (
            <li key={index} style={{ color: '#55ff55', marginBottom: '8px' }}>⚠️ Salvaged Asset: {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Main Controller Layout
function App() {
  // Milestone 3: useState variables altering screen values live
  const [monitorAlert, setMonitorAlert] = useState("SYSTEMS NOMINAL");
  const [salvagedAssets, setSalvagedAssets] = useState([]); // Cart-style collection state

  const handleSalvage = (name) => {
    if (salvagedAssets.includes(name)) {
      setSalvagedAssets(salvagedAssets.filter(item => item !== name)); // Remove if clicked again
    } else {
      setSalvagedAssets([...salvagedAssets, name]); // Add to inventory cart
    }
  };

  return (
    <BrowserRouter>
      <div style={{ padding: '30px', background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
        
        {/* Live Audio Monitor HUD element */}
        <div style={{ background: '#111', border: '1px solid #ff0000', padding: '10px', marginBottom: '20px', color: '#ff5555' }}>
          <strong>🚨 AUDIO MONITOR:</strong> {monitorAlert}
        </div>

        {/* Milestone 3: React Router Navigation Menu Links */}
        <nav style={{ marginBottom: '30px', display: 'flex', gap: '20px', fontSize: '1.2rem' }}>
          <Link to="/" style={{ color: '#00ffff', textDecoration: 'none', fontWeight: 'bold' }}>[ Main Dex ]</Link>
          <Link to="/inventory" style={{ color: '#00ffff', textDecoration: 'none', fontWeight: 'bold' }}>[ Office Inventory ({salvagedAssets.length}) ]</Link>
        </nav>

        {/* Route Definitions */}
        <Routes>
          <Route path="/" element={
            <DexView 
              onSelect={setMonitorAlert} 
              onSalvage={handleSalvage} 
              salvagedList={salvagedAssets} 
            />
          } />
          <Route path="/inventory" element={
            <InventoryView salvagedList={salvagedAssets} />
          } />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
