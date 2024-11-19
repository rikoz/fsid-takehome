import * as GeoTIFF from 'geotiff';

export async function readGeoTiff(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    
    // Get image properties
    const width = image.getWidth();
    const height = image.getHeight();
    const [rasterData] = await image.readRasters();
    
    // Get geotransform information
    const bbox = image.getBoundingBox();
    const resolution = image.getResolution();
    
    // Get statistics for proper scaling
    const stats = calculateStatistics(rasterData);
    
    return {
      width,
      height,
      rasterData,
      bbox,
      resolution,
      stats
    };
  } catch (error) {
    console.error('Error reading GeoTIFF:', error);
    throw error;
  }
}

function calculateStatistics(data) {
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let validCount = 0;

  // Calculate min, max, and mean, excluding NoData values
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    if (value > 0) {  // Assuming 0 or negative values are NoData
      min = Math.min(min, value);
      max = Math.max(max, value);
      sum += value;
      validCount++;
    }
  }

  const mean = sum / validCount;

  return { min, max, mean };
} 