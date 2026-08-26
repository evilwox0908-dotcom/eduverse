import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Octahedron, Icosahedron, Box } from '@react-three/drei';
import * as THREE from 'three';

function CoreOrb({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ring1Ref.current.rotation.y += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 4 + Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
      ring2Ref.current.rotation.z += delta * 0.16;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Translucent Glass Orb */}
      <Sphere args={[1.35, isMobile ? 24 : 48, isMobile ? 24 : 48]}>
        <meshPhysicalMaterial
          color="#2563EB"
          roughness={0.15}
          metalness={0.1}
          transmission={0.7}
          thickness={0.9}
          transparent
          opacity={0.5}
          clearcoat={0.9}
        />
      </Sphere>

      {/* Internal Luminous Energy Core */}
      <Sphere args={[0.7, isMobile ? 16 : 32, isMobile ? 16 : 32]}>
        <meshStandardMaterial
          color="#60A5FA"
          emissive="#3B82F6"
          emissiveIntensity={0.8}
          roughness={0.3}
        />
      </Sphere>

      {/* Outer Latitudinal Wireframe Cage */}
      <Sphere args={[1.36, isMobile ? 14 : 20, isMobile ? 10 : 16]}>
        <meshBasicMaterial
          color="#93C5FD"
          wireframe
          transparent
          opacity={0.35}
        />
      </Sphere>

      {/* Primary Orbital Glass Ring */}
      <Torus ref={ring1Ref} args={[2.0, 0.035, 16, isMobile ? 36 : 64]}>
        <meshStandardMaterial
          color="#3B82F6"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Torus>

      {/* Secondary Orbital Ring */}
      <Torus ref={ring2Ref} args={[2.3, 0.02, 16, isMobile ? 36 : 64]}>
        <meshStandardMaterial
          color="#93C5FD"
          roughness={0.3}
          metalness={0.5}
          transparent
          opacity={0.5}
        />
      </Torus>
    </group>
  );
}

// Floating educational & geometric artifacts (books, octahedrons, math cubes, nodes)
function FloatingArtifacts({ isMobile }: { isMobile: boolean }) {
  return (
    <group>
      {/* Academic Book / Slate Poly */}
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
        <group position={[-2.4, 0.9, 0.5]} rotation={[0.4, 0.6, 0.2]}>
          <Box args={[0.7, 0.9, 0.15]}>
            <meshStandardMaterial
              color="#2563EB"
              roughness={0.3}
              metalness={0.2}
            />
          </Box>
          <Box args={[0.66, 0.86, 0.14]} position={[0.02, 0, 0]}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
          </Box>
        </group>
      </Float>

      {/* Floating Mathematical Octahedron */}
      <Float speed={2.2} rotationIntensity={1.1} floatIntensity={1.5}>
        <Octahedron args={[0.45]} position={[2.5, 1.2, -0.4]} rotation={[0.5, 0.2, 0.8]}>
          <meshPhysicalMaterial
            color="#38BDF8"
            roughness={0.1}
            transmission={0.6}
            thickness={0.5}
            transparent
            opacity={0.75}
          />
        </Octahedron>
      </Float>

      {/* Floating Icosahedron / Knowledge Node */}
      <Float speed={1.6} rotationIntensity={0.9} floatIntensity={1.3}>
        <Icosahedron args={[0.38]} position={[-2.1, -1.2, 0.2]} rotation={[0.2, 0.9, 0.4]}>
          <meshStandardMaterial
            color="#6366F1"
            roughness={0.2}
            metalness={0.4}
          />
        </Icosahedron>
      </Float>

      {/* Academic Trophy Prism */}
      {!isMobile && (
        <Float speed={2.0} rotationIntensity={1.0} floatIntensity={1.4}>
          <group position={[2.3, -1.0, 0.3]} rotation={[-0.3, 0.4, -0.2]}>
            <Box args={[0.4, 0.4, 0.4]}>
              <meshPhysicalMaterial
                color="#F59E0B"
                roughness={0.2}
                metalness={0.6}
                transmission={0.4}
                transparent
                opacity={0.8}
              />
            </Box>
          </group>
        </Float>
      )}
    </group>
  );
}

// Particle field of micro knowledge nodes
function ParticleField({ count }: { count: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 8;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 6;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#93C5FD"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

export const DashboardScene: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[360px] relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.2, 5.2], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 6, 4]} intensity={1.8} color="#FFFFFF" />
        <directionalLight position={[-4, -3, -2]} intensity={0.8} color="#60A5FA" />
        <pointLight position={[0, 0, 2]} intensity={1.0} color="#3B82F6" />

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
          <CoreOrb isMobile={isMobile} />
        </Float>

        <FloatingArtifacts isMobile={isMobile} />
        <ParticleField count={isMobile ? 35 : 80} />
      </Canvas>
    </div>
  );
};
