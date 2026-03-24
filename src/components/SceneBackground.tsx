'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { Preload, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --------------------------------------------------------------------
// FRAGMENTED LUXURY GRID
// A unique geometric grid with broken segments and asymmetry
// --------------------------------------------------------------------
function ElegantGrid({ scrollY, isMobile, isAccelerating }: { scrollY: number, isMobile: boolean, isAccelerating: boolean }) {
  const gridRef = useRef<THREE.Group>(null);
  const matRef1 = useRef<THREE.LineBasicMaterial>(null);
  const matRef2 = useRef<THREE.LineBasicMaterial>(null);
  const speed = useRef(0.4);

  // Generate deterministic broken lines
  const { geom1, geom2 } = useMemo(() => {
    const generateLines = (size: number, step: number, breakProb: number) => {
      const points = [];
      const halfSize = size / 2;
      for (let i = 0; i <= size / step; i++) {
        const primary = i * step - halfSize;
        
        // Z-axis lines
        let zStart = -halfSize;
        while (zStart < halfSize) {
          const length = Math.random() * 15 + 5;
          const gap = Math.random() > (1 - breakProb) ? Math.random() * 6 + 2 : 0;
          let zEnd = zStart + length;
          if (zEnd > halfSize) zEnd = halfSize;
          points.push(primary, 0, zStart, primary, 0, zEnd);
          zStart = zEnd + gap;
        }

        // X-axis lines
        let xStart = -halfSize;
        while (xStart < halfSize) {
          const length = Math.random() * 15 + 5;
          const gap = Math.random() > (1 - breakProb) ? Math.random() * 6 + 2 : 0;
          let xEnd = xStart + length;
          if (xEnd > halfSize) xEnd = halfSize;
          points.push(xStart, 0, primary, xEnd, 0, primary);
          xStart = xEnd + gap;
        }
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      return geom;
    };

    // Base structural grid (denser, fewer breaks)
    const g1 = generateLines(200, isMobile ? 4 : 2, 0.1);
    // Asymmetric overlay grid (wider, more breaks)
    const g2 = generateLines(200, isMobile ? 16 : 8, 0.4);

    return { geom1: g1, geom2: g2 };
  }, [isMobile]);

  useFrame((state, delta) => {
    if (gridRef.current) {
      // Dramatically increase speed during initialization
      speed.current = THREE.MathUtils.lerp(speed.current, isAccelerating ? 25.0 : 0.4, 0.02);
      
      // Moving the grid seamlessly by modulo of the base step (2)
      // Accumulate using delta for smooth acceleration
      gridRef.current.position.z = (gridRef.current.position.z + speed.current * delta) % 2;
    }

    // Grid Breathing Effect
    if (matRef1.current) {
      matRef1.current.opacity = 0.05 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
    if (matRef2.current) {
      matRef2.current.opacity = 0.08 + Math.cos(state.clock.elapsedTime * 0.3) * 0.04;
    }
  });

  return (
    <group ref={gridRef} position={[0, -5, 0]}>
      {/* Primary Floor Grid */}
      <lineSegments geometry={geom1}>
        <lineBasicMaterial ref={matRef1} color="#ffffff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {/* Secondary Asymmetric Floor Grid (Slightly elevated) */}
      <lineSegments geometry={geom2} position={[0, 0.1, 0]}>
        <lineBasicMaterial ref={matRef2} color="#f0f8ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      
      {/* Ceiling Reflection Grid */}
      <lineSegments geometry={geom1} position={[0, 20, 0]}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.02} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

// --------------------------------------------------------------------
// STARFIELD + FLOATING PARTICLES
// --------------------------------------------------------------------
function ShootingStar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [resetParams, setResetParams] = useState({ x: 0, y: 0, z: 0, speed: 0, delay: 0 });

  const resetStar = () => {
    setResetParams({
      x: (Math.random() - 0.5) * 100,
      y: Math.random() * 30 + 5,
      z: -100 - Math.random() * 50,
      speed: Math.random() * 2 + 2,
      delay: Math.random() * 300 // Rare occurrence
    });
  };

  useEffect(() => resetStar(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    if (resetParams.delay > 0) {
      setResetParams(prev => ({ ...prev, delay: prev.delay - 1 }));
      meshRef.current.position.set(1000, 1000, 1000); // Hide offscreen
      return;
    }

    meshRef.current.position.x += resetParams.speed * 0.1;
    meshRef.current.position.y -= resetParams.speed * 0.1;
    meshRef.current.position.z += resetParams.speed * 4; // Fast streak

    if (meshRef.current.position.z > 20) resetStar();
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.01, 0.05, 8, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function StarFieldMinimal({ scrollY, isMobile, isAccelerating }: { scrollY: number, isMobile: boolean, isAccelerating: boolean }) {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (starsRef.current) {
      const rotationSpeed = isAccelerating ? 0.08 : 0.01;
      
      // Floating / Twinkling rotation
      starsRef.current.rotation.y += rotationSpeed * delta;
      starsRef.current.rotation.x += (rotationSpeed / 2) * delta;
      
      // Scroll Parallax
      starsRef.current.position.z = scrollY * 0.01;
      // Slight vertical float
      starsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 2;
    }
  });

  return (
    <group>
      <group ref={starsRef}>
        <Stars 
          radius={40} 
          depth={60} 
          count={isMobile ? 800 : 2500} 
          factor={isMobile ? 2 : 3} 
          saturation={0} // Pure black and white
          fade 
          speed={0.5} 
        />
      </group>
      {!isMobile && (
        <>
          <ShootingStar />
          <ShootingStar />
        </>
      )}
    </group>
  );
}

// --------------------------------------------------------------------
// LIGHTING AND FOG (DEPTH)
// --------------------------------------------------------------------
function DepthEnvironment() {
  return (
    <>
      {/* Pure black void fog */}
      <fogExp2 attach="fog" args={["#000000", 0.025]} />
      {/* Very subtle environmental light */}
      <ambientLight intensity={0.5} color="#ffffff" />
      {/* Directional light simulating a distant white star */}
      <directionalLight position={[0, 20, -20]} intensity={1} color="#ffffff" />
      {/* Very faint cyan tint spotlight purely for reflections */}
      <spotLight position={[0, 10, 0]} intensity={2} color="#e0ffff" distance={40} angle={Math.PI / 2} penumbra={1} />
    </>
  );
}

// --------------------------------------------------------------------
// MASTER SCENE COMPONENT
// --------------------------------------------------------------------
function BackgroundSystem({ isBooted, isMobile, scrollY, isAccelerating }: { isBooted: boolean, isMobile: boolean, scrollY: number, isAccelerating: boolean }) {
  useFrame((state) => {
    if (!isBooted) return;
    
    // Zoom in when accelerating
    const targetFov = isAccelerating ? 110 : 65;
    // @ts-ignore
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, 0.03);
    state.camera.updateProjectionMatrix();

    // Premium Subtle Mouse Parallax
    const targetX = state.pointer.x * 1.5;
    const targetY = state.pointer.y * 1.5 + 1; // +1 elevates camera slightly
    
    // Silky smooth lerp 
    state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);

    // Subtle tilt effect on the entire scene based on mouse X
    state.camera.rotation.z = -(targetX * 0.05);
  });

  return (
    <group visible={isBooted}>
      <DepthEnvironment />
      <ElegantGrid scrollY={scrollY} isMobile={isMobile} isAccelerating={isAccelerating} />
      <StarFieldMinimal scrollY={scrollY} isMobile={isMobile} isAccelerating={isAccelerating} />
      <Preload all />
    </group>
  );
}

// --------------------------------------------------------------------
// WRAPPER & CSS EFFECTS
// --------------------------------------------------------------------
export default function SceneBackground({ isBooted = true }: { isBooted?: boolean }) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 768) setIsMobile(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleInit = () => {
       setIsAccelerating(true);
       setTimeout(() => setIsAccelerating(false), 2000); // Accelerate for 2 seconds
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('projectsInitialized', handleInit);
    
    return () => {
       window.removeEventListener('scroll', handleScroll);
       window.removeEventListener('projectsInitialized', handleInit);
    };
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-black z-0 pointer-events-none" />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-black">
      
      {/* Center Light Pulse Background Effect (Reacts behind typography) */}
      <div 
        className="absolute inset-0 z-0 mix-blend-screen opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(224, 255, 255, 0.04) 0%, transparent 60%)`
        }}
      />

      {isMobile ? (
        /* Lightweight CSS Fallback for Mobile (Prevents iPhone Safari Crashes) */
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_80%)]" />
        </div>
      ) : (
        <Canvas 
           camera={{ position: [0, 1, 10], fov: 65 }} 
           gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
           dpr={[1, 2]} 
        >
          <BackgroundSystem isBooted={isBooted} isMobile={isMobile} scrollY={scrollY} isAccelerating={isAccelerating} />
        </Canvas>
      )}
      
      {/* Front Overlay Gradient to smooth hard edges into black */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none mix-blend-multiply" />
    </div>
  );
}
