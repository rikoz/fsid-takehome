// src/components/VisibleCountriesPanel.js
import React from 'react';
import './VisibleCountriesPanel.css'; 

const VisibleCountriesPanel = ({ countries }) => {
  const totalPopulation = countries.reduce((sum, country) => sum + country.properties.POP_EST, 0);

  return (
    <div className="visible-countries-panel">
      <h2>Visible Countries</h2>
      <h6>Total Population: {totalPopulation.toLocaleString()}</h6>
      {countries.length === 0 ? (
        <p>No data present for countries currently visible in the viewport.</p>
      ) : (
        <ul>
          {countries.map((country, index) => (
            <li key={index}>
              {country.properties.NAME} - {country.properties.POP_EST.toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VisibleCountriesPanel;