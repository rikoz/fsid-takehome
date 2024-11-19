
const getBoundingBox = (viewport) => {
  const { latitude, longitude, zoom, height, width } = viewport;

  const latPerPixel = 360 / (256 * Math.pow(2, zoom));
  const lonPerPixel = 360 / (256 * Math.pow(2, zoom));

  const north = latitude + (latPerPixel * (height / 2));
  const south = latitude - (latPerPixel * (height / 2));
  const east = longitude + (lonPerPixel * (width / 2));
  const west = longitude - (lonPerPixel * (width / 2));

  return { north, south, east, west };
};

export default getBoundingBox;