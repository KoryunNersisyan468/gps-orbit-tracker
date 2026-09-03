declare module 'satellite.js' {
  export interface SatRec {
    satnum: string;
    epochyr: number;
    epochdays: number;
    jdsatepoch: number;
    [key: string]: any;
  }

  export interface EciVec3<T = number> {
    x: T;
    y: T;
    z: T;
  }

  export interface GeodeticLocation {
    longitude: number; // radians
    latitude: number; // radians
    height: number; // km
  }

  export interface LookAngles {
    azimuth: number; // radians
    elevation: number; // radians
    rangeSat: number; // km
  }

  export function twoline2satrec(line1: string, line2: string): SatRec;
  export function propagate(satrec: SatRec, date: Date): {
    position: EciVec3 | false;
    velocity: EciVec3 | false;
  };
  export function gstime(date: Date): number;
  export function eciToGeodetic(position: EciVec3, gstime: number): GeodeticLocation;
  export function eciToEcf(position: EciVec3, gstime: number): EciVec3;
  export function ecfToLookAngles(observerGd: GeodeticLocation, positionEcf: EciVec3): LookAngles;
  export function degreesLong(radians: number): number;
  export function degreesLat(radians: number): number;
  export function radiansToDegrees(radians: number): number;
  export function degreesToRadians(degrees: number): number;
}
