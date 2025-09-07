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
  showAngles?: boolean;
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
  const latitudeRef = useRef<THREE.Group>(null);
  const longitudeRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  // Create latitude lines (horizontal circles)
  const createLatitudeLines = () => {
    const lines = [];
    const latitudes = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]; // More scientific spacing
    
    for (let i = 0; i < latitudes.length; i++) {
      const lat = latitudes[i];
      const radius = Math.sqrt(1 - lat * lat);
      const points = [];
      
      for (let j = 0; j <= 64; j++) {
        const angle = (j / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          lat,
          Math.sin(angle) * radius
        ));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(
        <lineSegments key={`lat-${i}`}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial 
            attach="material"
            color="#666666" 
            transparent 
            opacity={0.3 + purity * 0.2}
          />
        </lineSegments>
      );
    }
    return lines;
  };

  // Create longitude lines (vertical semicircles)
  const createLongitudeLines = () => {
    const lines = [];
    const longitudes = 12; // 12 longitude lines (30° apart)
    
    for (let i = 0; i < longitudes; i++) {
      const angle = (i / longitudes) * Math.PI * 2;
      const points = [];
      
      for (let j = 0; j <= 32; j++) {
        const phi = (j / 32) * Math.PI;
        points.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(angle),
          -Math.cos(phi),
          Math.sin(phi) * Math.sin(angle)
        ));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(
        <lineSegments key={`long-${i}`}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial 
            attach="material"
            color="#666666" 
            transparent 
            opacity={0.3 + purity * 0.2}
          />
        </lineSegments>
      );
    }
    return lines;
  };
  
  return (
    <group>
      {/* Main sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.08 + purity * 0.15}
          metalness={0.05}
          roughness={0.9}
          clearcoat={0.1}
        />
      </mesh>
      
      {/* Scientific grid system */}
      <group ref={latitudeRef}>
        {createLatitudeLines()}
      </group>
      <group ref={longitudeRef}>
        {createLongitudeLines()}
      </group>
      
      {/* Equatorial circle highlight */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.005, 0.002, 8, 64]} />
        <meshBasicMaterial color="#444444" transparent opacity={0.6} />
      </mesh>
      
      {/* Prime meridian highlight */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.005, 0.002, 8, 32, Math.PI]} />
        <meshBasicMaterial color="#444444" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

const CoordinateAxes: React.FC<{ showAngles?: boolean }> = ({ showAngles = false }) => {
  const axisLength = 1.3;
  const tickLength = 0.08;
  const tickPositions = [-1, 0, 1]; // Scientific standard positions
  
  return (
    <group>
      {/* X axis - Red */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, axisLength * 2, 8]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      
      {/* X axis tick marks and labels */}
      {tickPositions.map((pos, i) => (
        <group key={`x-tick-${i}`}>
          {/* Y-direction tick */}
          <mesh position={[pos, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, tickLength, 8]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
          {/* Z-direction tick */}
          <mesh position={[pos, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, tickLength, 8]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
          {/* Numerical label */}
          <Text
            position={[pos, -0.15, -0.15]}
            fontSize={0.1}
            color="#ff4444"
            anchorX="center"
            anchorY="middle"
          >
            {pos === 0 ? '0' : pos > 0 ? '+1' : '-1'}
          </Text>
        </group>
      ))}
      
      {/* X axis label */}
      <Text
        position={[axisLength + 0.25, 0, 0]}
        fontSize={0.18}
        color="#ff4444"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>
      
      {/* Y axis - Green */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, axisLength * 2, 8]} />
        <meshBasicMaterial color="#44ff44" />
      </mesh>
      
      {/* Y axis tick marks and labels */}
      {tickPositions.map((pos, i) => (
        <group key={`y-tick-${i}`}>
          {/* X-direction tick */}
          <mesh position={[0, pos, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, tickLength, 8]} />
            <meshBasicMaterial color="#44ff44" />
          </mesh>
          {/* Z-direction tick */}
          <mesh position={[0, pos, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, tickLength, 8]} />
            <meshBasicMaterial color="#44ff44" />
          </mesh>
          {/* Numerical label */}
          <Text
            position={[-0.15, pos, -0.15]}
            fontSize={0.1}
            color="#44ff44"
            anchorX="center"
            anchorY="middle"
          >
            {pos === 0 ? '0' : pos > 0 ? '+1' : '-1'}
          </Text>
        </group>
      ))}
      
      {/* Y axis label */}
      <Text
        position={[0, axisLength + 0.25, 0]}
        fontSize={0.18}
        color="#44ff44"
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>
      
      {/* Z axis - Blue */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, axisLength * 2, 8]} />
        <meshBasicMaterial color="#4488ff" />
      </mesh>
      
      {/* Z axis tick marks and labels */}
      {tickPositions.map((pos, i) => (
        <group key={`z-tick-${i}`}>
          {/* X-direction tick */}
          <mesh position={[0, 0, pos]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, tickLength, 8]} />
            <meshBasicMaterial color="#4488ff" />
          </mesh>
          {/* Y-direction tick */}
          <mesh position={[0, 0, pos]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, tickLength, 8]} />
            <meshBasicMaterial color="#4488ff" />
          </mesh>
          {/* Numerical label */}
          <Text
            position={[-0.15, -0.15, pos]}
            fontSize={0.1}
            color="#4488ff"
            anchorX="center"
            anchorY="middle"
          >
            {pos === 0 ? '0' : pos > 0 ? '+1' : '-1'}
          </Text>
        </group>
      ))}
      
      {/* Z axis label */}
      <Text
        position={[0, 0, axisLength + 0.25]}
        fontSize={0.18}
        color="#4488ff"
        anchorX="center"
        anchorY="middle"
      >
        Z
      </Text>
      
      {/* Quantum state labels */}
      <Text
        position={[0, 0, 1.6]}
        fontSize={0.14}
        color="#4488ff"
        anchorX="center"
        anchorY="middle"
      >
        |0⟩
      </Text>
      <Text
        position={[0, 0, -1.6]}
        fontSize={0.14}
        color="#4488ff"
        anchorX="center"
        anchorY="middle"
      >
        |1⟩
      </Text>
      
      {showAngles && (
        <>
          {/* Polar angle θ indicator */}
          <Text
            position={[1.3, 0, 1.3]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            θ
          </Text>
          {/* Azimuthal angle φ indicator */}
          <Text
            position={[1.3, 1.3, 0]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            φ
          </Text>
          
          {/* Angle arcs */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.9, 0.008, 8, 32, Math.PI / 4]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.008, 8, 32, Math.PI / 3]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
};

const BlochSphere3D: React.FC<BlochSphereProps> = ({ 
  vector = { x: 0, y: 0, z: 1 }, 
  purity = 1,
  showLabels = true,
  showAngles = false,
  size = 400 
}) => {
  return (
    <div className="w-full h-full quantum-sphere-glow rounded-lg">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ position: [3, 3, 3], fov: 50 }}
        style={{ width: size, height: size }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#195DDB" castShadow={false} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9D4EDD" />
        
        <SphereWithShading purity={purity} />
        <BlochArrow vector={vector} purity={purity} />
        {showLabels && <CoordinateAxes showAngles={showAngles} />}
        
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