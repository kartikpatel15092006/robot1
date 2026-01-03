import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RobotHeadProps {
  mousePosition: { x: number; y: number };
  cursorDistance: number;
}

export const RobotHead = ({ mousePosition, cursorDistance }: RobotHeadProps) => {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const eyeTargetPosition = useRef({ x: 0, y: 0 });
  const currentEyePosition = useRef({ x: 0, y: 0 });
  const blinkProgress = useRef(0);
  const lastBlinkTime = useRef(0);
  const breathingPhase = useRef(0);

  // Materials
  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x4a5568,
    metalness: 0.9,
    roughness: 0.2,
  }), []);

  const darkMetalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x2d3748,
    metalness: 0.95,
    roughness: 0.15,
  }), []);

  const eyeGlowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    emissive: 0x00d4ff,
    emissiveIntensity: 1.5,
    metalness: 0.1,
    roughness: 0.1,
  }), []);

  const pupilMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x001122,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x00a8cc,
    emissive: 0x00a8cc,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Update target rotation based on mouse
    targetRotation.current.y = mousePosition.x * 0.4;
    targetRotation.current.x = -mousePosition.y * 0.25;
    
    // Smooth interpolation for head rotation
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;
    
    // Eye tracking (faster than head)
    eyeTargetPosition.current.x = mousePosition.x * 0.15;
    eyeTargetPosition.current.y = mousePosition.y * 0.1;
    
    currentEyePosition.current.x += (eyeTargetPosition.current.x - currentEyePosition.current.x) * 0.15;
    currentEyePosition.current.y += (eyeTargetPosition.current.y - currentEyePosition.current.y) * 0.15;
    
    // Apply head rotation
    if (headRef.current) {
      headRef.current.rotation.x = currentRotation.current.x;
      headRef.current.rotation.y = currentRotation.current.y;
      
      // Subtle breathing animation
      breathingPhase.current = Math.sin(time * 0.8) * 0.01;
      headRef.current.position.y = breathingPhase.current;
      headRef.current.scale.setScalar(1 + Math.sin(time * 0.8) * 0.005);
    }
    
    // Apply pupil movement
    if (leftPupilRef.current && rightPupilRef.current) {
      leftPupilRef.current.position.x = currentEyePosition.current.x;
      leftPupilRef.current.position.y = currentEyePosition.current.y;
      rightPupilRef.current.position.x = currentEyePosition.current.x;
      rightPupilRef.current.position.y = currentEyePosition.current.y;
    }
    
    // Blinking animation
    if (time - lastBlinkTime.current > 3 + Math.random() * 2) {
      lastBlinkTime.current = time;
    }
    
    const blinkDuration = 0.15;
    const timeSinceBlink = time - lastBlinkTime.current;
    if (timeSinceBlink < blinkDuration) {
      blinkProgress.current = Math.sin((timeSinceBlink / blinkDuration) * Math.PI);
    } else {
      blinkProgress.current = 0;
    }
    
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkScale = 1 - blinkProgress.current * 0.9;
      leftEyeRef.current.scale.y = blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
    }
    
    // Dynamic eye glow based on cursor proximity
    const glowIntensity = 1.5 + (1 - cursorDistance) * 1.5;
    eyeGlowMaterial.emissiveIntensity = glowIntensity;
  });

  return (
    <group ref={headRef}>
      {/* Main head structure */}
      <mesh position={[0, 0, 0]} material={metalMaterial}>
        <boxGeometry args={[1.8, 2.2, 1.8]} />
      </mesh>
      
      {/* Rounded top */}
      <mesh position={[0, 1.1, 0]} material={metalMaterial}>
        <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Forehead panel */}
      <mesh position={[0, 0.8, 0.91]} material={darkMetalMaterial}>
        <boxGeometry args={[1.4, 0.5, 0.05]} />
      </mesh>
      
      {/* Eye sockets */}
      <group position={[0, 0.2, 0.85]}>
        {/* Left eye socket */}
        <mesh position={[-0.45, 0, 0]} material={darkMetalMaterial}>
          <cylinderGeometry args={[0.32, 0.32, 0.2, 32]} />
        </mesh>
        
        {/* Right eye socket */}
        <mesh position={[0.45, 0, 0]} material={darkMetalMaterial}>
          <cylinderGeometry args={[0.32, 0.32, 0.2, 32]} />
        </mesh>
        
        {/* Left eye */}
        <mesh ref={leftEyeRef} position={[-0.45, 0, 0.08]} material={eyeGlowMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
        </mesh>
        
        {/* Right eye */}
        <mesh ref={rightEyeRef} position={[0.45, 0, 0.08]} material={eyeGlowMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
        </mesh>
        
        {/* Left pupil */}
        <mesh ref={leftPupilRef} position={[-0.45, 0, 0.12]} material={pupilMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        </mesh>
        
        {/* Right pupil */}
        <mesh ref={rightPupilRef} position={[0.45, 0, 0.12]} material={pupilMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        </mesh>
      </group>
      
      {/* Nose bridge */}
      <mesh position={[0, -0.1, 0.92]} material={metalMaterial}>
        <boxGeometry args={[0.15, 0.6, 0.1]} />
      </mesh>
      
      {/* Mouth plate */}
      <mesh position={[0, -0.65, 0.91]} material={darkMetalMaterial}>
        <boxGeometry args={[0.9, 0.25, 0.05]} />
      </mesh>
      
      {/* Mouth grill lines */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.65, 0.94]} material={accentMaterial}>
          <boxGeometry args={[0.02, 0.15, 0.02]} />
        </mesh>
      ))}
      
      {/* Cheek panels */}
      <mesh position={[-0.91, 0, 0.3]} rotation={[0, Math.PI / 6, 0]} material={metalMaterial}>
        <boxGeometry args={[0.1, 1.5, 0.8]} />
      </mesh>
      <mesh position={[0.91, 0, 0.3]} rotation={[0, -Math.PI / 6, 0]} material={metalMaterial}>
        <boxGeometry args={[0.1, 1.5, 0.8]} />
      </mesh>
      
      {/* Side accent lights */}
      <mesh position={[-0.92, 0.3, 0.5]} material={accentMaterial}>
        <boxGeometry args={[0.02, 0.4, 0.1]} />
      </mesh>
      <mesh position={[0.92, 0.3, 0.5]} material={accentMaterial}>
        <boxGeometry args={[0.02, 0.4, 0.1]} />
      </mesh>
      
      {/* Jaw structure */}
      <mesh position={[0, -1, 0]} material={metalMaterial}>
        <boxGeometry args={[1.6, 0.4, 1.5]} />
      </mesh>
      
      {/* Neck */}
      <group position={[0, -1.5, 0]}>
        <mesh material={darkMetalMaterial}>
          <cylinderGeometry args={[0.5, 0.6, 0.8, 16]} />
        </mesh>
        
        {/* Neck rings */}
        <mesh position={[0, 0.2, 0]} material={accentMaterial}>
          <torusGeometry args={[0.52, 0.02, 8, 32]} />
        </mesh>
        <mesh position={[0, 0, 0]} material={accentMaterial}>
          <torusGeometry args={[0.55, 0.02, 8, 32]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} material={accentMaterial}>
          <torusGeometry args={[0.58, 0.02, 8, 32]} />
        </mesh>
      </group>
      
      {/* Shoulder hints */}
      <mesh position={[-1.2, -2.1, 0]} material={metalMaterial}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>
      <mesh position={[1.2, -2.1, 0]} material={metalMaterial}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>
      
      {/* Upper body hint */}
      <mesh position={[0, -2.3, 0]} material={darkMetalMaterial}>
        <boxGeometry args={[2.2, 0.6, 1.2]} />
      </mesh>
    </group>
  );
};
