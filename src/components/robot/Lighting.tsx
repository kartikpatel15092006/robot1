import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightingProps {
  cursorDistance: number;
}

export const Lighting = ({ cursorDistance }: LightingProps) => {
  const rimLightRef = useRef<THREE.PointLight>(null);
  const keyLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Subtle light movement
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 2 + Math.sin(time * 0.5) * 0.3;
    }
    
    if (keyLightRef.current) {
      // Increase key light when cursor is close
      keyLightRef.current.intensity = 1.5 + (1 - cursorDistance) * 0.5;
    }
  });

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.1} color="#0a1628" />
      
      {/* Key light - front */}
      <spotLight
        ref={keyLightRef}
        position={[0, 2, 8]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Fill light - left */}
      <pointLight
        position={[-5, 1, 3]}
        intensity={0.4}
        color="#00a8cc"
      />
      
      {/* Fill light - right */}
      <pointLight
        position={[5, 1, 3]}
        intensity={0.4}
        color="#00a8cc"
      />
      
      {/* Rim light - back left */}
      <pointLight
        ref={rimLightRef}
        position={[-3, 2, -3]}
        intensity={2}
        color="#00d4ff"
      />
      
      {/* Rim light - back right */}
      <pointLight
        position={[3, 2, -3]}
        intensity={2}
        color="#00d4ff"
      />
      
      {/* Top light */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#1a2a4a"
      />
      
      {/* Under glow */}
      <pointLight
        position={[0, -4, 2]}
        intensity={0.3}
        color="#00d4ff"
      />
    </>
  );
};
