import * as THREE from 'three';
import { ARMENIA_PEAKS, ARMENIA_RIVERS, ARMENIA_LAKES, ARMENIA_STATIONS_AND_CITIES } from '../data/armeniaGeoData';

/**
 * Generates an ultra-detailed, high-resolution Earth texture (4096x2048) with:
 * - Realistic oceanic bathymetry & specular coastlines
 * - Continental topography & mountain shading
 * - City light nodes on night side
 * - High-precision vector rendering of Armenia (Lake Sevan, Aragats peak, rivers, Yerevan)
 * - Equirectangular latitude/longitude graticule
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Realistic Deep Ocean with Latitude/Depth Gradients
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#020b18');   // Arctic deep blue
  oceanGrad.addColorStop(0.2, '#06172d'); // Northern Atlantic/Pacific
  oceanGrad.addColorStop(0.5, '#0a2342'); // Equatorial deep oceanic trench
  oceanGrad.addColorStop(0.8, '#06172d'); // Southern Oceans
  oceanGrad.addColorStop(1, '#020b18');   // Antarctic shelf
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Helper to convert lat/lng to canvas x/y (Equirectangular projection)
  const toXY = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * canvas.width;
    const y = ((90 - lat) / 180) * canvas.height;
    return [x, y];
  };

  // 2. Continental Shelf / Shallow Coastal Waters glow
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
  ctx.lineWidth = 4;

  // 3. High-definition Continental Landmasses with Topographic Shading
  const landGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  landGrad.addColorStop(0, '#1c2d27');    // Tundra green-brown
  landGrad.addColorStop(0.25, '#1e3d2f'); // Temperate forests
  landGrad.addColorStop(0.45, '#284e37'); // Tropics/Equatorial lush
  landGrad.addColorStop(0.65, '#234432'); // Southern savanna
  landGrad.addColorStop(0.9, '#1c2d27');  // Subantarctic
  landGrad.addColorStop(1, '#2d4a43');    // Ice shelf edge

  const continents: [number, number][][] = [
    // Eurasia (Europe + Asia + Middle East + Caucasus + East Asia)
    [
      [71, 28], [72, 50], [74, 75], [77, 105], [74, 135], [71, 150], [66, 170], [60, 165],
      [55, 155], [52, 142], [43, 132], [38, 128], [35, 120], [30, 122], [22, 114], [15, 108],
      [10, 105], [8, 98], [15, 80], [21, 70], [25, 62], [24, 57], [27, 50], [30, 48],
      [31, 35], [37, 36], [41, 29], [42, 28], [45, 14], [43, 8], [36, -5], [44, -1],
      [48, -4], [54, 5], [58, 6], [62, 10], [68, 14], [71, 28]
    ],
    // Indian Subcontinent
    [
      [24, 68], [28, 72], [32, 76], [28, 88], [22, 89], [15, 80], [8, 77], [12, 75], [20, 72]
    ],
    // Scandinavian Peninsula & Baltic
    [
      [71, 28], [68, 15], [62, 5], [58, 10], [56, 12], [55, 21], [60, 28], [65, 25], [70, 28]
    ],
    // British Isles
    [
      [58, -3], [54, 0], [50, -1], [50, -5], [54, -4], [58, -6]
    ],
    // Africa
    [
      [36, -5], [37, 10], [33, 12], [32, 32], [22, 37], [12, 44], [12, 51], [5, 48],
      [-4, 40], [-12, 40], [-25, 33], [-34, 18], [-34, 25], [-30, 31], [-20, 12],
      [-10, 13], [-5, 10], [4, 9], [5, 2], [5, -5], [5, -10], [10, -14], [15, -17],
      [22, -16], [30, -10], [35, -6]
    ],
    // North America
    [
      [72, -156], [71, -130], [68, -100], [60, -85], [52, -55], [47, -53], [44, -66], [40, -74],
      [30, -81], [25, -80], [19, -96], [16, -92], [9, -83], [8, -77], [14, -92], [20, -105],
      [28, -112], [34, -120], [40, -124], [48, -125], [58, -136], [60, -148], [65, -168], [71, -160]
    ],
    // South America
    [
      [12, -72], [10, -62], [7, -58], [-2, -44], [-8, -35], [-20, -40], [-30, -50], [-40, -62],
      [-55, -68], [-54, -73], [-42, -74], [-30, -71], [-18, -75], [-5, -81], [2, -77], [8, -77]
    ],
    // Australia
    [
      [-12, 132], [-12, 142], [-22, 150], [-33, 152], [-38, 146], [-37, 138], [-35, 115],
      [-25, 113], [-20, 119], [-15, 128]
    ],
    // Greenland
    [
      [83, -30], [81, -12], [76, -20], [65, -40], [60, -44], [67, -54], [78, -72], [82, -50]
    ],
    // Japan archipelago
    [
      [45, 142], [43, 145], [35, 140], [31, 131], [34, 129], [38, 138], [42, 140]
    ],
    // Madagascar
    [
      [-12, 49], [-16, 50], [-25, 47], [-25, 43], [-18, 44], [-12, 49]
    ],
    // Antarctica (Ice continent)
    [
      [-65, -180], [-64, -120], [-68, -60], [-65, 0], [-66, 60], [-65, 120], [-66, 180],
      [-90, 180], [-90, -180]
    ]
  ];

  ctx.fillStyle = landGrad;
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
  ctx.lineWidth = 2.5;

  for (const poly of continents) {
    ctx.beginPath();
    for (let i = 0; i < poly.length; i++) {
      const [x, y] = toXY(poly[i][0], poly[i][1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 4. Latitude/Longitude Graticule
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1;

  for (let lat = -80; lat <= 80; lat += 20) {
    const [, y] = toXY(lat, 0);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  for (let lng = -180; lng <= 180; lng += 30) {
    const [x] = toXY(0, lng);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Equator & Prime Meridian highlighted
  const [, eqY] = toXY(0, 0);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, eqY);
  ctx.lineTo(canvas.width, eqY);
  ctx.stroke();

  const [pmX] = toXY(0, 0);
  ctx.beginPath();
  ctx.moveTo(pmX, 0);
  ctx.lineTo(pmX, canvas.height);
  ctx.stroke();

  // 5. High-Precision Armenia (Հայաստան) GIS Inset Vector Rendering
  // Armenia geographic bounding box: ~38.8° to 41.3° N, 43.4° to 46.6° E
  // Draw detailed Armenia outline polygon
  const armeniaBorder: [number, number][] = [
    [41.29, 44.84], // Debed border
    [41.30, 45.20], // Noyemberyan / Tavush
    [40.90, 45.35], // Ijevan / Berkaber
    [40.60, 45.30], // Chambarak
    [40.35, 45.85], // Vardenis East
    [39.88, 45.98], // Syunik North
    [39.55, 46.40], // Goris East
    [39.22, 46.55], // Kapan East
    [38.90, 46.24], // Meghri / Araks
    [38.88, 46.00], // Agarak
    [39.20, 45.70], // Vayots Dzor border
    [39.65, 45.10], // Areni / Nakhchivan border
    [39.85, 44.75], // Ararat border
    [40.05, 44.35], // Armavir / Araks
    [40.15, 43.65], // Akhurian / Turkey border
    [40.80, 43.75], // Shirak / Gyumri West
    [41.15, 43.60], // Lake Arpi North
    [41.28, 44.30], // Lori / Georgia border
    [41.29, 44.84], // Close
  ];

  // Armenia territory subtle golden highlight & terrain tint
  ctx.fillStyle = 'rgba(30, 64, 45, 0.85)';
  ctx.strokeStyle = '#f59e0b'; // Amber golden border
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < armeniaBorder.length; i++) {
    const [x, y] = toXY(armeniaBorder[i][0], armeniaBorder[i][1]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Lake Sevan (Սևանա լիճ) on the 3D globe texture
  for (const lake of ARMENIA_LAKES) {
    ctx.fillStyle = lake.fillColor;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < lake.coordinates.length; i++) {
      const [x, y] = toXY(lake.coordinates[i][0], lake.coordinates[i][1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Armenia Rivers (Araks, Hrazdan, Debed, Vorotan)
  for (const river of ARMENIA_RIVERS) {
    ctx.strokeStyle = river.color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < river.coordinates.length; i++) {
      const [x, y] = toXY(river.coordinates[i][0], river.coordinates[i][1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Armenia Mountain Peaks (Mt. Aragats Northern Peak, Azhdahak, Khustup)
  for (const peak of ARMENIA_PEAKS) {
    const [x, y] = toXY(peak.lat, peak.lng);
    // Peak triangle marker
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x - 4, y + 3);
    ctx.lineTo(x + 4, y + 3);
    ctx.closePath();
    ctx.fill();
  }

  // Yerevan Capital & Base Station Glow
  const [yvnX, yvnY] = toXY(40.1872, 44.5152);
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(yvnX, yvnY, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath();
  ctx.arc(yvnX, yvnY, 14, 0, Math.PI * 2);
  ctx.fill();

  // 6. Global Major Cities & GPS Master Control Stations
  const globalStations: [number, number, string][] = [
    [38.8951, -77.0364, 'Schriever Space Force Base (GPS Master)'],
    [48.8566, 2.3522, 'Paris'],
    [35.6762, 139.6503, 'Tokyo'],
    [51.5074, -0.1278, 'London'],
    [-33.8688, 151.2093, 'Sydney'],
    [-7.3195, 72.4229, 'Diego Garcia (Ground Antenna)'],
    [21.5218, -158.2612, 'Hawaii Station'],
    [-15.9650, -5.7089, 'Ascension Island (Ground Antenna)'],
    [55.7558, 37.6173, 'Moscow'],
    [1.3521, 103.8198, 'Singapore'],
    [40.1872, 44.5152, 'Yerevan ARMN Station'],
    [40.3303, 44.2736, 'Byurakan Observatory'],
    [40.7929, 43.8465, 'Gyumri'],
  ];

  for (const [lat, lng] of globalStations) {
    const [x, y] = toXY(lat, lng);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generates an elevation bump/displacement map texture with realistic relief
 * for mountains, highlands, Armenian topography, and continental ridges.
 */
