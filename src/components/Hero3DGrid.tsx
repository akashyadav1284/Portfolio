'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GridScene() {
  const gridRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate matrix grid
  const gridSize = 40;
  const divisions = 40;
  
  // Custom shader material for the grid to fade at distance and animate
  const gridMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.3,
  }), []);

  // Generate particles (digital rain/stars)
  const particleCount = 2000;
  const particles = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount; i++) {
      positions[i*3] = (Math.random() - 0.5) * 50; // x
      positions[i*3+1] = Math.random() * 50; // y
      positions[i*3+2] = (Math.random() - 0.5) * 50 - 10; // z
      
      const c = new THREE.Color();
      c.setHSL(0.5 + Math.random() * 0.1, 1, 0.5); // Cyan to blueish
      colors[i*3] = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate grid moving forward
    if (gridRef.current) {
      gridRef.current.position.z = (time * 2) % (gridSize / divisions);
      // Slight wave effect to the grid using rotation
      gridRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.2) * 0.02;
    }
    
    // Animate falling particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i*3+1] -= 0.1; // fall down
        if (positions[i*3+1] < -5) {
          positions[i*3+1] = 50; // reset to top
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotate particle field slowly
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group>
      <gridHelper 
        ref={gridRef}
        args={[gridSize, divisions, 0x00f3ff, 0x0066ff]} 
        position={[0, -2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial 
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Central glow behind the text */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial 
          color={0x002244} 
          transparent 
          opacity={0.5} 
          blending={THREE.AdditiveBlending} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}
