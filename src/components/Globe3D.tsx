import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SatelliteData, UserLocation, Language } from '../types';
import { createEarthTexture, createEarthBumpMap, latLngAltToVector3 } from '../utils/earthTexture';
import {
  ARMENIA_PEAKS,
  ARMENIA_RIVERS,
  ARMENIA_LAKES,
  ARMENIA_HIGHWAYS,
  ARMENIA_STATIONS_AND_CITIES,
} from '../data/armeniaGeoData';
import { TRANSLATIONS } from '../i18n/translations';
import {
  RotateCw,
  Navigation,
  Satellite,
  Compass,
  Layers,
  MapPin,
  Crosshair,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Mountain,
} from 'lucide-react';

interface Globe3DProps {
  satellites: SatelliteData[];
  trilaterationSatellites: SatelliteData[];
  userLocation: UserLocation;
  spoofedLocation: UserLocation | null;
  selectedSatellite: SatelliteData | null;
  language?: Language;
  onSelectSatellite: (sat: SatelliteData | null) => void;
  onOpenLocationModal?: () => void;
  onOpenSignalTimingModal?: () => void;
  onOpenHowGpsFindsMeModal?: () => void;
}

const EARTH_RADIUS = 10;
const ORBIT_SCALE_FACTOR = 0.55;

