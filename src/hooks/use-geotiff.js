import { useState, useEffect } from 'react';
import { readGeoTiff } from '../utils/readGeoTiff';

const useGeoTiff = (filePath) => {
  const [loading, setLoading] = useState(true);
  const [rasterLayer, setRasterLayer] = useState(null);
  const [bbox, setBbox] = useState(null);

  useEffect(() => {
    const loadGeoTiff = async () => {
      setLoading(true);
      try {
        const { rasterData, width, height, bbox } = await readGeoTiff(filePath);
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
        setBbox(bbox);
      } catch (error) {
        console.error('Error processing GeoTIFF:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGeoTiff();
  }, [filePath]);

  return { loading, rasterLayer, bbox };
};

export default useGeoTiff;