import {
  DetectionMetrics,
  PseudorangeComparison,
  SpoofConfig,
  UserLocation,
  SpoofingDetectionResult,
} from '../types';
import { haversineDistanceKm } from './coordinates';

/**
 * Educational Spoofing & Anomaly Detection Model
 * Evaluates multiple receiver indicators to classify navigation signal integrity:
 * 1. Inertial vs GNSS position divergence
 * 2. Kinematic velocity jump (> 1200 km/h or impossible step)
 * 3. Receiver clock bias anomaly
 * 4. Pseudorange residual consistency (RAIM)
 */
export function evaluateSpoofingDetection(
  realLocation: UserLocation,
  effectiveLocation: UserLocation,
  spoofConfig: SpoofConfig,
  pseudoranges: PseudorangeComparison[]
): DetectionMetrics {
  const reasons: string[] = [];
  let threatLevel: DetectionMetrics['threatLevel'] = 'normal';

  const deltaKm = haversineDistanceKm(
    realLocation.lat,
    realLocation.lng,
    effectiveLocation.lat,
    effectiveLocation.lng
  );
  const inertialDeltaMeters = Math.round(deltaKm * 1000);

  // 1. Position divergence check
  if (spoofConfig.isActive && deltaKm > 0.05) {
    if (deltaKm > 5) {
      reasons.push(`Significant spatial divergence detected: ${deltaKm.toFixed(1)} km from inertial dead-reckoning baseline.`);
      threatLevel = 'spoofed';
    } else {
      reasons.push(`Moderate divergence (${(deltaKm * 1000).toFixed(0)} m) between GNSS solution and inertial track.`);
      threatLevel = 'suspicious';
    }
  }

  // 2. Kinematic Jump check
  let kinematicJumpKmH = 0;
  if (spoofConfig.isActive) {
    kinematicJumpKmH = Math.min(3000, Math.round(deltaKm * 3600)); // instantaneous velocity jump
    if (kinematicJumpKmH > 800) {
      reasons.push(`Impossible kinematic acceleration / step velocity: ${kinematicJumpKmH} km/h.`);
      threatLevel = 'spoofed';
    }
  }

  // 3. Clock drift check
  const clockBiasJumpNs = spoofConfig.isActive ? Math.abs(spoofConfig.clockDriftNs) : 0;
  if (clockBiasJumpNs > 200) {
    reasons.push(`Anomalous clock bias jump of ${clockBiasJumpNs} ns detected across receiver correlation channels.`);
    if (threatLevel === 'normal') threatLevel = 'suspicious';
  }

  // 4. RAIM (Receiver Autonomous Integrity Monitoring) residual check
  let totalResidualKm = 0;
  let compromisedCount = 0;

  for (const pr of pseudoranges) {
    if (pr.isCompromised) {
      compromisedCount++;
      totalResidualKm += Math.abs(pr.deltaDistanceKm);
    }
  }

  const raimResidualMeters = Math.round((totalResidualKm / Math.max(1, compromisedCount)) * 1000);

  if (compromisedCount > 0 && raimResidualMeters > 30) {
    reasons.push(`RAIM Chi-Square test failure: ${compromisedCount} signals fail pseudorange consistency bounds (mean residual: ${raimResidualMeters} m).`);
    threatLevel = 'spoofed';
  }

  if (reasons.length === 0) {
    reasons.push('All satellite signals correlate within standard Chi-Square bounds.');
    reasons.push('Inertial dead-reckoning matches GNSS pseudorange solution.');
    reasons.push('Carrier-to-Noise density ratio (C/N0) nominal across all tracked channels.');
  }

  return {
    threatLevel,
    reasons,
    inertialDeltaMeters,
    kinematicJumpKmH,
    clockBiasJumpNs,
    raimResidualMeters,
    compromisedSignalsCount: compromisedCount,
  };
}

export function evaluateSpoofingAnomaly(
  realLocation: UserLocation,
  effectiveLocation: UserLocation,
  spoofConfig: SpoofConfig,
  pseudoranges: PseudorangeComparison[]
): SpoofingDetectionResult {
  const metrics = evaluateSpoofingDetection(
    realLocation,
    effectiveLocation,
    spoofConfig,
    pseudoranges
  );

  const raimFailed = metrics.raimResidualMeters > 30 && metrics.compromisedSignalsCount > 0;
  const velocityExceeded = metrics.kinematicJumpKmH > 800;
  const clockJumpDetected = metrics.clockBiasJumpNs > 50;
  const inertialDivergence = metrics.inertialDeltaMeters > 500;
  const snrAnomaly = spoofConfig.isActive && spoofConfig.noiseKm > 3;
  const dopplerInconsistency = spoofConfig.isActive && spoofConfig.noiseKm > 8;

  let failedChecksCount = 0;
  if (raimFailed) failedChecksCount += 2;
  if (velocityExceeded) failedChecksCount += 2;
  if (clockJumpDetected) failedChecksCount += 1.5;
  if (inertialDivergence) failedChecksCount += 2;
  if (snrAnomaly) failedChecksCount += 1;
  if (dopplerInconsistency) failedChecksCount += 1.5;

  let probabilityScore = 0;
  if (spoofConfig.isActive) {
    probabilityScore = Math.min(99, Math.max(65, Math.round(failedChecksCount * 12)));
  } else {
    probabilityScore = 2; // Nominal background false-alarm rate
  }

  let severity: SpoofingDetectionResult['severity'] = 'NORMAL';
  if (probabilityScore > 60 || spoofConfig.isActive) {
    severity = 'CRITICAL';
  } else if (probabilityScore > 25) {
    severity = 'ELEVATED';
  }

  return {
    isSpoofed: spoofConfig.isActive,
    probabilityScore,
    severity,
    checks: {
      raimFailed,
      velocityExceeded,
      clockJumpDetected,
      inertialDivergence,
      snrAnomaly,
      dopplerInconsistency,
    },
    metrics,
  };
}