export const Globe3D: React.FC<Globe3DProps> = ({
  satellites,
  trilaterationSatellites,
  userLocation,
  spoofedLocation,
  selectedSatellite,
  language = 'en',
  onSelectSatellite,
  onOpenLocationModal,
  onOpenSignalTimingModal,
  onOpenHowGpsFindsMeModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Scene Sub-groups
  const satellitesGroupRef = useRef<THREE.Group | null>(null);
  const beamsGroupRef = useRef<THREE.Group | null>(null);
  const photonsGroupRef = useRef<THREE.Group | null>(null);
  const multilaterationGroupRef = useRef<THREE.Group | null>(null);
  const userPinGroupRef = useRef<THREE.Group | null>(null);
  const orbitsGroupRef = useRef<THREE.Group | null>(null);
  const armeniaGisGroupRef = useRef<THREE.Group | null>(null);

  // Interactive HUD States
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showArmeniaGis, setShowArmeniaGis] = useState<boolean>(true);
  const [showMultilaterationSpheres, setShowMultilaterationSpheres] = useState<boolean>(false);
  const [hoveredSatellite, setHoveredSatellite] = useState<SatelliteData | null>(null);

  const t = TRANSLATIONS[language];

  // Camera transition animation state
  const cameraTransitionRef = useRef<{
    active: boolean;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null>(null);

  // Smooth camera fly-to function
  const flyCameraTo = useCallback(
    (destPos: THREE.Vector3, destTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0), duration = 1200) => {
      if (!cameraRef.current || !controlsRef.current) return;
      cameraTransitionRef.current = {
        active: true,
        startPos: cameraRef.current.position.clone(),
        endPos: destPos,
        startTarget: controlsRef.current.target.clone(),
        endTarget: destTarget,
        startTime: performance.now(),
        duration,
      };
    },
    []
  );

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712'); // Deep space
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
    // Initial view nicely framing Europe, the Middle East, and Caucasus
    const initTargetPos = latLngAltToVector3(40.1872, 44.5152, EARTH_RADIUS * 2.8);
    camera.position.copy(initTargetPos);
    cameraRef.current = camera;

    // 3. Renderer with high performance & antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear any leftover canvases
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls (Completely unrestricted, smooth damping)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.1;
    controls.panSpeed = 0.8;
    controls.minDistance = 11.2;
    controls.maxDistance = 110;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.7;
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    sunLight.position.set(55, 30, 45);
    scene.add(sunLight);

    const specularBackLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    specularBackLight.position.set(-45, -20, -35);
    scene.add(specularBackLight);

    // 6. Deep Space Starfield
    const starsCount = 2200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      const r = 200 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const brightness = 0.4 + Math.random() * 0.6;
      starColors[i * 3] = brightness * 0.95;
      starColors[i * 3 + 1] = brightness * 0.98;
      starColors[i * 3 + 2] = brightness * 1.0;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 1.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 7. Earth Sphere Mesh with Topographical Bump Relief
    const earthTexture = createEarthTexture();
    const earthBumpMap = createEarthBumpMap();
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: earthBumpMap,
      bumpScale: 0.28,
      roughness: 0.52,
      metalness: 0.12,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.name = 'earthSphere';
    scene.add(earthMesh);

    // 8. Atmospheric Glow Shader Layer
    const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.02, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 9. Scene Hierarchy Groups
    const orbitsGroup = new THREE.Group();
    scene.add(orbitsGroup);
    orbitsGroupRef.current = orbitsGroup;

    const satellitesGroup = new THREE.Group();
    scene.add(satellitesGroup);
    satellitesGroupRef.current = satellitesGroup;

    const userPinGroup = new THREE.Group();
    scene.add(userPinGroup);
    userPinGroupRef.current = userPinGroup;

    const beamsGroup = new THREE.Group();
    scene.add(beamsGroup);
    beamsGroupRef.current = beamsGroup;

    const photonsGroup = new THREE.Group();
    scene.add(photonsGroup);
    photonsGroupRef.current = photonsGroup;

    const multilaterationGroup = new THREE.Group();
    scene.add(multilaterationGroup);
    multilaterationGroupRef.current = multilaterationGroup;

    const armeniaGisGroup = new THREE.Group();
    scene.add(armeniaGisGroup);
    armeniaGisGroupRef.current = armeniaGisGroup;

    // 10. Raycaster & Non-Blocking Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    const domElement = renderer.domElement;

    const onPointerDown = (event: PointerEvent) => {
      pointerDownPos = { x: event.clientX, y: event.clientY };
      pointerDownTime = performance.now();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!containerRef.current || !cameraRef.current || !satellitesGroupRef.current) return;
      const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
      const elapsed = performance.now() - pointerDownTime;

      // If user moved less than 5px and released in < 400ms, consider it a Click/Tap (not a drag)
      if (dist < 5 && elapsed < 450) {
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(satellitesGroupRef.current.children, true);

        if (intersects.length > 0) {
          let targetObj: THREE.Object3D | null = intersects[0].object;
          while (targetObj && !targetObj.userData?.satellite) {
            targetObj = targetObj.parent;
          }
          if (targetObj && targetObj.userData?.satellite) {
            onSelectSatellite(targetObj.userData.satellite);
            return;
          }
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!containerRef.current || !cameraRef.current || !satellitesGroupRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(satellitesGroupRef.current.children, true);

      if (intersects.length > 0) {
        let targetObj: THREE.Object3D | null = intersects[0].object;
        while (targetObj && !targetObj.userData?.satellite) {
          targetObj = targetObj.parent;
        }
        if (targetObj?.userData?.satellite) {
          setHoveredSatellite(targetObj.userData.satellite);
          domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredSatellite(null);
      domElement.style.cursor = 'grab';
    };

    const onDblClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObject(earthMesh);
      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        const dest = hitPoint.clone().normalize().multiplyScalar(EARTH_RADIUS * 2.2);
        flyCameraTo(dest, new THREE.Vector3(0, 0, 0), 1000);
      }
    };

    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('dblclick', onDblClick);

    // 11. High-Performance Render & Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Handle smooth camera interpolation
      if (cameraTransitionRef.current && cameraTransitionRef.current.active) {
        const trans = cameraTransitionRef.current;
        const elapsed = performance.now() - trans.startTime;
        const progress = Math.min(elapsed / trans.duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth cubic-like ease

        if (cameraRef.current && controlsRef.current) {
          cameraRef.current.position.lerpVectors(trans.startPos, trans.endPos, ease);
          controlsRef.current.target.lerpVectors(trans.startTarget, trans.endTarget, ease);
          controlsRef.current.update();
        }

        if (progress >= 1) {
          trans.active = false;
        }
      } else if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Animate Receiver Pin Pulse Rings
      if (userPinGroupRef.current) {
        userPinGroupRef.current.children.forEach((child) => {
          if (child.name === 'pulseRing') {
            const scale = 1 + Math.sin(time * 3.5) * 0.28;
            child.scale.set(scale, scale, scale);
          }
        });
      }

      // Animate Laser Beam Lines pulsation
      if (beamsGroupRef.current) {
        beamsGroupRef.current.children.forEach((line) => {
          if (line instanceof THREE.Line) {
            const mat = line.material as THREE.LineBasicMaterial;
            if (mat && mat.transparent) {
              mat.opacity = 0.6 + Math.sin(time * 4) * 0.3;
            }
          }
        });
      }

      // Animate Traveling Photons along Signal Beams
      if (photonsGroupRef.current) {
        photonsGroupRef.current.children.forEach((child) => {
          const { satPos, targetPos, offset } = child.userData;
          if (satPos && targetPos) {
            const progress = (time * 0.75 + offset) % 1;
            child.position.lerpVectors(satPos, targetPos, progress);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. ResizeObserver for 100% container adaptability
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('dblclick', onDblClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current && domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(domElement);
      }
    };
  }, [onSelectSatellite, flyCameraTo]);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update 3D Satellites & Orbital Planes
  useEffect(() => {
    if (!satellitesGroupRef.current || !orbitsGroupRef.current) return;

    const satGroup = satellitesGroupRef.current;
    const orbGroup = orbitsGroupRef.current;

    while (satGroup.children.length > 0) {
      satGroup.remove(satGroup.children[0]);
    }
    while (orbGroup.children.length > 0) {
      orbGroup.remove(orbGroup.children[0]);
    }

    if (!satellites.length) return;

    // Constellation Color Schemes
    const constellationColors: Record<string, number> = {
      GPS: 0x38bdf8,     // Sky Blue
      Galileo: 0x10b981, // Emerald Green
      GLONASS: 0xa855f7, // Purple
      BeiDou: 0xf97316,  // Orange
      QZSS: 0xf43f5e,    // Rose
    };

    // Shared geometries
    const satBodyGeo = new THREE.BoxGeometry(0.38, 0.38, 0.5);
    const solarPanelGeo = new THREE.BoxGeometry(1.4, 0.03, 0.4);

    satellites.forEach((sat) => {
      const r = EARTH_RADIUS + (sat.alt / 6371) * (EARTH_RADIUS * ORBIT_SCALE_FACTOR);
      const pos = latLngAltToVector3(sat.lat, sat.lng, r);

      const isTrilaterating = trilaterationSatellites.some((s) => s.id === sat.id);
      const isSelected = selectedSatellite?.id === sat.id;
      const baseColor = constellationColors[sat.constellation] || 0x38bdf8;

      const satMeshContainer = new THREE.Group();
      satMeshContainer.position.copy(pos);
      satMeshContainer.userData = { satellite: sat };

      // Satellite Central Bus
      const bodyColor = isSelected ? 0xf59e0b : isTrilaterating ? 0x10b981 : baseColor;
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bodyColor,
        metalness: 0.85,
        roughness: 0.15,
        emissive: bodyColor,
        emissiveIntensity: isSelected ? 1.0 : isTrilaterating ? 0.8 : 0.4,
      });
      const bodyMesh = new THREE.Mesh(satBodyGeo, bodyMat);
      satMeshContainer.add(bodyMesh);

      // Solar Panel Array Wings
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        metalness: 0.6,
        roughness: 0.25,
      });
      const panelsMesh = new THREE.Mesh(solarPanelGeo, panelMat);
      satMeshContainer.add(panelsMesh);

      // Transmitter Dish pointing at Earth
      const dishGeo = new THREE.ConeGeometry(0.18, 0.22, 12);
      const dishMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
      const dishMesh = new THREE.Mesh(dishGeo, dishMat);
      dishMesh.position.set(0, 0, -0.32);
      dishMesh.rotation.x = Math.PI / 2;
      satMeshContainer.add(dishMesh);

      // Selection / Active Halo Ring
      if (isTrilaterating || isSelected) {
        const haloGeo = new THREE.RingGeometry(0.55, 0.8, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0xf59e0b : 0x10b981,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.lookAt(new THREE.Vector3(0, 0, 0));
        satMeshContainer.add(haloMesh);
      }

      satMeshContainer.lookAt(new THREE.Vector3(0, 0, 0));
      satGroup.add(satMeshContainer);
    });

    // Draw standard GPS & Galileo Constellation Orbital Planes
    if (showOrbits) {
      const r = EARTH_RADIUS + (20200 / 6371) * (EARTH_RADIUS * ORBIT_SCALE_FACTOR);
      const planes = [0, 60, 120, 180, 240, 300];
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22,
      });

      planes.forEach((raan) => {
        const points: THREE.Vector3[] = [];
        const segments = 90;
        for (let i = 0; i <= segments; i++) {
          const u = (i / segments) * Math.PI * 2;
          const x0 = r * Math.cos(u);
          const y0 = r * Math.sin(u);
          const inc = THREE.MathUtils.degToRad(55);
          const raanRad = THREE.MathUtils.degToRad(raan);

          const x = x0 * Math.cos(raanRad) - y0 * Math.cos(inc) * Math.sin(raanRad);
          const z = x0 * Math.sin(raanRad) + y0 * Math.cos(inc) * Math.cos(raanRad);
          const y = y0 * Math.sin(inc);

          points.push(new THREE.Vector3(x, y, z));
        }
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbGroup.add(orbitLine);
      });
    }
  }, [satellites, trilaterationSatellites, selectedSatellite, showOrbits]);

  // Update Armenia High-Precision 3D GIS Layers
  useEffect(() => {
    if (!armeniaGisGroupRef.current) return;
    const gisGroup = armeniaGisGroupRef.current;

    while (gisGroup.children.length > 0) {
      gisGroup.remove(gisGroup.children[0]);
    }

    if (!showArmeniaGis) return;

    // 1. Armenia Mountain Peaks with 3D Cones & Height Elevation
    ARMENIA_PEAKS.forEach((peak) => {
      const peakPos = latLngAltToVector3(peak.lat, peak.lng, EARTH_RADIUS * 1.006);
      const coneGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xfef08a }); // Golden summit
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.copy(peakPos);
      coneMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), peakPos.clone().normalize());
      gisGroup.add(coneMesh);
    });

    // 2. Armenia Rivers in 3D (Araks, Hrazdan, Debed, Vorotan)
    ARMENIA_RIVERS.forEach((river) => {
      const points = river.coordinates.map((c) =>
        latLngAltToVector3(c[0], c[1], EARTH_RADIUS * 1.003)
      );
      const riverGeo = new THREE.BufferGeometry().setFromPoints(points);
      const riverMat = new THREE.LineBasicMaterial({
        color: river.id === 'river-araks' ? 0x38bdf8 : 0x0ea5e9,
        linewidth: 2,
      });
      const riverLine = new THREE.Line(riverGeo, riverMat);
      gisGroup.add(riverLine);
    });

    // 3. Strategic Highways in 3D (M1, M2, M4)
    ARMENIA_HIGHWAYS.forEach((hwy) => {
      const points = hwy.coordinates.map((c) =>
        latLngAltToVector3(c[0], c[1], EARTH_RADIUS * 1.004)
      );
      const hwyGeo = new THREE.BufferGeometry().setFromPoints(points);
      const hwyMat = new THREE.LineBasicMaterial({
        color: hwy.id === 'highway-m2' ? 0xef4444 : 0xf59e0b,
        linewidth: 2,
      });
      const hwyLine = new THREE.Line(hwyGeo, hwyMat);
      gisGroup.add(hwyLine);
    });

    // 4. Stations & Observatories Markers (Byurakan, Garni, Yerevan ARMN)
    ARMENIA_STATIONS_AND_CITIES.forEach((st) => {
      const stPos = latLngAltToVector3(st.lat, st.lng, EARTH_RADIUS * 1.005);
      const geo = new THREE.SphereGeometry(0.08, 12, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: st.type === 'observatory' ? 0xec4899 : 0x38bdf8,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(stPos);
      gisGroup.add(mesh);
    });
  }, [showArmeniaGis]);

  // Update Receiver Pins, Beams & Range Spheres
  useEffect(() => {
    if (!userPinGroupRef.current || !beamsGroupRef.current) return;

    const pinGroup = userPinGroupRef.current;
    const beamsGroup = beamsGroupRef.current;

    while (pinGroup.children.length > 0) {
      pinGroup.remove(pinGroup.children[0]);
    }
    while (beamsGroup.children.length > 0) {
      beamsGroup.remove(beamsGroup.children[0]);
    }
    if (photonsGroupRef.current) {
      while (photonsGroupRef.current.children.length > 0) {
        photonsGroupRef.current.remove(photonsGroupRef.current.children[0]);
      }
    }
    if (multilaterationGroupRef.current) {
      while (multilaterationGroupRef.current.children.length > 0) {
        multilaterationGroupRef.current.remove(multilaterationGroupRef.current.children[0]);
      }
    }

    if (!userLocation || userLocation.lat == null) return;

    // Real Receiver Pin on Earth surface
    const realSurfacePos = latLngAltToVector3(
      userLocation.lat,
      userLocation.lng,
      EARTH_RADIUS * 1.003
    );

    const pinGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(realSurfacePos);
    pinGroup.add(pinMesh);

    // Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.35, 0.55, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.name = 'pulseRing';
    ringMesh.position.copy(realSurfacePos);
    ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
    pinGroup.add(ringMesh);

    // Spoofed Pin (if active)
    let activeTargetPos = realSurfacePos;
    if (spoofedLocation) {
      const spoofSurfacePos = latLngAltToVector3(
        spoofedLocation.lat,
        spoofedLocation.lng,
        EARTH_RADIUS * 1.003
      );
      activeTargetPos = spoofSurfacePos;

      const spoofPinMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const spoofPinMesh = new THREE.Mesh(pinGeo, spoofPinMat);
      spoofPinMesh.position.copy(spoofSurfacePos);
      pinGroup.add(spoofPinMesh);

      const spoofRingMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const spoofRingMesh = new THREE.Mesh(ringGeo, spoofRingMat);
      spoofRingMesh.name = 'pulseRing';
      spoofRingMesh.position.copy(spoofSurfacePos);
      spoofRingMesh.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.add(spoofRingMesh);

      // Displacement Vector Line
      const displacementPoints = [realSurfacePos, spoofSurfacePos];
      const dispGeo = new THREE.BufferGeometry().setFromPoints(displacementPoints);
      const dispMat = new THREE.LineDashedMaterial({
        color: 0xf59e0b,
        dashSize: 0.35,
        gapSize: 0.18,
      });
      const dispLine = new THREE.Line(dispGeo, dispMat);
      dispLine.computeLineDistances();
      pinGroup.add(dispLine);
    }

    // Trilateration Laser Beams & Animated Traveling Photons
    const photonGeo = new THREE.SphereGeometry(0.22, 12, 12);
    const photonMat = new THREE.MeshBasicMaterial({
      color: spoofedLocation ? 0xf43f5e : 0x38bdf8,
    });

    trilaterationSatellites.forEach((sat, index) => {
      const r = EARTH_RADIUS + (sat.alt / 6371) * (EARTH_RADIUS * ORBIT_SCALE_FACTOR);
      const satPos = latLngAltToVector3(sat.lat, sat.lng, r);

      const beamPoints = [satPos, activeTargetPos];
      const beamGeo = new THREE.BufferGeometry().setFromPoints(beamPoints);
      const beamMat = new THREE.LineBasicMaterial({
        color: spoofedLocation ? 0xf43f5e : 0x10b981,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
      });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      beamsGroup.add(beamLine);

      if (photonsGroupRef.current) {
        const photonMesh = new THREE.Mesh(photonGeo, photonMat);
        photonMesh.userData = {
          satPos,
          targetPos: activeTargetPos,
          offset: (index * 0.22) % 1,
        };
        photonsGroupRef.current.add(photonMesh);
      }
    });

    // Multilateration 3D Range Spheres
    if (showMultilaterationSpheres && multilaterationGroupRef.current) {
      const colors = [0x38bdf8, 0x06b6d4, 0xf59e0b, 0x10b981];
      trilaterationSatellites.slice(0, 4).forEach((sat, idx) => {
        const r = EARTH_RADIUS + (sat.alt / 6371) * (EARTH_RADIUS * ORBIT_SCALE_FACTOR);
        const satPos = latLngAltToVector3(sat.lat, sat.lng, r);
        const sphereRadius = satPos.distanceTo(activeTargetPos);
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: colors[idx % colors.length],
          transparent: true,
          opacity: 0.12,
          wireframe: true,
        });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.copy(satPos);
        multilaterationGroupRef.current?.add(sphereMesh);
      });
    }
  }, [userLocation, spoofedLocation, trilaterationSatellites, showMultilaterationSpheres]);

  // Recenter / Focus Camera on User or Yerevan
  const handleFocusReceiver = () => {
    const target = spoofedLocation || userLocation;
    if (!target || target.lat == null) return;
    const targetPos = latLngAltToVector3(target.lat, target.lng, EARTH_RADIUS * 2.3);
    flyCameraTo(targetPos, new THREE.Vector3(0, 0, 0), 1000);
  };

  // Recenter Camera strictly on Armenia
  const handleFocusArmenia = () => {
    const armeniaPos = latLngAltToVector3(40.1872, 44.5152, EARTH_RADIUS * 2.2);
    flyCameraTo(armeniaPos, new THREE.Vector3(0, 0, 0), 1000);
  };

  // Zoom Controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    const currentDist = cameraRef.current.position.length();
    const newDist = THREE.MathUtils.clamp(currentDist * factor, 11.5, 100);
    const newPos = cameraRef.current.position.clone().normalize().multiplyScalar(newDist);
    flyCameraTo(newPos, new THREE.Vector3(0, 0, 0), 400);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas */}
      <div
        id="globe-3d-canvas"
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[92vw]">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl">
          {/* Spin Button */}
          <button
            id="btn-auto-rotate"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause Rotation' : 'Auto-Rotate Earth'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              autoRotate
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{t.nav?.spin || (language === 'hy' ? 'Պտտել' : language === 'ru' ? 'Вращение' : 'Spin')}</span>
          </button>

          {/* Orbits Toggle */}
          <button
            id="btn-toggle-orbits"
            onClick={() => setShowOrbits(!showOrbits)}
            title="Toggle Orbital Planes"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showOrbits
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t.satellites?.showOrbits || (language === 'hy' ? 'Ուղեծրեր' : language === 'ru' ? 'Орбиты' : 'Orbits')}</span>
          </button>

          {/* Armenia Vector GIS Layer Toggle */}
          <button
            id="btn-toggle-armenia-gis"
            onClick={() => setShowArmeniaGis(!showArmeniaGis)}
            title="Toggle Armenia Rivers, Mountains, Roads, and Stations"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showArmeniaGis
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>🇦🇲 {language === 'hy' ? 'Հայաստանի Շերտ' : language === 'ru' ? 'ГИС Армении' : 'Armenia GIS'}</span>
          </button>

          {/* Recenter View on Receiver / Yerevan */}
          <button
            id="btn-focus-receiver"
            onClick={handleFocusReceiver}
            title="Recenter View on User / Yerevan Station"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.nav?.returnToYerevan || (language === 'hy' ? 'Վերադառնալ' : language === 'ru' ? 'Центр' : 'Recenter')}</span>
          </button>

          {/* Explore Location Modal Button */}
          {onOpenLocationModal && (
            <button
              id="btn-globe-open-location"
              onClick={onOpenLocationModal}
              title="Search Country, City or Enter Coordinates"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 transition-all"
            >
              <span>🌍 {language === 'hy' ? 'Ընտրել Վայր' : language === 'ru' ? 'Выбрать локацию' : 'Explore Location'}</span>
            </button>
          )}

          {/* How GPS Finds Me */}
          {onOpenHowGpsFindsMeModal && (
            <button
              id="btn-globe-open-how-gps"
              onClick={onOpenHowGpsFindsMeModal}
              title="7-Step Positioning Guide"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-all"
            >
              <span>📡 {t.nav?.howGpsWorks || (language === 'hy' ? 'Ինչպես է աշխատում GPS-ը' : language === 'ru' ? 'Как работает GPS' : 'How GPS Finds Me')}</span>
            </button>
          )}

          {/* Multilateration Spheres Toggle */}
          <button
            id="btn-globe-toggle-spheres"
            onClick={() => setShowMultilaterationSpheres(!showMultilaterationSpheres)}
            title="Toggle 3D Multilateration Distance Spheres"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showMultilaterationSpheres
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'hy' ? 'Սֆերաներ' : language === 'ru' ? '3D Сферы' : '3D Spheres'}</span>
          </button>
        </div>

        {/* Status Pill & Visible Satellites count */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border shadow-lg ${
              spoofedLocation
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            }`}
          >
            {spoofedLocation
              ? language === 'hy'
                ? '🔴 ՍԻՄՈՒԼԱՑՎԱԾ ԱՆՈՄԱԼԻԱ'
                : language === 'ru'
                ? '🔴 СИМУЛЯЦИЯ СПУФИНГА'
                : '🔴 SIMULATED SPOOFING ANOMALY'
              : language === 'hy'
              ? '🟢 ԻՐԱԿԱՆ GPS (ՈՒՂԻՂ)'
              : language === 'ru'
              ? '🟢 РЕАЛЬНЫЙ GPS (АКТИВЕН)'
              : '🟢 REAL GPS (LIVE)'}
          </div>

          <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span>
              {language === 'hy'
                ? `Տեսանելի արբանյակներ (${trilaterationSatellites.length})`
                : language === 'ru'
                ? `Видимые спутники (${trilaterationSatellites.length})`
                : `Visible Satellites (${trilaterationSatellites.length})`}
            </span>
          </div>
        </div>
      </div>

      {/* Zoom / Camera Floating Widget (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <div className="p-1 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-1">
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFocusArmenia}
            title="Focus Armenia"
            className="p-2 text-amber-400 hover:text-amber-200 hover:bg-slate-800 rounded-xl transition-colors text-xs font-bold"
          >
            🇦🇲
          </button>
        </div>
      </div>

      {/* Selected Satellite Mini HUD Overlay */}
      {selectedSatellite && (
        <div className="absolute bottom-6 left-6 z-20 max-w-sm p-4 bg-slate-900/90 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl text-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white leading-tight">
                  {selectedSatellite.name}
                </h4>
                <p className="text-xs text-amber-400">NORAD ID #{selectedSatellite.noradId}</p>
              </div>
            </div>
            <button
              onClick={() => onSelectSatellite(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block">{t.telemetry?.latLng || 'Position'}</span>
              <span className="font-mono text-slate-200">
                {selectedSatellite.lat.toFixed(3)}°, {selectedSatellite.lng.toFixed(3)}°
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.telemetry?.altitude || 'Altitude'}</span>
              <span className="font-mono text-slate-200">{selectedSatellite.alt.toFixed(0)} km</span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.telemetry?.velocity || 'Velocity'}</span>
              <span className="font-mono text-slate-200">{selectedSatellite.velocity.toFixed(2)} km/s</span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.telemetry?.elevation || 'Elevation'}</span>
              <span className="font-mono text-slate-200">
                {selectedSatellite.elevation != null ? `${selectedSatellite.elevation.toFixed(1)}°` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.telemetry?.range || 'Distance'}</span>
              <span className="font-mono text-emerald-400">
                {selectedSatellite.distanceKm?.toFixed(1) ?? '—'} km
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{t.telemetry?.delay || 'Delay'}</span>
              <span className="font-mono text-emerald-400">
                {selectedSatellite.delayMs?.toFixed(3) ?? '—'} ms
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 mt-2">
            <button
              onClick={() => {
                const r = EARTH_RADIUS + (selectedSatellite.alt / 6371) * (EARTH_RADIUS * ORBIT_SCALE_FACTOR);
                const satPos = latLngAltToVector3(selectedSatellite.lat, selectedSatellite.lng, r * 1.35);
                flyCameraTo(satPos, new THREE.Vector3(0, 0, 0), 1000);
              }}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {language === 'hy' ? 'Դիտել Ուղեծիրը' : 'Focus Satellite'}
            </button>
            {onOpenSignalTimingModal && (
              <button
                onClick={onOpenSignalTimingModal}
                className="py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-colors"
              >
                {language === 'hy' ? 'Ազդանշան' : 'Signal'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
