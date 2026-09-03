// Speed of light in vacuum in km/s and m/s
export const SPEED_OF_LIGHT_KM_S = 299792.458;
export const SPEED_OF_LIGHT_M_S = 299792458;
export const EARTH_RADIUS_KM = 6371.0;

// WGS84 Ellipsoid constants
const WGS84_A = 6378137.0; // semi-major axis (meters)
const WGS84_F = 1 / 298.257223563; // flattening
const WGS84_B = WGS84_A * (1 - WGS84_F); // semi-minor axis
const WGS84_E2 = (WGS84_A * WGS84_A - WGS84_B * WGS84_B) / (WGS84_A * WGS84_A); // eccentricity squared

/**
 * Convert Geodetic (Lat, Lng, Alt in meters) to ECEF (meters)
 */
export function geodeticToEcef(latDeg: number, lngDeg: number, altMeters: number): [number, number, number] {
  const latRad = (latDeg * Math.PI) / 180;
  const lngRad = (lngDeg * Math.PI) / 180;

  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinLng = Math.sin(lngRad);
  const cosLng = Math.cos(lngRad);

  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);

  const x = (N + altMeters) * cosLat * cosLng;
  const y = (N + altMeters) * cosLat * sinLng;
  const z = (N * (1 - WGS84_E2) + altMeters) * sinLat;

  return [x, y, z];
}

/**
 * Great-circle distance between two lat/lng coordinates (km)
 */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Satellite radio horizon footprint radius on Earth's surface (km)
 * Based on altitude h: cos(theta) = Re / (Re + h)
 */
export function calculateFootprintRadiusKm(altitudeKm: number): number {
  if (altitudeKm <= 0) return 0;
  const theta = Math.acos(EARTH_RADIUS_KM / (EARTH_RADIUS_KM + altitudeKm));
  return EARTH_RADIUS_KM * theta;
}

/**
 * 3D Euclidean distance in kilometers
 */
export function euclideanDistanceKm(p1: [number, number, number], p2: [number, number, number]): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
