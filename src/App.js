import React, { useState, useEffect } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import Legend from './components/Legend';
import { readGeoTiff } from './utils/readGeoTiff';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 20,
    zoom: 3.5,
    width: '100vw',
    height: '100vh',
    maxBounds: [[-20, -40], [60, 40]]
  });

  const [geojsonData, setGeojsonData] = useState(null);
  const [rasterLayer, setRasterLayer] = useState(null);
  const [bbox, setBbox] = useState(null);

  useEffect(() => {
    async function loadGeoTiff() {
      try {
        const { rasterData, width, height, bbox } = await readGeoTiff('/CassavaMap_Prod_v1.tif');
        setBbox(bbox);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(width, height);
        
        const colorRamp = (value) => {
          if (value <= 0) return [255, 255, 255, 0]; // White for 0
          else if (value <= 1) return [51, 160, 44, 255]; // Green
          else if (value <= 5) return [178, 223, 138, 255]; // Light green
          else if (value <= 10) return [255, 255, 153, 255]; // Light yellow
          else if (value <= 50) return [255, 255, 0, 255]; // Yellow
          else if (value <= 100) return [255, 166, 255, 255]; // Light pink
          else if (value <= 500) return [255, 0, 255, 255]; // Magenta
          else return [122, 1, 119, 255]; // Dark purple
        };

        for (let i = 0; i < rasterData.length; i++) {
          const value = rasterData[i];
          const [r, g, b, a] = colorRamp(value);
          
          imageData.data[i * 4] = r;
          imageData.data[i * 4 + 1] = g;
          imageData.data[i * 4 + 2] = b;
          imageData.data[i * 4 + 3] = a;
        }
        
        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL();
        setRasterLayer(dataUrl);

      } catch (error) {
        console.error('Error processing GeoTIFF:', error);
      }
    }

    async function loadGeoJSON() {
      try {
        const response = await fetch('/country_level_cassava_production.geojson');
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    }

    loadGeoTiff();
    loadGeoJSON();
  }, []);

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        projection="mercator"
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        {rasterLayer && bbox && (
          <Source
            type="image"
            id="cassava-layer"
            url={rasterLayer}
            coordinates={[
              [bbox[0], bbox[3]], // top left [longitude, latitude]
              [bbox[2], bbox[3]], // top right
              [bbox[2], bbox[1]], // bottom right
              [bbox[0], bbox[1]]  // bottom left
            ]}
          >
            <Layer
              id="cassava-layer-image"
              type="raster"
              paint={{
                'raster-opacity': 1,
                'raster-fade-duration': 0,
                'raster-contrast': 0,
                'raster-brightness-min': 0,
                'raster-saturation': 0
              }}
            />
          </Source>
        )}

        {geojsonData && (
          <Source id="geojson-layer" type="geojson" data={geojsonData}>
            <Layer
              id="geojson-outline"
              type="line"
              paint={{
                'line-color': '#666666',
                'line-width': 1
              }}
            />
          </Source>
        )}
      </ReactMapGL>
      <Legend />
    </>
  );
}

export default App;
