import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

function CoreAuthGlobe({ isMobile }: { isMobile: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      ringRef.current.rotation.y += delta * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = -Math.PI / 3 + Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      ringRef2.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Translucent Glass Sphere */}
      <Sphere args={[1.3, isMobile ? 24 : 40, isMobile ? 24 : 40]}>
        <meshPhysicalMaterial
          color="#2563EB"
          roughness={0.15}
          metalness={0.2}
          transmission={0.7}
          thickness={0.9}
          transparent
          opacity={0.45}
          clearcoat={0.9}
        />
      </Sphere>

      {/* Latitudinal wireframe cage */}
      <Sphere args={[1.31, isMobile ? 12 : 20, isMobile ? 10 : 14]}>
        <meshBasicMaterial color="#60A5FA" wireframe transparent opacity={0.3} />
      </Sphere>

      {/* Internal ambient glowing core */}
      <Sphere args={[0.75, 16, 16]}>
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} />
      </Sphere>

      {/* Outer Orbit Rings */}
      <Torus ref={ringRef} args={[1.8, 0.015, 16, isMobile ? 40 : 64]}>
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.7}
          transparent
          opacity={0.75}
        />
      </Torus>

      <Torus ref={ringRef2} args={[2.05, 0.01, 16, isMobile ? 40 : 64]}>
        <meshStandardMaterial
          color="#93C5FD"
          roughness={0.2}
          metalness={0.5}
          transparent
          opacity={0.5}
        />
      </Torus>
    </group>
  );
}

function FloatingCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8} position={[-1.7, 1.1, 0.3]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshPhysicalMaterial
          color="#0284C7"
          roughness={0.1}
          metalness={0.3}
          transmission={0.8}
          thickness={1.1}
          transparent
          opacity={0.85}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

function FloatingBeacon() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.25;
      meshRef.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.9} position={[1.6, -1.0, 0.5]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.25;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export const AuthScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative w-full h-[320px] sm:h-[420px] lg:h-[500px] select-none ${className}`}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-sky-300/30 blur-2xl" />

      <Canvas
        camera={{ position: [0, 0, 4.8], fov: isMobile ? 55 : 45 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} color="#FFFFFF" />
        <pointLight position={[-4, -3, -2]} intensity={0.8} color="#38BDF8" />
        <pointLight position={[3, -2, 3]} intensity={0.9} color="#2563EB" />

        <ParallaxRig>
          <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.5}>
            <CoreAuthGlobe isMobile={isMobile} />
          </Float>
          <FloatingCrystal />
          <FloatingBeacon />
        </ParallaxRig>
      </Canvas>
    </div>
  );
};
