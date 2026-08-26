import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

function TeacherCore({ isThinking }: { isThinking?: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const sparkRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const speedMultiplier = isThinking ? 2.5 : 1.0;

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4 * speedMultiplier;
      const scaleVal = 1 + Math.sin(state.clock.elapsedTime * (isThinking ? 4 : 2)) * 0.05;
      coreRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      ringRef.current.rotation.y += delta * 0.6 * speedMultiplier;
    }
    if (sparkRef.current) {
      sparkRef.current.rotation.z += delta * 0.3 * speedMultiplier;
    }
  });

  return (
    <group>
      {/* Central AI Nucleus */}
      <Sphere ref={coreRef} args={[0.9, 32, 32]}>
        <meshPhysicalMaterial
          color={isThinking ? '#38BDF8' : '#2563EB'}
          emissive={isThinking ? '#0284C7' : '#1D4ED8'}
          emissiveIntensity={isThinking ? 0.9 : 0.5}
          roughness={0.1}
          metalness={0.2}
          transmission={0.6}
          thickness={0.8}
          transparent
          opacity={0.8}
          clearcoat={1.0}
        />
      </Sphere>

      {/* Internal Intelligence Point */}
      <Octahedron args={[0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#60A5FA"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </Octahedron>

      {/* Luminous Synaptic Ring */}
      <Torus ref={ringRef} args={[1.35, 0.03, 16, 48]}>
        <meshStandardMaterial
          color="#93C5FD"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </Torus>

      {/* Abstract Orbiting Nodes */}
      <group ref={sparkRef}>
        <Sphere args={[0.08, 12, 12]} position={[1.4, 0.3, 0]}>
          <meshBasicMaterial color="#38BDF8" />
        </Sphere>
        <Sphere args={[0.06, 12, 12]} position={[-1.2, -0.4, 0.2]}>
          <meshBasicMaterial color="#818CF8" />
        </Sphere>
      </group>
    </group>
  );
}

interface AITeacherOrbProps {
  className?: string;
  isThinking?: boolean;
}

export const AITeacherOrb: React.FC<AITeacherOrbProps> = ({ className = 'w-24 h-24', isThinking = false }) => {
  return (
    <div className={`${className} relative pointer-events-none`}>
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 4, 3]} intensity={1.8} color="#FFFFFF" />
        <directionalLight position={[-3, -2, -2]} intensity={0.9} color="#60A5FA" />
        <pointLight position={[0, 0, 1.5]} intensity={1.2} color="#38BDF8" />

        <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.8}>
          <TeacherCore isThinking={isThinking} />
        </Float>
      </Canvas>
    </div>
  );
};
