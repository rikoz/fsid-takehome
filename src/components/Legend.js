import React from 'react';
import './Legend.css';

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
  <div className="legend-container">
    <div className="legend-title">
      Cassava Production
      <br />
      <span style={{ fontSize: '12px' }}>tonnes/km²</span>
    </div>
    {legendData.map(({ color, label }) => (
      <div key={label} className="legend-label">
        <div className="legend-color-box" style={{ backgroundColor: color }} />
        <span className="legend-text">{label}</span>
      </div>
    ))}
  </div>
);

export default Legend;