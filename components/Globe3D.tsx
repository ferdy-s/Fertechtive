"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   CONFIG
========================================================= */

const EARTH_RADIUS = 2.15;

const WORLD_MAP_URL =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

/*
 * Maximum points used for one country ring.
 *
 * This is intentionally kept low.
 * The original GeoJSON contains far more coordinates
 * than are visually necessary at this scale.
 */
const MAX_RING_POINTS = 90;

/* =========================================================
   TYPES
========================================================= */

type GeoJSONGeometry = {
  type: string;
  coordinates: any;
};

type GeoJSONFeature = {
  type: "Feature";
  properties?: Record<string, unknown>;
  geometry: GeoJSONGeometry;
};

type GeoJSONCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

/* =========================================================
   LAT / LNG → 3D
========================================================= */

function latLngToVector3(
  lat: number,
  lng: number,
  radius = EARTH_RADIUS,
) {
  const phi =
    (90 - lat) *
    (Math.PI / 180);

  const theta =
    (lng + 180) *
    (Math.PI / 180);

  return new THREE.Vector3(
    -radius *
      Math.sin(phi) *
      Math.cos(theta),

    radius * Math.cos(phi),

    radius *
      Math.sin(phi) *
      Math.sin(theta),
  );
}

/* =========================================================
   REDUCE GEOJSON RING
========================================================= */

/**
 * GeoJSON country data can contain thousands
 * of coordinates.
 *
 * We reduce them before sending them to WebGL.
 *
 * This preserves the overall country silhouette
 * while drastically reducing geometry complexity.
 */
function reduceRing(
  ring: number[][],
) {
  if (
    !ring ||
    ring.length <= MAX_RING_POINTS
  ) {
    return ring;
  }

  const step =
    Math.ceil(
      ring.length /
        MAX_RING_POINTS,
    );

  const reduced: number[][] =
    [];

  for (
    let i = 0;
    i < ring.length;
    i += step
  ) {
    reduced.push(ring[i]);
  }

  /*
   * Keep the closing coordinate.
   */
  const first = ring[0];
  const last = ring[ring.length - 1];

  if (
    first &&
    last &&
    reduced.length > 0
  ) {
    reduced.push(last);
  }

  return reduced;
}

/* =========================================================
   CREATE COUNTRY GEOMETRY
========================================================= */

function buildWorldBoundaryGeometry(
  countries: GeoJSONFeature[],
) {
  const positions: number[] =
    [];

  const addRing = (
    ring: number[][],
  ) => {
    const reduced =
      reduceRing(ring);

    if (
      !reduced ||
      reduced.length < 2
    ) {
      return;
    }

    for (
      let i = 0;
      i < reduced.length - 1;
      i++
    ) {
      const current =
        reduced[i];

      const next =
        reduced[i + 1];

      if (
        !current ||
        !next ||
        current.length < 2 ||
        next.length < 2
      ) {
        continue;
      }

      const a =
        latLngToVector3(
          current[1],
          current[0],
          EARTH_RADIUS +
            0.018,
        );

      const b =
        latLngToVector3(
          next[1],
          next[0],
          EARTH_RADIUS +
            0.018,
        );

      positions.push(
        a.x,
        a.y,
        a.z,
        b.x,
        b.y,
        b.z,
      );
    }
  };

  for (const country of countries) {
    const geometry =
      country.geometry;

    if (!geometry) {
      continue;
    }

    /*
     * Polygon
     */
    if (
      geometry.type ===
      "Polygon"
    ) {
      for (const ring of
        geometry.coordinates) {
        addRing(ring);
      }
    }

    /*
     * MultiPolygon
     */
    if (
      geometry.type ===
      "MultiPolygon"
    ) {
      for (const polygon of
        geometry.coordinates) {
        for (const ring of
          polygon) {
          addRing(ring);
        }
      }
    }
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      positions,
      3,
    ),
  );

  /*
   * Important for performance.
   */
  geometry.computeBoundingSphere();

  return geometry;
}

/* =========================================================
   COUNTRY BOUNDARIES
========================================================= */

function CountryBoundaries({
  countries,
}: {
  countries: GeoJSONFeature[];
}) {
  const geometry =
    useMemo(
      () =>
        buildWorldBoundaryGeometry(
          countries,
        ),
      [countries],
    );

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <lineSegments
      geometry={geometry}
      frustumCulled
      renderOrder={2}
    >
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.62}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* =========================================================
   EARTH
