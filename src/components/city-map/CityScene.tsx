import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { MapPoint } from "@/data/map-points";

/** map % -> world coords on a 44x44 ground plane */
function toWorld(pin: { x: number; y: number }): [number, number] {
  return [((pin.x - 50) / 50) * 20, ((pin.y - 50) / 50) * 20];
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* ---------- pastel community-map palette ---------- */
const C = {
  ground: "#ffffff",
  road: "#efedf1",
  path: "#ffe6f7",
  plaza: "#fff1fa",
  river: "#d6e6ff",
  riverEdge: "#c3d8ff",
  park: "#d6f4e2",
  outline: "#c21c92",
  purple: "#fb48c4",
  purpleDeep: "#c21c92",
  green: "#4fc98a",
  ink: "#2a0f24",
  // pastel building tones (no greys)
  pink: "#ffd9f2",
  pink2: "#ffc0ea",
  lilac: "#ffe7f7",
  lilac2: "#ff9fdd",
  mint: "#cdf2df",
  mint2: "#a9e8c8",
  blue: "#dbe6ff",
  cream: "#fff0d4",
  yellow: "#ffe5a8",
  peach: "#ffdcc9",
  white: "#ffffff",
};

const BUILDING_TONES = [C.pink, C.pink2, C.lilac, C.lilac2, C.mint, C.mint2, C.blue, C.cream, C.yellow, C.peach];

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxEdges = new THREE.EdgesGeometry(boxGeo);
const outlineMat = new THREE.LineBasicMaterial({ color: C.outline, transparent: true, opacity: 0.26 });

const toneMats = BUILDING_TONES.map((c) => new THREE.MeshLambertMaterial({ color: c }));
const matWhite = new THREE.MeshLambertMaterial({ color: C.white });
const matPurple = new THREE.MeshLambertMaterial({ color: C.purple });
const matPurpleDeep = new THREE.MeshLambertMaterial({ color: C.purpleDeep });
const matGreen = new THREE.MeshLambertMaterial({ color: C.green });
const matInk = new THREE.MeshLambertMaterial({ color: C.ink });
const matPinkRoof = new THREE.MeshLambertMaterial({ color: C.pink2 });
const matTreeTrunk = new THREE.MeshLambertMaterial({ color: "#d98cc4" });
const matLeaf = new THREE.MeshLambertMaterial({ color: "#7fd3a3" });
const matLeaf2 = new THREE.MeshLambertMaterial({ color: "#9adcb8" });

const matRoad = new THREE.MeshBasicMaterial({ color: C.road, toneMapped: false });
const matPath = new THREE.MeshBasicMaterial({ color: C.path });
const matPlaza = new THREE.MeshBasicMaterial({ color: C.plaza });
const matGround = new THREE.MeshBasicMaterial({ color: C.ground, toneMapped: false });
const matRiver = new THREE.MeshBasicMaterial({ color: C.river });
const matRiverEdge = new THREE.MeshBasicMaterial({ color: C.riverEdge });
const matPark = new THREE.MeshBasicMaterial({ color: C.park });
const matConnectorPath = new THREE.MeshBasicMaterial({
  color: "#fbfaf7",
  toneMapped: false,
});
const matConnectorOutline = new THREE.MeshBasicMaterial({
  color: "#bbb7c2",
  toneMapped: false,
});
const matPlanShadow = new THREE.MeshBasicMaterial({
  color: "#9e96aa",
  transparent: true,
  opacity: 0.32,
  depthWrite: false,
});

/** a pastel box with a soft outline */
function Block({
  position,
  scale,
  mat,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  mat: THREE.Material;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh geometry={boxGeo} material={mat} />
      <lineSegments geometry={boxEdges} material={outlineMat} />
    </group>
  );
}

/* deterministic pseudo-random blocks */
function makeBlocks() {
  let seed = 11;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const out: {
    pos: [number, number];
    w: number;
    d: number;
    h: number;
    tone: number;
    roof: number;
  }[] = [];
  for (let gx = -18; gx <= 18; gx += 6) {
    for (let gz = -18; gz <= 18; gz += 6) {
      if (Math.abs(gz - gx * 0.25) < 3) continue; // river corridor
      const n = 1 + Math.floor(rnd() * 2);
      for (let i = 0; i < n; i++) {
        out.push({
          pos: [gx + (rnd() - 0.5) * 3, gz + (rnd() - 0.5) * 3],
          w: 1.3 + rnd() * 1.9,
          d: 1.3 + rnd() * 1.9,
          h: 0.9 + rnd() * 3.8,
          tone: Math.floor(rnd() * BUILDING_TONES.length),
          roof: rnd(),
        });
      }
    }
  }
  return out;
}

type GroundPoint = [number, number];
type PathSegment = { from: GroundPoint; to: GroundPoint };

const STREET_X = [-16, -6, 6, 16];
const STREET_Z = [-12, 0, 12];

function isRiverCorridor(x: number, z: number, padding = 0) {
  return Math.abs(z - x * 0.25) < 2.8 + padding;
}

function segmentCrossesRiver({ from, to }: PathSegment) {
  for (let step = 0; step <= 20; step++) {
    const t = step / 20;
    const x = from[0] + (to[0] - from[0]) * t;
    const z = from[1] + (to[1] - from[1]) * t;
    if (isRiverCorridor(x, z, 0.18)) return true;
  }
  return false;
}

function segmentCrossesBuilding(
  segment: PathSegment,
  blocks: ReturnType<typeof makeBlocks>,
  sourceIndex: number,
) {
  const minX = Math.min(segment.from[0], segment.to[0]);
  const maxX = Math.max(segment.from[0], segment.to[0]);
  const minZ = Math.min(segment.from[1], segment.to[1]);
  const maxZ = Math.max(segment.from[1], segment.to[1]);

  return blocks.some((block, index) => {
    if (index === sourceIndex) return false;
    const left = block.pos[0] - block.w / 2 - 0.18;
    const right = block.pos[0] + block.w / 2 + 0.18;
    const top = block.pos[1] - block.d / 2 - 0.18;
    const bottom = block.pos[1] + block.d / 2 + 0.18;
    return maxX >= left && minX <= right && maxZ >= top && minZ <= bottom;
  });
}

/** Give every building a short access path to a reachable street on its river bank. */
function makeBuildingPathSegments(blocks: ReturnType<typeof makeBlocks>): PathSegment[] {
  return blocks.flatMap((block, index) => {
    const [x, z] = block.pos;
    const candidates: PathSegment[] = [
      ...STREET_X.map((streetX): PathSegment => {
        const direction = Math.sign(streetX - x) || 1;
        return {
          from: [x + direction * (block.w / 2), z],
          to: [streetX, z],
        };
      }),
      ...STREET_Z.map((streetZ): PathSegment => {
        const direction = Math.sign(streetZ - z) || 1;
        return {
          from: [x, z + direction * (block.d / 2)],
          to: [x, streetZ],
        };
      }),
    ].sort((a, b) => {
      const lengthA = Math.hypot(a.to[0] - a.from[0], a.to[1] - a.from[1]);
      const lengthB = Math.hypot(b.to[0] - b.from[0], b.to[1] - b.from[1]);
      return lengthA - lengthB;
    });

    const path = candidates.find(
      (candidate) =>
        !segmentCrossesRiver(candidate) &&
        !segmentCrossesBuilding(candidate, blocks, index),
    );

    return path ? [path] : [];
  });
}

function BuildingPathNetwork() {
  const segments = useMemo(() => makeBuildingPathSegments(makeBlocks()), []);

  return (
    <group>
      {segments.map(({ from, to }, index) => {
        const dx = to[0] - from[0];
        const dz = to[1] - from[1];
        const length = Math.hypot(dx, dz);
        return (
          <group key={`${index}-${from.join("-")}-${to.join("-")}`}>
            <mesh
              geometry={boxGeo}
              material={matConnectorOutline}
              position={[(from[0] + to[0]) / 2, 0.026, (from[1] + to[1]) / 2]}
              rotation={[0, -Math.atan2(dz, dx), 0]}
              scale={[length + 0.06, 0.012, 0.48]}
            />
            <mesh
              geometry={boxGeo}
              material={matConnectorPath}
              position={[(from[0] + to[0]) / 2, 0.033, (from[1] + to[1]) / 2]}
              rotation={[0, -Math.atan2(dz, dx), 0]}
              scale={[length, 0.012, 0.34]}
            />
          </group>
        );
      })}
    </group>
  );
}

function Buildings() {
  const blocks = useMemo(makeBlocks, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <group key={i} position={[b.pos[0], 0, b.pos[1]]}>
          <mesh
            geometry={boxGeo}
            material={matPlanShadow}
            position={[0.14, 0.024, 0.14]}
            scale={[b.w * 1.02, 0.012, b.d * 1.02]}
          />
          <Block position={[0, b.h / 2, 0]} scale={[b.w, b.h, b.d]} mat={toneMats[b.tone]} />
          {b.roof > 0.62 && (
            <Block
              position={[0, b.h + 0.12, 0]}
              scale={[b.w * 0.88, 0.24, b.d * 0.88]}
              mat={b.roof > 0.86 ? matPinkRoof : matWhite}
            />
          )}
        </group>
      ))}
    </group>
  );
}

