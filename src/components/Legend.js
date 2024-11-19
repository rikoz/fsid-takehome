import React from 'react';

// Define the legend data
const legendData = [
  { color: '#FFFFFF', label: '0', range: '0' },
  { color: '#33A02C', label: '0.01 - 1', range: '0.01-1' },
  { color: '#B2DF8A', label: '1.01 - 5', range: '1.01-5' },
  { color: '#FFFF99', label: '5.01 - 10', range: '5.01-10' },
  { color: '#FFFF00', label: '10.01 - 50', range: '10.01-50' },
  { color: '#FFA6FF', label: '50.01 - 100', range: '50.01-100' },
  { color: '#FF00FF', label: '100.01 - 500', range: '100.01-500' },
  { color: '#7A0177', label: '500.01 - 1,000', range: '500.01-1000' }
];

const Legend = () => (
  <div style={{
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    zIndex: 1
  }}>
    <div style={{ 
      fontWeight: 'bold', 
      marginBottom: '5px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '5px'
    }}>
      Cassava Production
      <br />
      <span style={{ fontSize: '12px' }}>tonnes/km²</span>
    </div>
    {legendData.map(({ color, label }) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          marginRight: '8px',
          border: '1px solid #ccc'
        }} />
        <span style={{ fontSize: '12px' }}>{label}</span>
      </div>
    ))}
  </div>
);

export default Legend;