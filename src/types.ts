export type ConstellationType = 'GPS' | 'Galileo' | 'GLONASS' | 'BeiDou' | 'QZSS';

export type Language = 'en' | 'ru' | 'hy';
export type Theme = 'dark' | 'light' | 'system';

export interface SatelliteData {
  id: string;
  name: string;
  noradId: number;
  constellation: ConstellationType;
  prn?: string;
  line1: string;
  line2: string;
  lat: number;
  lng: number;
  alt: number; // in km
  velocity: number; // in km/s
  // 3D Cartesian coordinates (Earth radius normalized)
  x: number;
  y: number;
  z: number;
  // Orbital parameters
  inclinationDeg?: number;
  periodMinutes?: number;
  eccentricity?: number;
  semiMajorAxisKm?: number;
  footprintRadiusKm?: number; // Ground visibility circle
  // Relative to active receiver
  distanceKm?: number;
  delayMs?: number;
  elevation?: number; // degrees
  azimuth?: number; // degrees
  isVisible?: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  alt: number; // in meters
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  isReal: boolean;
  name?: string;
}

export interface SpoofConfig {
  isActive: boolean;
  targetLat: number;
  targetLng: number;
  targetAlt: number;
  targetName: string;
  noiseKm: number; // artificial jitter / noise
  clockDriftNs: number; // nanoseconds drift
  affectedCount: number; // number of compromised satellites (e.g. 4, 6, or all)
  transitionSpeed: 'instant' | 'gradual';
  attackStage: 'idle' | 'lock' | 'manipulate' | 'spoofed';
}

export interface PseudorangeComparison {
  satelliteId: string;
  satelliteName: string;
  constellation: ConstellationType;
  realDistanceKm: number;
  realDelayMs: number;
  spoofedDistanceKm: number;
  spoofedDelayMs: number;
  deltaDistanceKm: number;
  deltaDelayMs: number;
  elevation: number;
  isCompromised: boolean;
}

export interface GpsErrorsConfig {
  satelliteClockError: boolean; // ~1-3m
  receiverClockError: boolean; // ~10-50m
  ionosphericDelay: boolean; // ~2-10m
  troposphericDelay: boolean; // ~2-3m
  multipath: boolean; // ~1-5m
  ephemerisError: boolean; // ~1-2m
  measurementNoise: boolean; // ~0.5m
}

export interface DopValues {
  gdop: number;
  pdop: number;
  hdop: number;
  vdop: number;
  tdop: number;
  rating: 'Ideal' | 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  satelliteCount?: number;
}

export interface DetectionMetrics {
  threatLevel: 'normal' | 'suspicious' | 'spoofed';
  reasons: string[];
  inertialDeltaMeters: number;
  kinematicJumpKmH: number;
  clockBiasJumpNs: number;
  raimResidualMeters: number;
  compromisedSignalsCount: number;
}

export interface SpoofingDetectionResult {
  isSpoofed: boolean;
  probabilityScore: number;
  severity: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  checks: {
    raimFailed: boolean;
    velocityExceeded: boolean;
    clockJumpDetected: boolean;
    inertialDivergence: boolean;
    snrAnomaly: boolean;
    dopplerInconsistency: boolean;
  };
  metrics: DetectionMetrics;
}

export interface TimeSimulationState {
  timeOffsetSeconds: number;
  simulationSpeed: number; // 0, 0.1, 1, 10, 100, 1000
  isPlaying: boolean;
  simulatedTime: Date;
}
