import React, { useState, useEffect } from 'react';
import ReactMapGL, { Source, Layer, NavigationControl } from 'react-map-gl';
import Legend from './components/Legend';
import Loader from './components/Loader';
import VisibleCountriesPanel from './components/VisibleCountriesPanel';
import useGeoTiff from './hooks/use-geotiff';
import useGeoJSON from './hooks/use-geojson';
import getBoundingBox from './utils/getBoundingBox';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 20,
    zoom: 3.5,
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [visibleCountries, setVisibleCountries] = useState([]);

  const { loading: loadingTiff, rasterLayer, bbox } = useGeoTiff('/CassavaMap_Prod_v1.tif');
  const { loading: loadingGeoJSON, geojsonData } = useGeoJSON('/country_level_cassava_production.geojson');

  const loading = loadingTiff || loadingGeoJSON;
  
  // FINDING VISIBLE COUNTRIES
  const getVisibleCountries = () => {
    if (!geojsonData) return;
    
    const { north, south, east, west } = getBoundingBox(viewport);

    const visible = geojsonData.features.filter(country => {
      const coords = country.geometry.coordinates[0];
      return coords.some(coord => 
        coord[1] >= west && coord[1] <= east && coord[0] >= south && coord[0] <= north
      );
    });

    setVisibleCountries(visible);
  };

  useEffect(() => {
    getVisibleCountries();
  }, [viewport, geojsonData]);

  return (
    <>
      {loading && <Loader />}
      <ReactMapGL
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        projection="mercator"
        dragPan={true}
        dragRotate={false}
        scrollZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        touchDragPan={true}
        onMove={evt => setViewport({...viewport, ...evt.viewState})}
        onResize={evt => setViewport({...viewport, width: window.innerWidth, height: window.innerHeight})}
        onViewportChange={evt => setViewport({...viewport, ...evt.viewState})}
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
                'raster-opacity': 0.8,
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
            <Layer
              id="geojson-fill"
              type="fill"
              paint={{
                'fill-color': '#000000',
                'fill-opacity': 0.2
              }}
            />
          </Source>
        )}
        <NavigationControl />
      </ReactMapGL>

      <VisibleCountriesPanel countries={visibleCountries} />
      <Legend />
    </>
  );
}

export default App;