function Trees() {
  const spots = useMemo(() => {
    let seed = 23;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const out: { x: number; z: number; s: number; alt: boolean }[] = [];
    while (out.length < 34) {
      const spot = {
        x: (rnd() - 0.5) * 40,
        z: (rnd() - 0.5) * 40,
        s: 0.7 + rnd() * 0.6,
        alt: rnd() > 0.5,
      };
      if (!isRiverCorridor(spot.x, spot.z, 0.35)) out.push(spot);
    }
    return out;
  }, []);
  return (
    <group>
      {spots.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={[t.s, t.s, t.s]}>
          <mesh geometry={boxGeo} material={matTreeTrunk} position={[0, 0.2, 0]} scale={[0.1, 0.4, 0.1]} />
          <mesh material={t.alt ? matLeaf : matLeaf2} position={[0, 0.68, 0]}>
            <sphereGeometry args={[0.38, 14, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** tiny stylised human figures dotted around the model */
function People() {
  const folks = useMemo(() => {
    let seed = 31;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const out: { x: number; z: number; purple: boolean; r: number }[] = [];
    while (out.length < 46) {
      const person = {
        x: (rnd() - 0.5) * 40,
        z: (rnd() - 0.5) * 40,
        purple: rnd() > 0.45,
        r: rnd() * Math.PI,
      };
      if (!isRiverCorridor(person.x, person.z, 0.2)) out.push(person);
    }
    return out;
  }, []);
  return (
    <group>
      {folks.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation={[0, p.r, 0]}>
          <mesh
            geometry={boxGeo}
            material={p.purple ? matPurple : matGreen}
            position={[0, 0.22, 0]}
            scale={[0.13, 0.44, 0.13]}
          />
          <mesh material={p.purple ? matPurpleDeep : matGreen} position={[0, 0.53, 0]}>
            <sphereGeometry args={[0.11, 10, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <group>
      {/* Flat oversized ground: it blends into the canvas instead of showing a model-board edge. */}
      <mesh material={matGround} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
        <planeGeometry args={[64, 64]} />
      </mesh>

      {[-12, 0, 12].map((z) => (
        <mesh key={`rz${z}`} material={matRoad} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
          <planeGeometry args={[46, 1.8]} />
        </mesh>
      ))}
      {[-16, -6, 6, 16].map((x) => (
        <mesh key={`rx${x}`} material={matRoad} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[1.4, 46]} />
        </mesh>
      ))}

      {/* dotted walking path across the model */}
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={`p${i}`}
          material={matPath}
          rotation={[-Math.PI / 2, 0, 0.32]}
          position={[-20 + i * 1.6, 0.03, -18 + i * 1.35]}
        >
          <planeGeometry args={[0.9, 0.32]} />
        </mesh>
      ))}

      {/* public squares */}
      {[
        [-6, -6, 6.5, 5],
        [8.5, 9, 6, 5.5],
      ].map(([x, z, w, d], i) => (
        <mesh key={`sq${i}`} material={matPlaza} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.025, z]}>
          <planeGeometry args={[w, d]} />
        </mesh>
      ))}

      {/* river + riverside bank */}
      <mesh material={matRiverEdge} rotation={[-Math.PI / 2, 0, 0.25]} position={[0, 0.032, 0]}>
        <planeGeometry args={[54, 5.6]} />
      </mesh>
      <mesh material={matRiver} rotation={[-Math.PI / 2, 0, 0.25]} position={[0, 0.035, 0]}>
        <planeGeometry args={[54, 4.2]} />
      </mesh>

      {/* parks / green spaces */}
      {[
        [-13, -15, 6, 5],
        [13, -8, 5, 4],
        [-9, 14, 7, 4.5],
        [15, 13, 5, 4],
      ].map(([x, z, w, d], i) => (
        <mesh key={`pk${i}`} material={matPark} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.028, z]}>
          <planeGeometry args={[w, d]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- annotation labels with dotted connector lines ---------- */
const ANNOTATIONS: { text: string; from: [number, number]; to: [number, number, number] }[] = [
  { text: "Temple Quarter", from: [8, -11], to: [6, 6.5, -12] },
  { text: "Student Space", from: [-6, -6], to: [-8, 5.5, -11] },
  { text: "Public Artwork", from: [-13, 2], to: [-12, 6, -1] },
  { text: "Audio Stop", from: [8.5, 9], to: [10.5, 4.5, 13] },
  { text: "Story Point", from: [-9, 12], to: [-11, 5, 13] },
  { text: "Community Journal", from: [14, 11], to: [12, 5.5, 15] },
  { text: "Campus Route", from: [-13, -14], to: [-13, 5, -13] },
];

function Annotations() {
  return (
    <group>
      {ANNOTATIONS.map((a) => (
        <group key={a.text}>
          <Line
            points={[
              [a.from[0], 0.4, a.from[1]],
              [(a.from[0] + a.to[0]) / 2, a.to[1] * 0.75, (a.from[1] + a.to[2]) / 2],
              [a.to[0], a.to[1], a.to[2]],
            ]}
            color={C.purple}
            lineWidth={1.2}
            dashed
            dashSize={0.45}
            gapSize={0.45}
            transparent
            opacity={0.55}
          />
          <Html position={a.to} center zIndexRange={[8, 0]} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-full bg-white/85 px-2 py-[3px] text-[9px] font-semibold tracking-wide text-[#c21c92] shadow-sm backdrop-blur-sm">
              {a.text}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

/* ---------- mini artwork markers ---------- */
function ArtworkIcon({ variant, featured }: { variant: string; featured: boolean }) {
  const accent = featured ? matPurpleDeep : matPurple;
  switch (variant) {
    case "hollow": // stump cluster
      return (
        <group>
          {[
            [-0.35, 0.45, -0.2],
            [0.3, 0.62, 0.15],
            [0.05, 0.34, -0.4],
          ].map(([x, h, z], i) => (
            <Block key={i} position={[x, h / 2, z]} scale={[0.32, h, 0.32]} mat={i === 1 ? matPinkRoof : matWhite} />
          ))}
        </group>
      );
    case "palm-temple": // arch shelter
      return (
        <group>
          <Block position={[-0.4, 0.4, 0]} scale={[0.18, 0.8, 0.18]} mat={matWhite} />
          <Block position={[0.4, 0.4, 0]} scale={[0.18, 0.8, 0.18]} mat={matWhite} />
          <Block position={[0, 0.9, 0]} scale={[1.1, 0.2, 0.8]} mat={accent} />
        </group>
      );
    case "mirror-maze": // upright panels
      return (
        <group>
          <Block position={[-0.25, 0.5, 0.1]} scale={[0.55, 1, 0.1]} mat={matWhite} />
          <Block position={[0.3, 0.4, -0.2]} scale={[0.5, 0.8, 0.1]} mat={accent} />
        </group>
      );
    case "bristol-light": // light column
      return (
        <group>
          <Block position={[0, 0.55, 0]} scale={[0.24, 1.1, 0.24]} mat={matWhite} />
          <mesh material={accent} position={[0, 1.22, 0]}>
            <sphereGeometry args={[0.24, 14, 12]} />
          </mesh>
        </group>
      );
    case "community-wall": // painted wall
      return (
        <group>
          <Block position={[0, 0.42, 0]} scale={[1.2, 0.84, 0.14]} mat={matWhite} />
          <Block position={[-0.3, 0.5, 0.09]} scale={[0.3, 0.3, 0.04]} mat={accent} />
          <Block position={[0.25, 0.34, 0.09]} scale={[0.3, 0.3, 0.04]} mat={matGreen} />
        </group>
      );
    case "charting-change": // loom / textile frame
      return (
        <group>
          <Block position={[-0.5, 0.5, 0]} scale={[0.16, 1, 0.16]} mat={matWhite} />
          <Block position={[0.5, 0.5, 0]} scale={[0.16, 1, 0.16]} mat={matWhite} />
          <Block position={[0, 0.72, 0]} scale={[1.1, 0.42, 0.1]} mat={accent} />
          <Block position={[0, 0.34, 0]} scale={[1.1, 0.22, 0.1]} mat={matPinkRoof} />
          <Block position={[0, 1.05, 0]} scale={[1.25, 0.12, 0.2]} mat={matWhite} />
        </group>
      );
    default: // small plinth sculpture
      return (
        <group>
          <Block position={[0, 0.28, 0]} scale={[0.5, 0.56, 0.5]} mat={matWhite} />
          <mesh material={matGreen} position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.22, 12, 10]} />
          </mesh>
        </group>
      );
  }
}

function Pavilion({
  point,
  number,
  active,
  onHover,
  onSelect,
  reduced,
}: {
  point: MapPoint;
  number: number | null;
  active: boolean;
  onHover: (id: string | null) => void;
  onSelect: (p: MapPoint) => void;
  reduced: boolean;
}) {
  const [x, z] = toWorld(point.pin);
  const featured = !!point.featured;
  const isRoom = !!point.artworkId;
  const s = (featured ? 1.5 : isRoom ? 1.15 : 0.85) * (active ? 1.18 : 1);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!featured || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const k = 1 + Math.sin(t * 1.5) * 0.18;
      if (ringRef.current) {
        ringRef.current.scale.set(k, k, 1);
        (ringRef.current.material as THREE.Material).opacity = 0.6 - Math.sin(t * 1.5) * 0.25;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [featured, reduced]);

  return (
    <group position={[x, active ? 0.35 : 0, z]} scale={[s, s, s]}>
      <mesh
        geometry={boxGeo}
        material={matPlanShadow}
        position={[0.12, 0.024, 0.12]}
        scale={[1.98, 0.012, 1.98]}
      />
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(point.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(point);
        }}
      >
        {/* plinth */}
        <Block position={[0, 0.09, 0]} scale={[1.9, 0.18, 1.9]} mat={featured ? matPurple : matWhite} />
        <group position={[0, 0.18, 0]}>
          <ArtworkIcon variant={point.id} featured={featured} />
        </group>
      </group>

      {/* hover / tap glow */}
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[1.3, 2.1, 48]} />
          <meshBasicMaterial color={C.purple} transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      )}

      {featured && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[1.4, 1.85, 48]} />
          <meshBasicMaterial color={C.purpleDeep} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}

      {number !== null && (
        <Html position={[0, 1.9, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: "auto" }}>
          <div
            onMouseEnter={() => onHover(point.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(point)}
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-white/80 transition-transform duration-200"
            style={{
              background: featured ? C.purpleDeep : C.purple,
              transform: active ? "scale(1.15)" : "scale(1)",
              boxShadow: active ? `0 0 0 6px ${C.purple}33` : "0 2px 6px rgba(27,22,48,.22)",
            }}
          >
            {number}
          </div>
        </Html>
      )}
      {number === null && active && (
        <Html position={[0, 1.5, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: "auto" }}>
          <div
            onMouseEnter={() => onHover(point.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(point)}
            className="h-2.5 w-2.5 cursor-pointer rounded-full bg-[#5cc98d] ring-2 ring-white"
          />
        </Html>
      )}
    </group>
  );
}

function UserLocation({ reduced }: { reduced: boolean }) {
  const [x, z] = toWorld({ x: 46, y: 58 });
  const pulseRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const k = 1 + ((t * 0.6) % 1) * 1.1;
      if (pulseRef.current) {
        pulseRef.current.scale.set(k, k, 1);
        (pulseRef.current.material as THREE.Material).opacity = 0.45 * (1 - ((t * 0.6) % 1));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <group position={[x, 0, z]}>
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.9, 1.4, 40]} />
        <meshBasicMaterial color={C.purpleDeep} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color={C.purpleDeep} />
      </mesh>
      <Html position={[0, 1.6, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#2a0f24] shadow-md">
          You are here
        </div>
      </Html>
    </group>
  );
}

function Controls({ resetKey }: { resetKey: number }) {
  const ref = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  useEffect(() => {
    const c = ref.current as unknown as { reset?: () => void } | null;
    if (resetKey > 0) c?.reset?.();
  }, [resetKey]);
  return (
    <OrbitControls
      ref={ref}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.7}
      minPolarAngle={Math.PI / 4.2}
      maxPolarAngle={Math.PI / 4.2}
      minZoom={9}
      maxZoom={38}
      target={[0, 0, 0]}
    />
  );
}

export default function CityScene({
  points,
  activeId,
  onHover,
  onSelect,
  resetKey,
}: {
  points: MapPoint[];
  activeId?: string | null;
  onHover: (id: string | null) => void;
  onSelect: (p: MapPoint) => void;
  resetKey: number;
}) {
  const reduced = useReducedMotion();
  let n = 0;
  return (
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      camera={{ position: [26, 26, 26], zoom: 13, near: -200, far: 400 }}
      gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      style={{ touchAction: "none", background: "#ffffff" }}
    >
      <color attach="background" args={[C.ground]} />
      <ambientLight intensity={1.65} />
      <directionalLight position={[16, 24, 12]} intensity={0.5} />
      <hemisphereLight args={["#ffffff", "#fff0fa", 0.45]} />
      <Ground />
      <BuildingPathNetwork />
      <Buildings />
      <Trees />
      <People />
      <Annotations />
      <UserLocation reduced={reduced} />

      {points.map((p) => (
        <Pavilion
          key={p.id}
          point={p}
          number={p.artworkId ? ++n : null}
          active={activeId === p.id}
          onHover={onHover}
          onSelect={onSelect}
          reduced={reduced}
        />
      ))}
      <Controls resetKey={resetKey} />
    </Canvas>
  );
}
