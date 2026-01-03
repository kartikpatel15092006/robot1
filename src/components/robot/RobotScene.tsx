import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { RobotHead } from './RobotHead';
import { Particles } from './Particles';
import { Lighting } from './Lighting';
import * as THREE from 'three';

interface CameraRigProps {
  mousePosition: { x: number; y: number };
}

const CameraRig = ({ mousePosition }: CameraRigProps) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    // Subtle parallax camera movement
    targetPosition.current.x = mousePosition.x * 0.3;
    targetPosition.current.y = mousePosition.y * 0.2;
    targetPosition.current.z = 6;

    camera.position.lerp(targetPosition.current, 0.02);
    camera.lookAt(0, -0.5, 0);
  });

  return null;
};

const Scene = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorDistance, setCursorDistance] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({ x, y });
      
      // Calculate distance from center (normalized 0-1)
      const distance = Math.sqrt(x * x + y * y) / Math.sqrt(2);
      setCursorDistance(Math.min(1, distance));
    }
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (containerRef.current && event.touches[0]) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({ x, y });
      
      const distance = Math.sqrt(x * x + y * y) / Math.sqrt(2);
      setCursorDistance(Math.min(1, distance));
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [handleMouseMove, handleTouchMove]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050a15']} />
        <fog attach="fog" args={['#050a15', 8, 25]} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <CameraRig mousePosition={mousePosition} />
        
        <Suspense fallback={null}>
          <Lighting cursorDistance={cursorDistance} />
          <RobotHead mousePosition={mousePosition} cursorDistance={cursorDistance} />
          <Particles />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export const RobotScene = Scene;
