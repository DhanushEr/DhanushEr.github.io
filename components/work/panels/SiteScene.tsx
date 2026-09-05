'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type Layout = 'heuristic' | 'matched';

/**
 * Procedurally generated stand-in site — nothing here is loaded from real project
 * assets. Each plot carries the footprint it was allocated and the storey count the
 * classification step assigned to it.
 */
interface Plot {
  id: string;
  x: number;
  z: number;
  /** Plot footprint. */
  w: number;
  d: number;
  floors: number;
}

const FLOOR_H = 1.6;
/** The old approach: one capped height and one generic footprint for everything. */
const FIXED_H = 9;
const FIXED_FOOTPRINT = 5.4;

const plots: Plot[] = [
  { id: 'a', x: -9, z: -8, w: 7, d: 6, floors: 3 },
  { id: 'b', x: 0, z: -8.5, w: 5, d: 5, floors: 6 },
  { id: 'c', x: 9, z: -8, w: 6.5, d: 6, floors: 4 },
  { id: 'd', x: -9.5, z: 3, w: 6, d: 7, floors: 2 },
  { id: 'e', x: 0.5, z: 4, w: 4.4, d: 4.4, floors: 8 },
  { id: 'f', x: 9.5, z: 3.5, w: 7, d: 6.5, floors: 5 },
];

function Building({ plot, layout, night }: { plot: Plot; layout: Layout; night: boolean }) {
  const matched = layout === 'matched';
  // Matched: the model is picked to sit inside the plot. Heuristic: one generic
  // model at a capped height, which overruns the tighter plots.
  const w = matched ? plot.w * 0.78 : FIXED_FOOTPRINT;
  const d = matched ? plot.d * 0.78 : FIXED_FOOTPRINT;
  const h = matched ? plot.floors * FLOOR_H : FIXED_H;
  const overflows = !matched && (w > plot.w || d > plot.d);

  const geom = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geom), [geom]);

  const edgeColor = overflows ? '#FF6B4A' : matched ? '#3FD8C8' : '#8D99AB';
  const faceColor = night ? '#10151d' : '#1b2430';

  return (
    <group position={[plot.x, h / 2, plot.z]}>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshStandardMaterial
          color={faceColor}
          roughness={0.85}
          metalness={0.05}
          emissive={night ? new THREE.Color('#FFB020') : new THREE.Color('#000000')}
          emissiveIntensity={night ? 0.09 : 0}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={edgeColor} transparent opacity={overflows ? 0.95 : 0.65} />
      </lineSegments>
    </group>
  );
}

function PlotOutline({ plot, layout }: { plot: Plot; layout: Layout }) {
  const overruns = layout === 'heuristic' && (FIXED_FOOTPRINT > plot.w || FIXED_FOOTPRINT > plot.d);
  const points = useMemo(() => {
    const hw = plot.w / 2;
    const hd = plot.d / 2;
    return [
      new THREE.Vector3(-hw, 0, -hd),
      new THREE.Vector3(hw, 0, -hd),
      new THREE.Vector3(hw, 0, hd),
      new THREE.Vector3(-hw, 0, hd),
      new THREE.Vector3(-hw, 0, -hd),
    ];
  }, [plot.w, plot.d]);

  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <group position={[plot.x, 0.04, plot.z]}>
      <primitive object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: overruns ? '#FF6B4A' : '#3d4854' }))} />
    </group>
  );
}

function Roads({ night }: { night: boolean }) {
  const color = night ? '#161c26' : '#232c38';
  return (
    <group position={[0, 0.02, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <planeGeometry args={[40, 3]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.6, 0, 0]}>
        <planeGeometry args={[3, 34]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  );
}

/** Camera path used by the flythrough — follows the road network, not a random orbit. */
const flightCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-18, 2.4, -2),
    new THREE.Vector3(-6, 2.2, -2),
    new THREE.Vector3(4.6, 2.6, -2),
    new THREE.Vector3(4.6, 2.4, 10),
    new THREE.Vector3(4.6, 3.2, -12),
    new THREE.Vector3(-14, 3.4, -10),
  ],
  false,
  'catmullrom',
  0.35
);

function Flight({ flying, onDone }: { flying: boolean; onDone: () => void }) {
  const { camera } = useThree();
  const t = useRef(0);

  useFrame((_, delta) => {
    if (!flying) return;
    t.current = Math.min(t.current + delta * 0.075, 1);
    const p = flightCurve.getPointAt(t.current);
    const look = flightCurve.getPointAt(Math.min(t.current + 0.06, 1));
    camera.position.copy(p);
    camera.lookAt(look.x, 1.2, look.z);
    if (t.current >= 1) {
      t.current = 0;
      onDone();
    }
  });

  return null;
}

export function SiteScene({
  layout,
  night,
  flying,
  onFlightDone,
}: {
  layout: Layout;
  night: boolean;
  flying: boolean;
  onFlightDone: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [22, 17, 24], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      style={{ background: night ? '#080B10' : '#0E1116' }}
    >
      <fog attach="fog" args={[night ? '#080B10' : '#0E1116', 34, 76]} />

      <ambientLight intensity={night ? 0.22 : 0.55} />
      <hemisphereLight args={[night ? '#22304a' : '#7f93ad', '#0a0d12', night ? 0.35 : 0.7]} />
      <directionalLight
        position={[14, 20, 10]}
        intensity={night ? 0.18 : 1.15}
        color={night ? '#8fa5c7' : '#ffe4b8'}
      />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color={night ? '#0b0f15' : '#121821'} roughness={1} />
      </mesh>
      <gridHelper args={[70, 35, '#1d2530', '#161c25']} position={[0, 0.01, 0]} />

      <Roads night={night} />

      {plots.map((plot) => (
        <PlotOutline key={`p-${plot.id}`} plot={plot} layout={layout} />
      ))}
      {plots.map((plot) => (
        <Building key={`b-${plot.id}-${layout}`} plot={plot} layout={layout} night={night} />
      ))}

      <Flight flying={flying} onDone={onFlightDone} />
      <OrbitControls
        enabled={!flying}
        enablePan={false}
        minDistance={14}
        maxDistance={52}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 2, 0]}
      />
    </Canvas>
  );
}
