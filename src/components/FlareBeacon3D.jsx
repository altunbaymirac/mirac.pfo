import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function BeaconDevice({ isTransmitting }) {
  const meshRef = useRef()
  const signalRing1 = useRef()
  const signalRing2 = useRef()
  const signalRing3 = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Rotate beacon slowly
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.3
    }

    // Animate signal rings if transmitting
    if (isTransmitting) {
      if (signalRing1.current) {
        signalRing1.current.scale.x = 1 + Math.sin(time * 2) * 0.3
        signalRing1.current.scale.y = 1 + Math.sin(time * 2) * 0.3
        signalRing1.current.material.opacity = 0.5 + Math.sin(time * 2) * 0.3
      }
      if (signalRing2.current) {
        signalRing2.current.scale.x = 1 + Math.sin(time * 2 + Math.PI / 3) * 0.4
        signalRing2.current.scale.y = 1 + Math.sin(time * 2 + Math.PI / 3) * 0.4
        signalRing2.current.material.opacity = 0.4 + Math.sin(time * 2 + Math.PI / 3) * 0.3
      }
      if (signalRing3.current) {
        signalRing3.current.scale.x = 1 + Math.sin(time * 2 + (2 * Math.PI) / 3) * 0.5
        signalRing3.current.scale.y = 1 + Math.sin(time * 2 + (2 * Math.PI) / 3) * 0.5
        signalRing3.current.material.opacity = 0.3 + Math.sin(time * 2 + (2 * Math.PI) / 3) * 0.3
      }
    }
  })

  return (
    <group>
      {/* Main Beacon Body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* Body - rounded box */}
        <boxGeometry args={[1, 0.4, 0.6]} />
        <meshStandardMaterial
          color="#ff6b35"
          metalness={0.8}
          roughness={0.2}
          emissive={isTransmitting ? "#ff6b35" : "#000000"}
          emissiveIntensity={isTransmitting ? 0.5 : 0}
        />
      </mesh>

      {/* LED Indicator */}
      <mesh position={[0, 0.25, 0.31]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={isTransmitting ? "#00ff41" : "#333333"}
          emissive={isTransmitting ? "#00ff41" : "#000000"}
          emissiveIntensity={isTransmitting ? 1 : 0}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Antenna tip */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={isTransmitting ? 1.5 : 0}
        />
      </mesh>

      {/* Signal rings (only visible when transmitting) */}
      {isTransmitting && (
        <>
          <mesh ref={signalRing1} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.02, 16, 100]} />
            <meshBasicMaterial color="#00ff41" transparent opacity={0.5} />
          </mesh>
          <mesh ref={signalRing2} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.02, 16, 100]} />
            <meshBasicMaterial color="#00d9ff" transparent opacity={0.4} />
          </mesh>
          <mesh ref={signalRing3} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8, 0.02, 16, 100]} />
            <meshBasicMaterial color="#ff6b35" transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {/* Label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.15}
        color="#00ff41"
        anchorX="center"
        anchorY="middle"
      >
        FLARE BEACON
      </Text>
    </group>
  )
}

export default function FlareBeacon3D() {
  const [isTransmitting, setIsTransmitting] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[500px] bg-terminal-darker border-2 border-terminal-text relative"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-terminal-bg/80 backdrop-blur-sm p-3 border-b-2 border-terminal-text">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-terminal-text font-bold text-lg neon-glow">3D FLARE BEACON</h3>
            <p className="text-xs text-gray-500">Interactive Model - Drag to rotate</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTransmitting(!isTransmitting)}
            className={`px-4 py-2 border-2 font-mono text-sm transition-all ${
              isTransmitting
                ? 'border-terminal-text bg-terminal-text text-terminal-bg'
                : 'border-terminal-border text-terminal-text hover:border-terminal-text'
            }`}
          >
            {isTransmitting ? '📡 TRANSMITTING' : '⏸ STANDBY'}
          </motion.button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d9ff" />
        
        <BeaconDevice isTransmitting={isTransmitting} />
        
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          autoRotate={!isTransmitting}
          autoRotateSpeed={2}
        />
      </Canvas>

      {/* Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-terminal-bg/80 backdrop-blur-sm p-3 border-t-2 border-terminal-text">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Status:</span>
            <span className={`ml-2 font-bold ${isTransmitting ? 'text-terminal-text' : 'text-gray-500'}`}>
              {isTransmitting ? 'ACTIVE' : 'PASSIVE'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Frequency:</span>
            <span className="ml-2 text-terminal-secondary font-mono">868 MHz</span>
          </div>
          <div>
            <span className="text-gray-500">Range:</span>
            <span className="ml-2 text-terminal-accent font-mono">1-3 km</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
