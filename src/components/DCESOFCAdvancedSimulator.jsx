import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Zap, Gauge, Thermometer, Droplet, Play, Pause, RotateCcw, TrendingUp } from 'lucide-react'

export default function DCESOFCAdvancedSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [motorLoad, setMotorLoad] = useState(50)
  const [crackingTemp, setCrackingTemp] = useState(850)
  const [currentData, setCurrentData] = useState({
    power: 0,
    efficiency: 0,
    h2Flow: 0,
    nh3Conversion: 0,
    sofcVoltage: 0,
    dceRPM: 0
  })
  const [history, setHistory] = useState([])
  const [time, setTime] = useState(0)

  // Arrhenius equation for NH3 cracking
  const calculateCracking = (temp) => {
    const R = 8.314 // J/(mol·K)
    const Ea = 170000 // J/mol activation energy
    const A = 1.2e10 // pre-exponential factor
    const T = temp + 273.15 // Celsius to Kelvin
    
    const k = A * Math.exp(-Ea / (R * T))
    const conversion = 1 - Math.exp(-k * 0.5) // simplified residence time
    return Math.min(1, Math.max(0, conversion))
  }

  // SOFC performance model
  const calculateSOFC = (h2Flow, temp) => {
    const cellCount = 500
    const cellVoltage = 0.7 + (temp - 700) * 0.0005 // V (temp dependent)
    const current = h2Flow * 2 * 96485 / 3600 // A (Faraday's law simplified)
    const power = cellCount * cellVoltage * current / 1000 // kW
    return { power, voltage: cellVoltage }
  }

  // DCE (diesel) performance
  const calculateDCE = (load, nh3Remaining) => {
    const maxPower = 200 // kW
    const power = (load / 100) * maxPower * nh3Remaining
    const rpm = 1000 + (load / 100) * 1500
    return { power, rpm }
  }

  // Main simulation
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime(t => t + 1)

      // Calculate conversions
      const conversion = calculateCracking(crackingTemp)
      const h2Flow = motorLoad * 2 * conversion // kg/h simplified
      const nh3Remaining = 1 - conversion

      // SOFC calculations
      const sofc = calculateSOFC(h2Flow, crackingTemp)

      // DCE calculations
      const dce = calculateDCE(motorLoad, nh3Remaining)

      // Total system
      const totalPower = sofc.power + dce.power
      const fuelInput = motorLoad * 15 // kW simplified
      const efficiency = (totalPower / fuelInput) * 100

      const newData = {
        time: time,
        power: totalPower,
        efficiency: Math.min(100, efficiency),
        h2Flow: h2Flow,
        nh3Conversion: conversion * 100,
        sofcVoltage: sofc.voltage,
        dceRPM: dce.rpm,
        sofcPower: sofc.power,
        dcePower: dce.power
      }

      setCurrentData(newData)
      setHistory(prev => [...prev.slice(-30), newData]) // Keep last 30 points
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, motorLoad, crackingTemp, time])

  const reset = () => {
    setIsRunning(false)
    setHistory([])
    setTime(0)
    setCurrentData({
      power: 0,
      efficiency: 0,
      h2Flow: 0,
      nh3Conversion: 0,
      sofcVoltage: 0,
      dceRPM: 0
    })
  }

  return (
    <div className="h-full bg-terminal-darker p-4 md:p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="text-terminal-secondary" size={32} />
          <div>
            <h3 className="text-2xl font-bold text-terminal-secondary">
              DCE-SOFC Hybrid Propulsion
            </h3>
            <p className="text-xs text-gray-500">NH₃ Cracking + Fuel Cell Digital Twin</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-3 border-2 ${
              isRunning 
                ? 'bg-red-500 border-red-500' 
                : 'bg-green-500 border-green-500'
            } text-white`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={reset}
            className="p-3 border-2 border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* P&ID Diagram */}
      <div className="mb-6 bg-terminal-bg border-2 border-terminal-secondary p-4">
        <h4 className="text-sm font-bold text-terminal-secondary mb-3">Process & Instrumentation Diagram</h4>
        <div className="relative h-40 bg-terminal-darker border border-terminal-border flex items-center justify-center">
          <svg viewBox="0 0 800 160" className="w-full h-full">
            {/* NH3 Tank */}
            <rect x="20" y="40" width="60" height="80" fill="none" stroke="#00d9ff" strokeWidth="2"/>
            <text x="50" y="85" fill="#00d9ff" fontSize="12" textAnchor="middle">NH₃</text>
            
            {/* Flow to Cracker */}
            <line x1="80" y1="80" x2="140" y2="80" stroke="#00d9ff" strokeWidth="2" markerEnd="url(#arrowblue)"/>
            
            {/* Cracker */}
            <circle cx="180" cy="80" r="40" fill="none" stroke="#ff6b35" strokeWidth="2"/>
            <text x="180" y="85" fill="#ff6b35" fontSize="11" textAnchor="middle">CRACKER</text>
            <text x="180" y="100" fill="#ff6b35" fontSize="9" textAnchor="middle">{crackingTemp}°C</text>
            
            {/* H2 to SOFC */}
            <line x1="220" y1="60" x2="300" y2="60" stroke="#00d9ff" strokeWidth="2" markerEnd="url(#arrowblue)"/>
            <text x="260" y="50" fill="#00d9ff" fontSize="10">H₂</text>
            
            {/* SOFC */}
            <rect x="300" y="30" width="80" height="60" fill="none" stroke="#00d9ff" strokeWidth="2"/>
            <text x="340" y="65" fill="#00d9ff" fontSize="12" textAnchor="middle">SOFC</text>
            
            {/* NH3 to DCE */}
            <line x1="220" y1="100" x2="300" y2="100" stroke="#ff6b35" strokeWidth="2" markerEnd="url(#arrowred)"/>
            <text x="260" y="115" fill="#ff6b35" fontSize="10">NH₃</text>
            
            {/* DCE */}
            <rect x="300" y="90" width="80" height="60" fill="none" stroke="#ff6b35" strokeWidth="2"/>
            <text x="340" y="125" fill="#ff6b35" fontSize="12" textAnchor="middle">DCE</text>
            
            {/* Power Output */}
            <line x1="380" y1="60" x2="460" y2="60" stroke="#00d9ff" strokeWidth="3"/>
            <line x1="380" y1="120" x2="460" y2="120" stroke="#ff6b35" strokeWidth="3"/>
            <line x1="460" y1="60" x2="460" y2="120" stroke="#4ade80" strokeWidth="3"/>
            <line x1="460" y1="90" x2="520" y2="90" stroke="#4ade80" strokeWidth="3" markerEnd="url(#arrowgreen)"/>
            
            <text x="540" y="95" fill="#4ade80" fontSize="14" fontWeight="bold">{currentData.power.toFixed(1)} kW</text>
            
            {/* Arrow definitions */}
            <defs>
              <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#00d9ff" />
              </marker>
              <marker id="arrowred" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#ff6b35" />
              </marker>
              <marker id="arrowgreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#4ade80" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-terminal-bg border-2 border-terminal-border p-4">
          <label className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-2">
              <Gauge size={16} />
              Motor Load: {motorLoad}%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={motorLoad}
            onChange={(e) => setMotorLoad(Number(e.target.value))}
            className="w-full"
            disabled={isRunning}
          />
        </div>

        <div className="bg-terminal-bg border-2 border-terminal-border p-4">
          <label className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-2">
              <Thermometer size={16} />
              Cracking Temp: {crackingTemp}°C
            </span>
          </label>
          <input
            type="range"
            min="700"
            max="1000"
            value={crackingTemp}
            onChange={(e) => setCrackingTemp(Number(e.target.value))}
            className="w-full"
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-terminal-bg border border-terminal-border p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Zap size={14} />
            Total Power
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-text">
            {currentData.power.toFixed(1)} kW
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <TrendingUp size={14} />
            Efficiency
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-secondary">
            {currentData.efficiency.toFixed(1)}%
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Thermometer size={14} />
            NH₃ Conversion
          </div>
          <div className="text-xl md:text-2xl font-bold text-terminal-accent">
            {currentData.nh3Conversion.toFixed(1)}%
          </div>
        </div>

        <div className="bg-terminal-bg border border-terminal-border p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Droplet size={14} />
            CO₂ Emissions
          </div>
          <div className="text-xl md:text-2xl font-bold text-green-500">
            0 g/kWh
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Power Output Chart */}
        <div className="bg-terminal-bg border-2 border-terminal-border p-4">
          <h4 className="text-sm font-bold text-terminal-text mb-3">Power Output Over Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d35', border: '1px solid #00d9ff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sofcPower" stroke="#00d9ff" name="SOFC (kW)" />
              <Line type="monotone" dataKey="dcePower" stroke="#ff6b35" name="DCE (kW)" />
              <Line type="monotone" dataKey="power" stroke="#4ade80" name="Total (kW)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency Chart */}
        <div className="bg-terminal-bg border-2 border-terminal-border p-4">
          <h4 className="text-sm font-bold text-terminal-text mb-3">System Efficiency</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d35', border: '1px solid #00d9ff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="efficiency" stroke="#00d9ff" name="Efficiency (%)" strokeWidth={2} />
              <Line type="monotone" dataKey="nh3Conversion" stroke="#ff6b35" name="NH₃ Conv. (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
