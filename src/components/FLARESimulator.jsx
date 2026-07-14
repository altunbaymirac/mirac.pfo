import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Radio, MapPin, Activity, Battery, Signal } from 'lucide-react'

export default function FLARESimulator() {
  const [isActive, setIsActive] = useState(false)
  const [battery, setBattery] = useState(100)
  const [signalStrength, setSignalStrength] = useState(0)
  const [beaconCount, setBeaconCount] = useState(0)
  const [registry] = useState({ buildingId: 'BLD-04', floor: 3, installedLocation: 'Bedroom A' })

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setBattery(prev => Math.max(0, prev - 0.1))
        setSignalStrength(Math.floor(Math.random() * 100))
        setBeaconCount(prev => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <div className="bg-terminal-darker border-2 border-terminal-accent p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-terminal-accent flex items-center gap-2">
          <Radio size={24} />
          ConcreteWeb Beacon Report Simulator
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 border-2 font-mono ${
            isActive 
              ? 'bg-red-500 border-red-500 text-white' 
              : 'bg-green-500 border-green-500 text-white'
          }`}
        >
          {isActive ? 'DEACTIVATE' : 'SEND LIFE SIGN'}
        </motion.button>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Battery size={14} />
            <span>Battery</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-text">
            {battery.toFixed(1)}%
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Signal size={14} />
            <span>Signal</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-secondary">
            {signalStrength} dBm
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Activity size={14} />
            <span>Beacons</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-accent">
            {beaconCount}
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <MapPin size={14} />
            <span>Registry</span>
          </div>
          <div className="text-xs font-mono text-terminal-text">
            {registry.buildingId} / Floor {registry.floor} / {registry.installedLocation}
          </div>
        </div>
      </div>

      {/* Signal Animation */}
      {isActive && (
        <div className="relative h-32 bg-terminal-bg border border-terminal-border flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-16 h-16 rounded-full border-4 border-terminal-accent"
          />
          <motion.div
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute w-16 h-16 rounded-full border-4 border-terminal-accent"
          />
          <Radio className="text-terminal-accent" size={32} />
        </div>
      )}

      {/* Status Message */}
      <div className="bg-terminal-bg border-2 border-terminal-accent p-4">
        <p className="text-terminal-accent font-mono text-sm">
          {isActive 
            ? `Broadcasting life sign report on 868 MHz... Beacon #${beaconCount}` 
            : 'Beacon standby mode. Press SEND LIFE SIGN to start.'}
        </p>
      </div>
    </div>
  )
}