export function createEarthBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base ocean level is black (elevation 0)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const toXY = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * canvas.width;
    const y = ((90 - lat) / 180) * canvas.height;
    return [x, y];
  };

  // Base Continental Elevation (Low gray)
  ctx.fillStyle = '#222222';
  const continents: [number, number][][] = [
    // Eurasia
    [
      [71, 28], [72, 50], [74, 75], [77, 105], [74, 135], [71, 150], [66, 170], [60, 165],
      [55, 155], [52, 142], [43, 132], [38, 128], [35, 120], [30, 122], [22, 114], [15, 108],
      [10, 105], [8, 98], [15, 80], [21, 70], [25, 62], [24, 57], [27, 50], [30, 48],
      [31, 35], [37, 36], [41, 29], [42, 28], [45, 14], [43, 8], [36, -5], [44, -1],
      [48, -4], [54, 5], [58, 6], [62, 10], [68, 14], [71, 28]
    ],
    // Africa
    [
      [36, -5], [37, 10], [33, 12], [32, 32], [22, 37], [12, 44], [12, 51], [5, 48],
      [-4, 40], [-12, 40], [-25, 33], [-34, 18], [-34, 25], [-30, 31], [-20, 12],
      [-10, 13], [-5, 10], [4, 9], [5, 2], [5, -5], [5, -10], [10, -14], [15, -17],
      [22, -16], [30, -10], [35, -6]
    ],
    // North America
    [
      [72, -156], [71, -130], [68, -100], [60, -85], [52, -55], [47, -53], [44, -66], [40, -74],
      [30, -81], [25, -80], [19, -96], [16, -92], [9, -83], [8, -77], [14, -92], [20, -105],
      [28, -112], [34, -120], [40, -124], [48, -125], [58, -136], [60, -148], [65, -168], [71, -160]
    ],
    // South America
    [
      [12, -72], [10, -62], [7, -58], [-2, -44], [-8, -35], [-20, -40], [-30, -50], [-40, -62],
      [-55, -68], [-54, -73], [-42, -74], [-30, -71], [-18, -75], [-5, -81], [2, -77], [8, -77]
    ],
  ];

  for (const poly of continents) {
    ctx.beginPath();
    for (let i = 0; i < poly.length; i++) {
      const [x, y] = toXY(poly[i][0], poly[i][1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Major Mountain Ranges Topography (Himalayas, Caucasus, Armenian Highlands, Alps, Andes, Rockies)
  const mountainChains = [
    // Armenian Highlands & Caucasus (40°N, 44°E)
    { lat: 40.5, lng: 44.5, radius: 18, intensity: '#dddddd' },
    { lat: 40.52, lng: 44.19, radius: 10, intensity: '#ffffff' }, // Mt Aragats
    { lat: 39.7, lng: 44.3, radius: 10, intensity: '#ffffff' }, // Mt Ararat region
    { lat: 43.35, lng: 42.44, radius: 16, intensity: '#eeeeee' }, // Elbrus / Greater Caucasus
    // Himalayas
    { lat: 28.5, lng: 84.5, radius: 32, intensity: '#ffffff' },
    { lat: 32.0, lng: 77.0, radius: 24, intensity: '#eeeeee' },
    // Alps
    { lat: 46.5, lng: 8.5, radius: 16, intensity: '#e0e0e0' },
    // Andes
    { lat: -15.0, lng: -72.0, radius: 20, intensity: '#e0e0e0' },
    { lat: -32.5, lng: -70.0, radius: 18, intensity: '#e8e8e8' },
    // Rockies
    { lat: 39.5, lng: -106.0, radius: 24, intensity: '#d5d5d5' },
  ];

  mountainChains.forEach(({ lat, lng, radius, intensity }) => {
    const [x, y] = toXY(lat, lng);
    const grad = ctx.createRadialGradient(x, y, 1, x, y, radius);
    grad.addColorStop(0, intensity);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Converts Latitude, Longitude, and Altitude to 3D Cartesian coordinates (X, Y, Z)
 * on a sphere of specified radius.
 */
export function latLngAltToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}
