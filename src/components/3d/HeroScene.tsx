import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating Globe with atmospheric glow and node points
function CoreGlobe({ isMobile }: { isMobile: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  // Generate constellation/data nodes on globe surface
  const nodes = useMemo(() => {
    const count = isMobile ? 18 : 36;
    const temp: THREE.Vector3[] = [];
    const radius = 1.42;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, [isMobile]);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      ringRef1.current.rotation.y += delta * 0.18;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = -Math.PI / 4 + Math.cos(state.clock.elapsedTime * 0.3) * 0.08;
      ringRef2.current.rotation.z += delta * 0.14;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Translucent Core */}
      <Sphere ref={innerSphereRef} args={[1.4, isMobile ? 24 : 48, isMobile ? 24 : 48]}>
        <meshPhysicalMaterial
          color="#2563EB"
          roughness={0.2}
          metalness={0.1}
          transmission={0.65}
          thickness={0.8}
          transparent
          opacity={0.4}
          clearcoat={0.8}
        />
      </Sphere>

      {/* Latitudinal wireframe cage */}
      <Sphere args={[1.41, isMobile ? 14 : 22, isMobile ? 10 : 16]}>
        <meshBasicMaterial
          color="#60A5FA"
          wireframe
          transparent
          opacity={0.25}
        />
      </Sphere>

      {/* Internal ambient core glow */}
      <Sphere args={[0.9, 16, 16]}>
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.65} />
      </Sphere>

      {/* Data / City Nodes on Globe */}
      {nodes.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color="#93C5FD" />
        </mesh>
      ))}

      {/* Orbital Glass Rings */}
      <group>
        <Torus ref={ringRef1} args={[2.0, 0.018, 16, isMobile ? 48 : 80]}>
          <meshStandardMaterial
            color="#38BDF8"
            roughness={0.1}
            metalness={0.6}
            transparent
            opacity={0.7}
          />
        </Torus>

        <Torus ref={ringRef2} args={[2.25, 0.012, 16, isMobile ? 48 : 80]}>
          <meshStandardMaterial
            color="#60A5FA"
            roughness={0.2}
            metalness={0.4}
            transparent
            opacity={0.5}
          />
        </Torus>
      </group>
    </group>
  );
}

// Floating AI Octahedron Crystal (Tech Element)
function AICrystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.35;
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8} position={[-2.1, 1.2, 0.4]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshPhysicalMaterial
          color="#0284C7"
          roughness={0.1}
          metalness={0.3}
          transmission={0.8}
          thickness={1.2}
          transparent
          opacity={0.85}
          reflectivity={0.9}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

// Floating Knowledge Book/Prism (Education Element)
function KnowledgePrism() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1} position={[2.1, -1.1, 0.6]}>
      <group ref={meshRef}>
        {/* Book cover / prism slab */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.65, 0.85, 0.16]} />
          <meshStandardMaterial
            color="#1D4ED8"
            roughness={0.25}
            metalness={0.4}
          />
        </mesh>
        {/* Book pages edge */}
        <mesh position={[0.02, 0, 0]}>
          <boxGeometry args={[0.62, 0.8, 0.14]} />
          <meshStandardMaterial
            color="#F8FAFC"
            roughness={0.6}
          />
        </mesh>
        {/* Subtle glowing bookmark rib */}
        <mesh position={[0, -0.44, 0.08]}>
          <boxGeometry args={[0.08, 0.2, 0.02]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>
    </Float>
  );
}

// Floating Achievement Beacon / Star Core (Competition Element)
function AchievementBeacon() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.3;
      meshRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.7} floatIntensity={0.9} position={[1.8, 1.4, -0.4]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// Ambient Floating Particles
function ParticleField({ isMobile }: { isMobile: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = isMobile ? 30 : 70;

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      sca[i] = Math.random() * 0.03 + 0.015;
    }
    return [pos, sca];
  }, [count]);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.03;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#60A5FA"
        size={0.06}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Parallax Controller with mouse response
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Soft lerp parallax towards pointer coordinates
      const targetX = (state.pointer.x * 0.4);
      const targetY = (state.pointer.y * 0.3);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export const HeroScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative w-full h-[380px] sm:h-[450px] lg:h-[540px] select-none ${className}`}>
      {/* Atmospheric blue radial glow behind 3D object */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-sky-300/30 blur-2xl" />

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: isMobile ? 55 : 45 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} color="#FFFFFF" />
        <pointLight position={[-4, -3, -2]} intensity={0.8} color="#38BDF8" />
        <pointLight position={[3, -2, 3]} intensity={0.9} color="#2563EB" />

        <ParallaxRig>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <CoreGlobe isMobile={isMobile} />
          </Float>

          {/* Academic & AI Floating Artifacts */}
          <AICrystal />
          <KnowledgePrism />
          <AchievementBeacon />

          {/* Ambient Dust Particles */}
          <ParticleField isMobile={isMobile} />
        </ParallaxRig>
      </Canvas>
    </div>
  );
};
