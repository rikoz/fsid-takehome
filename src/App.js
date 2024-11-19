import React, { useState, useEffect } from 'react';
import ReactMapGL, { Source, Layer, NavigationControl } from 'react-map-gl';
import Legend from './components/Legend';
import Loader from './components/Loader';
import VisibleCountriesPanel from './components/VisibleCountriesPanel';
import useGeoTiff from './hooks/use-geotiff';
import useGeoJSON from './hooks/use-geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 20,
    zoom: 3.5,
    width: '100vw',
    height: '100vh',
    // maxBounds: [[-20, -40], [60, 40]]
  });
  const [visibleCountries, setVisibleCountries] = useState([]);

  const { loading: loadingTiff, rasterLayer, bbox } = useGeoTiff('/CassavaMap_Prod_v1.tif');
  const { loading: loadingGeoJSON, geojsonData } = useGeoJSON('/country_level_cassava_production.geojson');

  const loading = loadingTiff || loadingGeoJSON;


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
        onMove={evt => setViewport(evt.viewState)}
        onViewportChange={evt => setViewport(evt.viewState)}
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
        <NavigationControl />
      </ReactMapGL>

      <VisibleCountriesPanel countries={visibleCountries} />
      <Legend />
    </>
  );
}

export default App;
