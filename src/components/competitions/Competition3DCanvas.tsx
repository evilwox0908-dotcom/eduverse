import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';

// 3D Stylized Golden & Glass Trophy
function CompetitionTrophy() {
  const trophyGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (trophyGroup.current) {
      trophyGroup.current.rotation.y += delta * 0.35;
      trophyGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    }
  });

  return (
    <group ref={trophyGroup} position={[0, 0.15, 0.4]}>
      {/* Trophy Cup Base */}
      <Cylinder args={[0.3, 0.38, 0.12, 32]} position={[0, -0.65, 0]}>
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      {/* Gold Base Plate */}
      <Cylinder args={[0.24, 0.28, 0.08, 32]} position={[0, -0.55, 0]}>
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={0.25}
          metalness={0.85}
          roughness={0.2}
        />
      </Cylinder>

      {/* Trophy Stem */}
      <Cylinder args={[0.08, 0.12, 0.4, 24]} position={[0, -0.32, 0]}>
        <meshStandardMaterial
          color="#FBBF24"
          metalness={0.9}
          roughness={0.15}
        />
      </Cylinder>

      {/* Stem Ring */}
      <Torus args={[0.13, 0.025, 16, 32]} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#60A5FA" metalness={0.6} roughness={0.2} />
      </Torus>

      {/* Trophy Cup Body (Translucent Blue & Gold Rim) */}
      <Cylinder args={[0.42, 0.16, 0.55, 32, 1, true]} position={[0, 0.08, 0]}>
        <meshPhysicalMaterial
          color="#2563EB"
          roughness={0.15}
          metalness={0.2}
          transmission={0.7}
          thickness={0.6}
          transparent
          opacity={0.75}
          clearcoat={0.9}
          side={THREE.DoubleSide}
        />
      </Cylinder>

      {/* Top Gold Rim */}
      <Torus args={[0.42, 0.025, 16, 32]} position={[0, 0.355, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.95}
          roughness={0.1}
          emissive="#B45309"
          emissiveIntensity={0.3}
        />
      </Torus>

      {/* Handles (Left & Right) */}
      <group position={[-0.42, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Torus args={[0.18, 0.022, 16, 32, Math.PI]}>
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </Torus>
      </group>
      <group position={[0.42, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <Torus args={[0.18, 0.022, 16, 32, Math.PI]}>
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </Torus>
      </group>

      {/* Glowing Star inside Cup */}
      <Float speed={3} rotationIntensity={0.8} floatIntensity={0.5}>
        <mesh position={[0, 0.12, 0]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#EAB308"
            emissiveIntensity={0.8}
            metalness={0.4}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Background Transparent Global Grid
function ArenaGlobe({ isMobile }: { isMobile: boolean }) {
  const globeGroup = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeGroup.current) {
      globeGroup.current.rotation.y += delta * 0.08;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.12;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group ref={globeGroup} position={[0, 0, -0.3]}>
      {/* Translucent Sphere Core */}
      <Sphere args={[1.3, isMobile ? 20 : 36, isMobile ? 20 : 36]}>
        <meshPhysicalMaterial
          color="#3B82F6"
          roughness={0.3}
          metalness={0.1}
          transmission={0.85}
          thickness={1.1}
          transparent
          opacity={0.25}
        />
      </Sphere>

      {/* Latitude / Longitude lines */}
      <Sphere args={[1.31, isMobile ? 12 : 18, isMobile ? 8 : 12]}>
        <meshBasicMaterial
          color="#93C5FD"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Outer Orbital Glass Rings */}
      <Torus ref={ringRef1} args={[1.9, 0.015, 16, isMobile ? 40 : 64]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial color="#60A5FA" transparent opacity={0.6} metalness={0.5} roughness={0.2} />
      </Torus>

      <Torus ref={ringRef2} args={[2.1, 0.012, 16, isMobile ? 40 : 64]} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#38BDF8" transparent opacity={0.45} metalness={0.7} roughness={0.1} />
      </Torus>
    </group>
  );
}

// Floating Academic Medal
function AcademicMedal({ position }: { position: [number, number, number] }) {
  const medalRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (medalRef.current) {
      medalRef.current.rotation.y += delta * 0.4;
      medalRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8} position={position}>
      <group ref={medalRef}>
        {/* Medal Coin */}
        <Cylinder args={[0.28, 0.28, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#B45309"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.2}
          />
        </Cylinder>
        {/* Inner Ring */}
        <Torus args={[0.22, 0.012, 16, 24]} position={[0, 0, 0.025]}>
          <meshStandardMaterial color="#FEF3C7" metalness={0.9} roughness={0.1} />
        </Torus>
        {/* Ribbon Attachment */}
        <mesh position={[0, 0.28, -0.01]}>
          <boxGeometry args={[0.12, 0.18, 0.02]} />
          <meshStandardMaterial color="#2563EB" roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

// Floating Math & Science Symbol
function OlympiadSymbol({ position }: { position: [number, number, number] }) {
  const symbolRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (symbolRef.current) {
      symbolRef.current.rotation.x += delta * 0.3;
      symbolRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.9} position={position}>
      <mesh ref={symbolRef}>
        <icosahedronGeometry args={[0.26, 0]} />
        <meshPhysicalMaterial
          color="#0284C7"
          roughness={0.1}
          metalness={0.3}
          transmission={0.75}
          thickness={0.8}
          transparent
          opacity={0.85}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

// Sparkle / Particle Field
function SparkleField({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 35 : 75;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#93C5FD"
        size={0.06}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Parallax Interactive Controller
function SceneParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.25;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.06);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export const Competition3DCanvas: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heightClass = compact
    ? 'h-[240px] sm:h-[280px]'
    : 'h-[360px] sm:h-[420px] lg:h-[480px]';

  return (
    <div className={`relative w-full ${heightClass} select-none ${className}`}>
      {/* Background Soft Atmospheric Halos */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-amber-300/20 blur-2xl" />

      <Canvas
        camera={{ position: [0, 0, compact ? 4.6 : 4.8], fov: isMobile ? 55 : 45 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 6, 4]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-4, -2, -2]} intensity={0.9} color="#38BDF8" />
        <pointLight position={[3, -2, 3]} intensity={1.1} color="#F59E0B" />

        <SceneParallax>
          {/* Transparent Globe Environment */}
          <ArenaGlobe isMobile={isMobile} />

          {/* Central 3D Floating Trophy */}
          <CompetitionTrophy />

          {/* Floating Academic Medal */}
          <AcademicMedal position={[-1.9, 0.9, 0.2]} />

          {/* Floating Math/Olympiad Crystal */}
          <OlympiadSymbol position={[1.9, -0.7, 0.3]} />

          {/* Particle Atmosphere */}
          <SparkleField isMobile={isMobile} />
        </SceneParallax>
      </Canvas>
    </div>
  );
};