========================================================= */

function Earth() {
  return (
    <group>
      {/* Main Earth */}

      <mesh>
        <sphereGeometry
          args={[
            EARTH_RADIUS,
            48,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#050505"
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>

      {/* Subtle technical wire */}

      <mesh
        scale={1.002}
      >
        <sphereGeometry
          args={[
            EARTH_RADIUS,
            32,
            20,
          ]}
        />

        <meshBasicMaterial
          color="#303030"
          wireframe
          transparent
          opacity={0.10}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   LATITUDE / LONGITUDE GRID
========================================================= */

function CoordinateGrid() {
  const geometry =
    useMemo(() => {
      const positions: number[] =
        [];

      /*
       * Longitude.
       *
       * Only 12 meridians.
       * Enough to communicate the technical globe
       * without flooding the GPU.
       */
      for (
        let longitude = -180;
        longitude < 180;
        longitude += 30
      ) {
        for (
          let latitude = -90;
          latitude < 90;
          latitude += 6
        ) {
          const a =
            latLngToVector3(
              latitude,
              longitude,
              EARTH_RADIUS +
                0.009,
            );

          const b =
            latLngToVector3(
              Math.min(
                latitude + 6,
                90,
              ),
              longitude,
              EARTH_RADIUS +
                0.009,
            );

          positions.push(
            a.x,
            a.y,
            a.z,

            b.x,
            b.y,
            b.z,
          );
        }
      }

      /*
       * Latitude.
       */
      for (
        let latitude = -60;
        latitude <= 60;
        latitude += 20
      ) {
        for (
          let longitude = -180;
          longitude < 180;
          longitude += 6
        ) {
          const a =
            latLngToVector3(
              latitude,
              longitude,
              EARTH_RADIUS +
                0.009,
            );

          const b =
            latLngToVector3(
              latitude,
              Math.min(
                longitude + 6,
                180,
              ),
              EARTH_RADIUS +
                0.009,
            );

          positions.push(
            a.x,
            a.y,
            a.z,

            b.x,
            b.y,
            b.z,
          );
        }
      }

      const geometry =
        new THREE.BufferGeometry();

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          positions,
          3,
        ),
      );

      geometry.computeBoundingSphere();

      return geometry;
    }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <lineSegments
      geometry={geometry}
      frustumCulled
      renderOrder={1}
    >
      <lineBasicMaterial
        color="#353535"
        transparent
        opacity={0.23}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* =========================================================
   GLOBAL LOCATIONS
========================================================= */

const LOCATIONS = [
  [-6.2088, 106.8456], // Jakarta
  [1.3521, 103.8198], // Singapore
  [35.6762, 139.6503], // Tokyo
  [51.5072, -0.1276], // London
  [40.7128, -74.006], // New York
  [37.7749, -122.4194], // San Francisco
  [25.2048, 55.2708], // Dubai
  [-33.8688, 151.2093], // Sydney
  [48.8566, 2.3522], // Paris
  [52.52, 13.405], // Berlin
  [1.2903, 103.8519], // Singapore
  [22.3193, 114.1694], // Hong Kong
];

/* =========================================================
   LOCATION POINTS
========================================================= */

function GlobalNodes() {
  const geometry =
    useMemo(() => {
      const positions: number[] =
        [];

      for (const [
        latitude,
        longitude,
      ] of LOCATIONS) {
        const point =
          latLngToVector3(
            latitude,
            longitude,
            EARTH_RADIUS +
              0.065,
          );

        positions.push(
          point.x,
          point.y,
          point.z,
        );
      }

      const geometry =
        new THREE.BufferGeometry();

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          positions,
          3,
        ),
      );

      return geometry;
    }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <points
      geometry={geometry}
      renderOrder={4}
    >
      <pointsMaterial
        color="#ffffff"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  );
}

/* =========================================================
   OUTER ORBIT RINGS
========================================================= */

function OrbitRings() {
  return (
    <group
      rotation={[
        Math.PI / 2.7,
        0.25,
        -0.25,
      ]}
    >
      <mesh>
        <torusGeometry
          args={[
            EARTH_RADIUS +
              0.31,
            0.006,
            6,
            96,
          ]}
        />

        <meshBasicMaterial
          color="#555555"
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>

      <mesh
        rotation={[
          0.8,
          0.45,
          0.4,
        ]}
      >
        <torusGeometry
          args={[
            EARTH_RADIUS +
              0.44,
            0.004,
            6,
            96,
          ]}
        />

        <meshBasicMaterial
          color="#292929"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   WORLD
========================================================= */

function World({
  countries,
}: {
  countries: GeoJSONFeature[];
}) {
  return (
    <group
      rotation={[
        0.12,
        -0.55,
        0,
      ]}
    >
      <Earth />

      <CoordinateGrid />

      {countries.length >
        0 && (
        <CountryBoundaries
          countries={
            countries
          }
        />
      )}

      <GlobalNodes />

      <OrbitRings />
    </group>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function Globe3D() {
  const [
    countries,
    setCountries,
  ] = useState<
    GeoJSONFeature[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [mapError, setMapError] =
    useState(false);

  /* -------------------------------------------------------
     FETCH MAP
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const controller =
      new AbortController();

    async function loadWorldMap() {
      try {
        setLoading(true);

        const response =
          await fetch(
            WORLD_MAP_URL,
            {
              signal:
                controller.signal,
              cache: "force-cache",
            },
          );

        if (!response.ok) {
          throw new Error(
            "World map request failed.",
          );
        }

        const data =
          (await response.json()) as GeoJSONCollection;

        if (!mounted) {
          return;
        }

        setCountries(
          Array.isArray(
            data.features,
          )
            ? data.features
            : [],
        );

        setMapError(false);
      } catch (error) {
        if (
          error instanceof
            DOMException &&
          error.name ===
            "AbortError"
        ) {
          return;
        }

        console.error(
          "Globe map error:",
          error,
        );

        if (mounted) {
          setMapError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWorldMap();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{
          position: [
            0,
            0,
            6.5,
          ],
          fov: 38,
          near: 0.1,
          far: 100,
        }}
        dpr={[
          1,
          1.5,
        ]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference:
            "high-performance",
        }}
      >
        {/* -------------------------------------------------
            LIGHT
        ------------------------------------------------- */}

        <ambientLight
          intensity={0.65}
        />

        <directionalLight
          position={[
            4,
            4,
            6,
          ]}
          intensity={1.7}
        />

        <directionalLight
          position={[
            -3,
            -2,
            -4,
          ]}
          intensity={0.25}
        />

        {/* -------------------------------------------------
            WORLD
        ------------------------------------------------- */}

        <World
          countries={
            countries
          }
        />

        {/* -------------------------------------------------
            INTERACTION
        ------------------------------------------------- */}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.055}
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.48}
          autoRotate
          autoRotateSpeed={0.35}
          minPolarAngle={
            Math.PI * 0.24
          }
          maxPolarAngle={
            Math.PI * 0.76
          }
        />
      </Canvas>

      {/* ===================================================
          TECHNICAL UI
      =================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* TOP LEFT */}

        <div className="absolute left-4 top-4 flex items-center gap-3">
          <span className="h-1.5 w-1.5 bg-white" />

          <span className="text-[9px] uppercase tracking-[0.28em] text-white/55">
            WORLD MAP
          </span>

          <span className="h-px w-10 bg-white/15" />

          <span className="text-[9px] uppercase tracking-[0.22em] text-white/25">
            3D / 01
          </span>
        </div>

        {/* TOP RIGHT */}

        <div className="absolute right-4 top-4 text-right">
          <div className="text-[9px] uppercase tracking-[0.28em] text-white/30">
            GLOBAL VIEW
          </div>

          <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/55">
            {loading
              ? "Loading"
              : mapError
                ? "Offline"
                : "Online"}
          </div>
        </div>

        {/* BOTTOM LEFT */}

        <div className="absolute bottom-4 left-4">
          <span className="text-[8px] uppercase tracking-[0.28em] text-white/25">
            FRT / EARTH
          </span>
        </div>

        {/* BOTTOM RIGHT */}

        <div className="absolute bottom-4 right-4 text-right">
          <span className="text-[8px] uppercase tracking-[0.24em] text-white/25">
            DRAG TO EXPLORE
          </span>
        </div>

        {/* CORNER MARKERS */}

        <div className="absolute left-0 top-0 h-7 w-7 border-l border-t border-white/10" />

        <div className="absolute right-0 top-0 h-7 w-7 border-r border-t border-white/10" />

        <div className="absolute bottom-0 left-0 h-7 w-7 border-b border-l border-white/10" />

        <div className="absolute bottom-0 right-0 h-7 w-7 border-b border-r border-white/10" />
      </div>
    </div>
  );
}