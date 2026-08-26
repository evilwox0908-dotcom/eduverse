import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

interface OnboardingSceneProps {
  step: number;
  className?: string;
}

function DynamicSceneObjects({ step, isMobile }: { step: number; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Step 1: User Profile Orb */}
      {step === 1 && (
        <group>
          <Sphere args={[1.2, isMobile ? 24 : 36, isMobile ? 24 : 36]}>
            <meshPhysicalMaterial
              color="#2563EB"
              transmission={0.7}
              roughness={0.1}
              thickness={0.8}
              transparent
              opacity={0.5}
            />
          </Sphere>
          <Sphere args={[0.7, 16, 16]}>
            <meshStandardMaterial color="#60A5FA" emissive="#2563EB" emissiveIntensity={0.4} />
          </Sphere>
        </group>
      )}

      {/* Step 2: Global Country Network */}
      {step === 2 && (
        <group>
          <Sphere args={[1.3, isMobile ? 24 : 40, isMobile ? 24 : 40]}>
            <meshPhysicalMaterial
              color="#0284C7"
              transmission={0.6}
              roughness={0.2}
              transparent
              opacity={0.45}
            />
          </Sphere>
          <Sphere args={[1.31, 16, 12]}>
            <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.35} />
          </Sphere>
        </group>
      )}

      {/* Step 3: Architectural Knowledge Pillar */}
      {step === 3 && (
        <group>
          <Box args={[0.9, 1.4, 0.9]}>
            <meshPhysicalMaterial
              color="#1D4ED8"
              transmission={0.5}
              roughness={0.2}
              transparent
              opacity={0.6}
            />
          </Box>
          <Box args={[1.2, 0.15, 1.2]} position={[0, -0.75, 0]}>
            <meshStandardMaterial color="#93C5FD" roughness={0.3} metalness={0.5} />
          </Box>
          <Box args={[1.2, 0.15, 1.2]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#93C5FD" roughness={0.3} metalness={0.5} />
          </Box>
        </group>
      )}

      {/* Step 4: Academic Grade Prism & Crystal */}
      {step === 4 && (
        <group>
          <mesh>
            <octahedronGeometry args={[1.1, 0]} />
            <meshPhysicalMaterial
              color="#3B82F6"
              transmission={0.75}
              roughness={0.1}
              metalness={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Step 5: Golden Victory Beacon / Complete */}
      {step === 5 && (
        <group>
          <mesh>
            <icosahedronGeometry args={[1.1, 0]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#D97706"
              emissiveIntensity={0.3}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Ambient Orbiting Ring */}
      <Torus ref={ringRef} args={[1.85, 0.015, 16, isMobile ? 36 : 64]}>
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.7}
        />
      </Torus>
    </group>
  );
}

export const OnboardingScene: React.FC<OnboardingSceneProps> = ({ step, className = '' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative w-full h-[280px] sm:h-[360px] lg:h-[450px] select-none ${className}`}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-sky-300/30 blur-2xl" />

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: isMobile ? 55 : 45 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.3} color="#FFFFFF" />
        <pointLight position={[-4, -3, -2]} intensity={0.8} color="#38BDF8" />
        <pointLight position={[3, -2, 3]} intensity={0.9} color="#2563EB" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <DynamicSceneObjects step={step} isMobile={isMobile} />
        </Float>
      </Canvas>
    </div>
  );
};
