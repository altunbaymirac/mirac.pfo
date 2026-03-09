import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Gauge, Thermometer, Droplet } from 'lucide-react'

export default function DCESOFCSimulator() {
  const [motorLoad, setMotorLoad] = useState(50)
  const [temperature, setTemperature] = useState(850)
  const [power, setPower] = useState(0)
  const [efficiency, setEfficiency] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (isRunning) {
      // Arrhenius equation simplified
      const k = 1.2e10 * Math.exp(-170000 / (8.314 * temperature))
      const conversion = 1 - Math.exp(-k * 0.5)
      
      // SOFC power calculation
      const sofcPower = 500 * 0.75 * 200 * conversion // cells * voltage * current
      const dcePower = motorLoad * 10 // simplified
      
      const totalPower = sofcPower + dcePower
      const eff = (totalPower / (motorLoad * 15)) * 100
      
      setPower(totalPower / 1000) // kW
      setEfficiency(Math.min(100, eff))
    }
  }, [motorLoad, temperature, isRunning])

  return (
    <div className="bg-terminal-darker border-2 border-terminal-secondary p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-terminal-secondary flex items-center gap-2">
          <Zap size={24} />
          DCE-SOFC Digital Twin
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 border-2 font-mono ${
            isRunning 
              ? 'bg-red-500 border-red-500 text-white' 
              : 'bg-green-500 border-green-500 text-white'
          }`}
        >
          {isRunning ? 'STOP ENGINE' : 'START ENGINE'}
        </motion.button>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm font-mono flex items-center justify-between mb-2">
            <span>Motor Load: {motorLoad}%</span>
            <Gauge size={16} />
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={motorLoad}
            onChange={(e) => setMotorLoad(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm font-mono flex items-center justify-between mb-2">
            <span>Cracking Temperature: {temperature}°C</span>
            <Thermometer size={16} />
          </label>
          <input
            type="range"
            min="700"
            max="1000"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Zap size={14} />
            <span>Power</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-text">
            {power.toFixed(1)} kW
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Gauge size={14} />
            <span>Efficiency</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-secondary">
            {efficiency.toFixed(1)}%
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Thermometer size={14} />
            <span>NH₃ Cracking</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-accent">
            {temperature}°C
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Droplet size={14} />
            <span>CO₂</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-green-500">
            0 g/kWh
          </div>
        </div>
      </div>

      {/* Engine Animation */}
      {isRunning && (
        <div className="relative h-24 bg-terminal-bg border border-terminal-border flex items-center justify-center overflow-hidden">
          <motion.div
            animate={{
              x: [-100, 100]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute h-1 w-32 bg-gradient-to-r from-transparent via-terminal-secondary to-transparent"
          />
          <Zap className="text-terminal-secondary relative z-10" size={32} />
        </div>
      )}

      {/* Status */}
      <div className="bg-terminal-bg border-2 border-terminal-secondary p-4">
        <p className="text-terminal-secondary font-mono text-sm">
          {isRunning 
            ? `⚡ Hybrid propulsion active. SOFC + DCE generating ${power.toFixed(1)} kW at ${efficiency.toFixed(1)}% efficiency` 
            : '⏸️ Engine stopped. Adjust parameters and press START ENGINE.'}
        </p>
      </div>
    </div>
  )
}
