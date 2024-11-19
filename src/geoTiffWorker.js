self.importScripts('./utils/readGeoTiff.js');

self.onmessage = async (event) => {
  const { filePath } = event.data;
  try {
    const { rasterData, width, height, bbox } = await readGeoTiff(filePath);
    self.postMessage({ rasterData, width, height, bbox });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};