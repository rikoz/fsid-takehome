import { useState, useEffect } from 'react';

const useGeoJSON = (filePath) => {
  const [loading, setLoading] = useState(true);
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    const loadGeoJSON = async () => {
      setLoading(true);
      try {
        const response = await fetch(filePath);
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGeoJSON();
  }, [filePath]);

  return { loading, geojsonData };
};

export default useGeoJSON;