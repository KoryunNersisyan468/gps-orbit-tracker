import { DopValues, SatelliteData, UserLocation } from '../types';
import { geodeticToEcef } from './coordinates';

/**
 * Invert a symmetric 4x4 matrix using standard Gauss-Jordan elimination
 */
function invert4x4(matrix: number[][]): number[][] | null {
  const n = 4;
  const A: number[][] = matrix.map((row) => [...row]);
  const I: number[][] = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  for (let i = 0; i < n; i++) {
    let pivot = A[i][i];
    let pivotRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(pivot)) {
        pivot = A[k][i];
        pivotRow = k;
      }
    }

    if (Math.abs(pivot) < 1e-12) {
      return null; // Singular matrix
    }

    if (pivotRow !== i) {
      const tempA = A[i];
      A[i] = A[pivotRow];
      A[pivotRow] = tempA;

      const tempI = I[i];
      I[i] = I[pivotRow];
      I[pivotRow] = tempI;
    }

    const divisor = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= divisor;
      I[i][j] /= divisor;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= factor * A[i][j];
          I[k][j] -= factor * I[i][j];
        }
      }
    }
  }

  return I;
}

/**
 * Compute Dilution of Precision (DOP) metrics from visible satellites geometry
 */
export function calculateDop(satellites: SatelliteData[], userLocation: UserLocation): DopValues {
  const visibleSats = satellites.filter((s) => s.isVisible && s.elevation && s.elevation > 0);

  if (visibleSats.length < 4) {
    return {
      gdop: 99.9,
      pdop: 99.9,
      hdop: 99.9,
      vdop: 99.9,
      tdop: 99.9,
      rating: 'Poor',
    };
  }

  // Receiver position in ECEF meters
  const [rx, ry, rz] = geodeticToEcef(userLocation.lat, userLocation.lng, userLocation.alt);

  // Build Geometry Matrix G (n x 4)
  // Row i: [ -(sx_i - rx)/r_i, -(sy_i - ry)/r_i, -(sz_i - rz)/r_i, 1 ]
  const G: number[][] = [];

  for (const sat of visibleSats) {
    const [sx, sy, sz] = geodeticToEcef(sat.lat, sat.lng, sat.alt * 1000);
    const dx = sx - rx;
    const dy = sy - ry;
    const dz = sz - rz;
    const range = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (range > 0) {
      G.push([-dx / range, -dy / range, -dz / range, 1]);
    }
  }

  if (G.length < 4) {
    return {
      gdop: 99.9,
      pdop: 99.9,
      hdop: 99.9,
      vdop: 99.9,
      tdop: 99.9,
      rating: 'Poor',
    };
  }

  // Compute G^T * G (4 x 4)
  const GTG: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let sum = 0;
      for (let i = 0; i < G.length; i++) {
        sum += G[i][r] * G[i][c];
      }
      GTG[r][c] = sum;
    }
  }

  // Invert GTG to obtain covariance Q = (G^T * G)^-1
  const Q = invert4x4(GTG);

  if (!Q) {
    return {
      gdop: 99.9,
      pdop: 99.9,
      hdop: 99.9,
      vdop: 99.9,
      tdop: 99.9,
      rating: 'Poor',
    };
  }

  // Rotation from ECEF to local ENU (East, North, Up)
  const latRad = (userLocation.lat * Math.PI) / 180;
  const lngRad = (userLocation.lng * Math.PI) / 180;
  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinLng = Math.sin(lngRad);
  const cosLng = Math.cos(lngRad);

  // Rotation matrix R (3x3)
  const R = [
    [-sinLng, cosLng, 0],
    [-sinLat * cosLng, -sinLat * sinLng, cosLat],
    [cosLat * cosLng, cosLat * sinLng, sinLat],
  ];

  // Extract spatial 3x3 covariance Q_xyz
  const Qxyz = [
    [Q[0][0], Q[0][1], Q[0][2]],
    [Q[1][0], Q[1][1], Q[1][2]],
    [Q[2][0], Q[2][1], Q[2][2]],
  ];

  // Q_enu = R * Qxyz * R^T
  const RQ: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += R[i][k] * Qxyz[k][j];
      }
      RQ[i][j] = sum;
    }
  }

  const Qenu: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += RQ[i][k] * R[j][k]; // R^T[k][j] = R[j][k]
      }
      Qenu[i][j] = sum;
    }
  }

  const qEast = Math.max(0, Qenu[0][0]);
  const qNorth = Math.max(0, Qenu[1][1]);
  const qUp = Math.max(0, Qenu[2][2]);
  const qTime = Math.max(0, Q[3][3]);

  const hdop = Math.min(99.9, Math.sqrt(qEast + qNorth));
  const vdop = Math.min(99.9, Math.sqrt(qUp));
  const pdop = Math.min(99.9, Math.sqrt(qEast + qNorth + qUp));
  const tdop = Math.min(99.9, Math.sqrt(qTime));
  const gdop = Math.min(99.9, Math.sqrt(qEast + qNorth + qUp + qTime));

  let rating: DopValues['rating'] = 'Poor';
  if (gdop < 1.5) rating = 'Ideal';
  else if (gdop < 3.0) rating = 'Excellent';
  else if (gdop < 6.0) rating = 'Good';
  else if (gdop < 10.0) rating = 'Moderate';

  return {
    gdop: Number(gdop.toFixed(2)),
    pdop: Number(pdop.toFixed(2)),
    hdop: Number(hdop.toFixed(2)),
    vdop: Number(vdop.toFixed(2)),
    tdop: Number(tdop.toFixed(2)),
    rating,
  };
}

export function getDopQualityDescription(pdop: number): {
  rating: DopValues['rating'];
  color: string;
  description: string;
} {
  if (pdop < 1.5) {
    return {
      rating: 'Ideal',
      color: '#10b981', // emerald
      description: 'Optimal geometric spread; highest possible positional confidence.',
    };
  }
  if (pdop < 3.0) {
    return {
      rating: 'Excellent',
      color: '#06b6d4', // cyan
      description: 'Excellent constellation distribution suitable for precise navigation.',
    };
  }
  if (pdop < 6.0) {
    return {
      rating: 'Good',
      color: '#3b82f6', // blue
      description: 'Good positioning accuracy for standard civilian navigation.',
    };
  }
  if (pdop < 10.0) {
    return {
      rating: 'Moderate',
      color: '#f59e0b', // amber
      description: 'Moderate geometry; positioning error may reach 10-20 meters.',
    };
  }
  return {
    rating: 'Poor',
    color: '#f43f5e', // rose
    description: 'Poor satellite clustering; high geometrical dilution of precision.',
  };
}

