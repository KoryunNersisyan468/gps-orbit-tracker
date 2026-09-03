import { useState, useEffect, useRef, useCallback } from 'react';
import * as satellite from 'satellite.js';
import {
  ConstellationType,
  SatelliteData,
  UserLocation,
  PseudorangeComparison,
  SpoofConfig,
} from '../types';
import {
  CONSTELLATION_INFO,
  BUNDLED_CONSTELLATIONS_TLE,
} from '../data/constellations';
import { calculateFootprintRadiusKm, SPEED_OF_LIGHT_KM_S } from '../utils/coordinates';

interface RawTleItem {
  name: string;
  line1: string;
  line2: string;
  constellation: ConstellationType;
  satrec: satellite.SatRec;
}

export function useSatellites(
  userLocation: UserLocation,
  spoofedLocation: UserLocation | null,
  enabledConstellations: Record<ConstellationType, boolean>,
  simulatedTime: Date,
  spoofConfig: SpoofConfig,
  elevationMask: number = 10
) {
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [rawTleList, setRawTleList] = useState<RawTleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'live' | 'cache'>('cache');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Parse TLE string into raw list with constellation tag
  const parseTleString = useCallback(
    (tleText: string, constellation: ConstellationType): RawTleItem[] => {
      const lines = tleText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const items: RawTleItem[] = [];
      for (let i = 0; i < lines.length; i += 3) {
        if (i + 2 < lines.length) {
          const name = lines[i].replace(/^0\s+/, '').trim();
          const line1 = lines[i + 1];
          const line2 = lines[i + 2];
          try {
            const satrec = satellite.twoline2satrec(line1, line2);
            items.push({ name, line1, line2, constellation, satrec });
          } catch {
            // Skip malformed TLE
          }
        }
      }
      return items;
    },
    []
  );

  // Fetch TLE data across constellations from CelesTrak with bundled fallback
  const fetchTleData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const allItems: RawTleItem[] = [];
    let anyLiveSuccess = false;

    const constellations: ConstellationType[] = ['GPS', 'Galileo', 'GLONASS', 'BeiDou', 'QZSS'];

    for (const constell of constellations) {
      const info = CONSTELLATION_INFO[constell];
      const liveUrl = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${info.tleGroup}&FORMAT=tle`;

      let fetched = false;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(liveUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const text = await res.text();
          if (text && text.includes('1 ') && text.includes('2 ')) {
            const parsed = parseTleString(text, constell);
            if (parsed.length > 0) {
              allItems.push(...parsed);
              fetched = true;
              anyLiveSuccess = true;
            }
          }
        }
      } catch {
        // Fallback below
      }

      if (!fetched) {
        // Use high-accuracy bundled TLE for this constellation
        const bundledText = BUNDLED_CONSTELLATIONS_TLE[constell];
        if (bundledText) {
          const parsed = parseTleString(bundledText, constell);
          allItems.push(...parsed);
        }
      }
    }

    setRawTleList(allItems);
    setDataSource(anyLiveSuccess ? 'live' : 'cache');
    setLoading(false);
  }, [parseTleString]);

  // Initial load
  useEffect(() => {
    fetchTleData();
  }, [fetchTleData]);

  // Stable references for high-frequency propagation
  const userLocationRef = useRef(userLocation);
  userLocationRef.current = userLocation;

  const spoofedLocationRef = useRef(spoofedLocation);
  spoofedLocationRef.current = spoofedLocation;

  const rawTleListRef = useRef(rawTleList);
  rawTleListRef.current = rawTleList;

  const enabledConstellationsRef = useRef(enabledConstellations);
  enabledConstellationsRef.current = enabledConstellations;

  const simulatedTimeRef = useRef(simulatedTime);
  simulatedTimeRef.current = simulatedTime;

  const elevationMaskRef = useRef(elevationMask);
  elevationMaskRef.current = elevationMask;

  // Main SGP4 propagation function
  const computePositions = useCallback(() => {
    const rawList = rawTleListRef.current;
    if (!rawList.length) return;

    const time = simulatedTimeRef.current;
    const gstime = satellite.gstime(time);

    // Active receiver location
    const userLoc = userLocationRef.current;
    const spoofLoc = spoofedLocationRef.current;
    const activeTarget = spoofLoc || userLoc;
    if (!activeTarget || activeTarget.lat == null || activeTarget.lng == null) return;

    const observerGd: satellite.GeodeticLocation = {
      longitude: satellite.degreesToRadians(activeTarget.lng),
      latitude: satellite.degreesToRadians(activeTarget.lat),
      height: (activeTarget.alt || 0) / 1000,
    };

    const calculated: SatelliteData[] = [];
    const enabled = enabledConstellationsRef.current;

    for (const item of rawList) {
      // Filter out disabled constellations
      if (!enabled[item.constellation]) continue;

      try {
        const pv = satellite.propagate(item.satrec, time);
        if (!pv || !pv.position || typeof pv.position === 'boolean') {
          continue;
        }

        const posEci = pv.position;
        const velEci = pv.velocity;

        // Geodetic sub-satellite point
        const geodetic = satellite.eciToGeodetic(posEci, gstime);
        const lngDeg = satellite.degreesLong(geodetic.longitude);
        const latDeg = satellite.degreesLat(geodetic.latitude);
        const altKm = geodetic.height;

        // Velocity magnitude in km/s
        let speed = 3.87;
        if (velEci && typeof velEci !== 'boolean') {
          speed = Math.sqrt(velEci.x * velEci.x + velEci.y * velEci.y + velEci.z * velEci.z);
        }

        // Earth-Centered Fixed (ECF) coordinates
        const posEcf = satellite.eciToEcf(posEci, gstime);

        // Compute look angles from observer
        const lookAngles = satellite.ecfToLookAngles(observerGd, posEcf);
        const elevationDeg = satellite.radiansToDegrees(lookAngles.elevation);
        const azimuthDeg = satellite.radiansToDegrees(lookAngles.azimuth);
        const distanceKm = lookAngles.rangeSat;
        const delayMs = (distanceKm / SPEED_OF_LIGHT_KM_S) * 1000;
        const isVisible = elevationDeg >= (elevationMaskRef.current ?? 10);

        const noradId = parseInt(item.satrec.satnum, 10) || 0;

        // Keplerian orbital period in minutes = 2 * pi / mean_motion (rad/min)
        const meanMotionRadMin = item.satrec.no;
        const periodMinutes = meanMotionRadMin > 0 ? (2 * Math.PI) / meanMotionRadMin : 720;
        const inclinationDeg = satellite.radiansToDegrees(item.satrec.inclo);
        const eccentricity = item.satrec.ecco;
        const semiMajorAxisKm = item.satrec.a * 6378.137; // converted from Earth radii
        const footprintRadiusKm = calculateFootprintRadiusKm(altKm);

        calculated.push({
          id: `sat-${noradId}`,
          name: item.name,
          noradId,
          constellation: item.constellation,
          line1: item.line1,
          line2: item.line2,
          lat: latDeg,
          lng: lngDeg,
          alt: altKm,
          velocity: speed,
          x: posEcf.x,
          y: posEcf.y,
          z: posEcf.z,
          distanceKm,
          delayMs,
          elevation: elevationDeg,
          azimuth: azimuthDeg,
          isVisible,
          periodMinutes,
          inclinationDeg,
          eccentricity,
          semiMajorAxisKm,
          footprintRadiusKm,
        });
      } catch {
        // Skip propagation error
      }
    }

    setSatellites(calculated);
    setLastUpdated(new Date());
  }, []);

  // Compute on inputs change
  const userLat = userLocation?.lat;
  const userLng = userLocation?.lng;
  const spoofLat = spoofedLocation?.lat;
  const spoofLng = spoofedLocation?.lng;
  const isSpoofed = !!spoofedLocation;
  const timeMs = simulatedTime.getTime();
  const constellKey = JSON.stringify(enabledConstellations);

  useEffect(() => {
    if (rawTleList.length > 0) {
      computePositions();
    }
  }, [rawTleList, userLat, userLng, spoofLat, spoofLng, isSpoofed, timeMs, constellKey, elevationMask, computePositions]);

  // Real-time orbital tick every 1000ms
  useEffect(() => {
    const timer = window.setInterval(() => {
      computePositions();
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [computePositions]);

  // Filter visible satellites based on user-configured elevation mask (5°, 10°, 15°, 20°)
  const visibleSatellites = satellites
    .filter((s) => (s.elevation ?? -90) >= elevationMask)
    .sort((a, b) => (b.elevation ?? 0) - (a.elevation ?? 0));

  // Top satellites for trilateration fix (min 4, up to 8)
  const trilaterationSatellites =
    visibleSatellites.length >= 4
      ? visibleSatellites.slice(0, 8)
      : [...satellites]
          .sort((a, b) => (b.elevation ?? -90) - (a.elevation ?? -90))
          .slice(0, 8);

  // Compute pseudoranges and spoofing differences
  const pseudorangeComparisons: PseudorangeComparison[] = [];
  if (satellites.length > 0 && userLocation?.lat != null && userLocation?.lng != null) {
    const realObserverGd: satellite.GeodeticLocation = {
      longitude: satellite.degreesToRadians(userLocation.lng),
      latitude: satellite.degreesToRadians(userLocation.lat),
      height: (userLocation.alt || 0) / 1000,
    };

    const targetLoc = spoofedLocation || userLocation;
    const spoofObserverGd: satellite.GeodeticLocation = {
      longitude: satellite.degreesToRadians(targetLoc.lng),
      latitude: satellite.degreesToRadians(targetLoc.lat),
      height: (targetLoc.alt || 0) / 1000,
    };

    // Determine which satellites are affected by spoofing (either all, or up to affectedCount)
    const affectedCount = spoofConfig.affectedCount || 8;

    trilaterationSatellites.forEach((sat, idx) => {
      const positionEcf: satellite.EciVec3 = { x: sat.x, y: sat.y, z: sat.z };
      try {
        const realAngles = satellite.ecfToLookAngles(realObserverGd, positionEcf);
        const spoofAngles = satellite.ecfToLookAngles(spoofObserverGd, positionEcf);

        const realDist = realAngles.rangeSat;
        let spoofDist = spoofAngles.rangeSat;

        const isCompromised = spoofConfig.isActive && idx < affectedCount;

        if (isCompromised) {
          // Add artificial clock drift and jitter noise
          const driftKm = (spoofConfig.clockDriftNs * 1e-9) * SPEED_OF_LIGHT_KM_S;
          const noiseKm = (Math.random() - 0.5) * spoofConfig.noiseKm * 0.2;
          spoofDist += driftKm + noiseKm;
        } else if (!spoofConfig.isActive) {
          spoofDist = realDist;
        }

        const realDel = (realDist / SPEED_OF_LIGHT_KM_S) * 1000;
        const spoofDel = (spoofDist / SPEED_OF_LIGHT_KM_S) * 1000;

        pseudorangeComparisons.push({
          satelliteId: sat.id,
          satelliteName: sat.name,
          constellation: sat.constellation,
          realDistanceKm: realDist,
          realDelayMs: realDel,
          spoofedDistanceKm: spoofDist,
          spoofedDelayMs: spoofDel,
          deltaDistanceKm: spoofDist - realDist,
          deltaDelayMs: spoofDel - realDel,
          elevation: sat.elevation ?? 0,
          isCompromised,
        });
      } catch {
        // Skip
      }
    });
  }

  return {
    satellites,
    visibleSatellites,
    trilaterationSatellites,
    pseudorangeComparisons,
    loading,
    error,
    dataSource,
    lastUpdated,
    refreshTle: fetchTleData,
  };
}
