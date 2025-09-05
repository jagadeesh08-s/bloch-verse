import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BlochVector {
  x: number;
  y: number;
  z: number;
}

interface BlochSphereProps {
  vector?: BlochVector;
  purity?: number;
  showLabels?: boolean;
  size?: number;
  className?: string;
}

const BlochArrow: React.FC<{ vector: BlochVector; purity: number }> = ({ vector, purity }) => {
  const arrowRef = useRef<THREE.Group>(null);
  const color = new THREE.Color().setHSL(0.5 + purity * 0.3, 1, 0.6);
  
  return (
    <group ref={arrowRef}>
      {/* Vector line */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z), 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Arrow head */}
      <mesh position={[vector.x, vector.y, vector.z]}>
        <coneGeometry args={[0.05, 0.2, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

const SphereWithShading: React.FC<{ purity: number }> = ({ purity }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.2 + purity * 0.4}
        wireframe={purity < 0.7}
        metalness={0.1}
        roughness={0.8}
        clearcoat={0.3}
      />
    </mesh>
  );
};

const CoordinateAxes: React.FC = () => {
  const axisLength = 1.3;
  
  return (
    <group>
      {/* X axis - Red */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, axisLength * 2, 8]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <Text
        position={[axisLength + 0.2, 0, 0]}
        fontSize={0.15}
        color="red"
        anchorX="center"
      >
        X
      </Text>
      
      {/* Y axis - Green */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, axisLength * 2, 8]} />
        <meshBasicMaterial color="green" />
      </mesh>
      <Text
        position={[0, axisLength + 0.2, 0]}
        fontSize={0.15}
        color="green"
        anchorX="center"
      >
        Y
      </Text>
      
      {/* Z axis - Blue */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, axisLength * 2, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <Text
        position={[0, 0, axisLength + 0.2]}
        fontSize={0.15}
        color="#00D4FF"
        anchorX="center"
      >
        Z
      </Text>
      
      {/* Quantum state labels */}
      <Text
        position={[0, 0, 1.5]}
        fontSize={0.12}
        color="#00D4FF"
        anchorX="center"
      >
        |0⟩
      </Text>
      <Text
        position={[0, 0, -1.5]}
        fontSize={0.12}
        color="#00D4FF"
        anchorX="center"
      >
        |1⟩
      </Text>
    </group>
  );
};

const BlochSphere3D: React.FC<BlochSphereProps> = ({ 
  vector = { x: 0, y: 0, z: 1 }, 
  purity = 1,
  showLabels = true,
  size = 400 
}) => {
  return (
    <div className="w-full h-full quantum-sphere-glow rounded-lg">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        style={{ width: size, height: size }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#195DDB" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9D4EDD" />
        
        <SphereWithShading purity={purity} />
        <BlochArrow vector={vector} purity={purity} />
        {showLabels && <CoordinateAxes />}
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default BlochSphere3D;
export type { BlochVector };