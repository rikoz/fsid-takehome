// src/components/VisibleCountriesPanel.js
import React from 'react';
import './VisibleCountriesPanel.css'; // Import the CSS for styling

const VisibleCountriesPanel = ({ countries }) => {
  return (
    <div className="visible-countries-panel">
      <h2>Visible Countries</h2>
      {countries.length === 0 ? (
        <p>No data present for countries currently visible in the viewport.</p> // Empty state message
      ) : (
        <ul>
          {countries.map(country => (
            <li key={country.properties.name}>
              {country.properties.name} - Population: {country.properties.POP_EST.toLocaleString()} {/* Display population */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VisibleCountriesPanel;