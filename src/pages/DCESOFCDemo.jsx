import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Zap, Gauge, Thermometer, Droplet, Play, Pause, RotateCcw, Info, TrendingUp, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DCESOFCDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [showHelp, setShowHelp] = useState(true)
  const [motorLoad, setMotorLoad] = useState(50)
  const [crackingTemp, setCrackingTemp] = useState(850)
  const [sofcCells, setSOFCCells] = useState(500)
  
  const [currentData, setCurrentData] = useState({
    totalPower: 0,
    efficiency: 0,
    h2Flow: 0,
    nh3Conversion: 0,
    sofcVoltage: 0,
    sofcCurrent: 0,
    dcePower: 0,
    sofcPower: 0,
    noxEmission: 0
  })
  
  const [history, setHistory] = useState([])
  const [time, setTime] = useState(0)

  // Arrhenius equation for NH3 cracking
  const calculateCracking = (temp) => {
    const R = 8.314 // J/(mol·K)
    const Ea = 170000 // J/mol
    const A = 1.2e10
    const T = temp + 273.15
    
    const k = A * Math.exp(-Ea / (R * T))
    const conversion = 1 - Math.exp(-k * 0.5)
    return Math.min(1, Math.max(0, conversion))
  }

  // SOFC electrochemistry
  const calculateSOFC = (h2Flow, temp) => {
    const F = 96485 // Faraday constant
    const n = 2 // electrons per H2
    
    // Nernst equation simplified
    const E0 = 1.23 // Standard potential (V)
    const tempK = temp + 273.15
    const voltage = E0 - 0.0002 * (tempK - 1073) // Temperature correction
    
    // Current from H2 flow (simplified)
    const current = (h2Flow * n * F) / 3600 // Amperes
    
    // Power
    const power = (sofcCells * voltage * current) / 1000 // kW
    
    return { power, voltage, current }
  }

  // DCE (diesel combustion engine)
  const calculateDCE = (load, nh3Remaining) => {
    const maxPower = 300 // kW
    const power = (load / 100) * maxPower * nh3Remaining * 0.9
    const rpm = 800 + (load / 100) * 1800
    return { power, rpm }
  }

  // NOx emission model
  const calculateNOx = (temp, nh3Conv) => {
    // Higher temp and incomplete conversion -> more NOx
    const baseLine = 20 // g/kWh baseline
    const tempFactor = (temp - 700) / 300
    const convFactor = (1 - nh3Conv)
    return baseLine * (1 + tempFactor * 0.5) * (1 + convFactor * 2)
  }

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime(t => t + 1)

      // Calculate all parameters
      const conversion = calculateCracking(crackingTemp)
      const h2Flow = motorLoad * 2 * conversion // kg/h
      const nh3Remaining = 1 - conversion

      const sofc = calculateSOFC(h2Flow, crackingTemp)
      const dce = calculateDCE(motorLoad, nh3Remaining)

      const totalPower = sofc.power + dce.power
      const fuelInput = motorLoad * 18 // kW
      const efficiency = Math.min(100, (totalPower / fuelInput) * 100)
      const nox = calculateNOx(crackingTemp, conversion)

      const newData = {
        time,
        totalPower: totalPower,
        efficiency: efficiency,
        h2Flow: h2Flow,
        nh3Conversion: conversion * 100,
        sofcVoltage: sofc.voltage,
        sofcCurrent: sofc.current / 1000, // kA
        dcePower: dce.power,
        sofcPower: sofc.power,
        noxEmission: nox
      }

      setCurrentData(newData)
      setHistory(prev => [...prev.slice(-40), newData])
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, motorLoad, crackingTemp, sofcCells, time])

  const reset = () => {
    setIsRunning(false)
    setHistory([])
    setTime(0)
    setCurrentData({
      totalPower: 0,
      efficiency: 0,
      h2Flow: 0,
      nh3Conversion: 0,
      sofcVoltage: 0,
      sofcCurrent: 0,
      dcePower: 0,
      sofcPower: 0,
      noxEmission: 0
    })
  }

  return (
    <div className="min-h-screen bg-terminal-bg pt-20 pb-12">
      {/* Header */}
      <div className="bg-terminal-darker border-b-2 border-terminal-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Zap className="text-terminal-secondary" size={40} />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-terminal-secondary neon-glow">
                  DCE-SOFC Hybrid Propulsion
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  NH₃ Cracking + Solid Oxide Fuel Cell Digital Twin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-3 border-2 border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg"
              >
                <Info size={20} />
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-3 border-2 ${
                  isRunning 
                    ? 'bg-red-500 border-red-500' 
                    : 'bg-green-500 border-green-500'
                } text-white font-bold`}
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={reset}
                className="p-3 border-2 border-terminal-secondary text-terminal-secondary hover:bg-terminal-secondary hover:text-white"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-terminal-bg border-2 border-terminal-text p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Zap size={14} />
                Total Power
              </div>
              <div className="text-2xl font-bold text-terminal-text">
                {currentData.totalPower.toFixed(1)} kW
              </div>
            </div>

            <div className="bg-terminal-bg border-2 border-terminal-secondary p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <TrendingUp size={14} />
                Efficiency
              </div>
              <div className="text-2xl font-bold text-terminal-secondary">
                {currentData.efficiency.toFixed(1)}%
              </div>
            </div>

            <div className="bg-terminal-bg border-2 border-terminal-accent p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Thermometer size={14} />
                NH₃ Conv.
              </div>
              <div className="text-2xl font-bold text-terminal-accent">
                {currentData.nh3Conversion.toFixed(1)}%
              </div>
            </div>

            <div className="bg-terminal-bg border-2 border-green-500 p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Droplet size={14} />
                CO₂
              </div>
              <div className="text-2xl font-bold text-green-500">
                0 g/kWh
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-terminal-darker border-b-2 border-terminal-border"
        >
          <div className="max-w-7xl mx-auto p-6">
            <h3 className="text-xl font-bold text-terminal-secondary mb-4 flex items-center gap-2">
              <Info size={20} />
              How This Simulation Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-bold text-terminal-accent mb-2">⚙️ System Operation</h4>
                <ol className="space-y-1 list-decimal list-inside">
                  <li><strong>NH₃ Cracking</strong> - Ammonia heated to 850°C</li>
                  <li><strong>Arrhenius Kinetics</strong> - 2NH₃ → N₂ + 3H₂</li>
                  <li><strong>SOFC</strong> - H₂ generates electricity</li>
                  <li><strong>DCE</strong> - Remaining NH₃ powers diesel</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-terminal-accent mb-2">📊 Parameters</h4>
                <ul className="space-y-1">
                  <li>▸ <strong>Motor Load</strong> - Ship power demand</li>
                  <li>▸ <strong>Cracking Temp</strong> - Affects conversion rate</li>
                  <li>▸ <strong>SOFC Cells</strong> - Number of fuel cells</li>
                  <li>▸ Higher temp = better conversion</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-terminal-accent mb-2">🌍 Why Ammonia?</h4>
                <ul className="space-y-1">
                  <li>▸ Zero carbon (no CO₂)</li>
                  <li>▸ Easy storage (vs H₂)</li>
                  <li>▸ Existing infrastructure</li>
                  <li>▸ ~70% system efficiency</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* P&ID Diagram */}
        <div className="bg-terminal-darker border-2 border-terminal-secondary p-6">
          <h3 className="text-lg font-bold text-terminal-secondary mb-4">
            📐 Process & Instrumentation Diagram
          </h3>
          <div className="bg-terminal-bg border border-terminal-border p-4 overflow-x-auto">
            <svg viewBox="0 0 900 200" className="w-full h-48">
              {/* NH3 Tank */}
              <rect x="30" y="50" width="80" height="100" fill="none" stroke="#00d9ff" strokeWidth="3"/>
              <text x="70" y="105" fill="#00d9ff" fontSize="16" textAnchor="middle" fontWeight="bold">NH₃</text>
              <text x="70" y="125" fill="#00d9ff" fontSize="12" textAnchor="middle">Tank</text>
              
              {/* Flow to Cracker */}
              <line x1="110" y1="100" x2="180" y2="100" stroke="#00d9ff" strokeWidth="3"/>
              <polygon points="180,100 170,95 170,105" fill="#00d9ff"/>
              
              {/* Cracker */}
              <circle cx="230" cy="100" r="50" fill="none" stroke="#ff6b35" strokeWidth="3"/>
              <text x="230" y="95" fill="#ff6b35" fontSize="14" textAnchor="middle" fontWeight="bold">NH₃</text>
              <text x="230" y="110" fill="#ff6b35" fontSize="14" textAnchor="middle" fontWeight="bold">CRACKER</text>
              <text x="230" y="130" fill="#ff6b35" fontSize="11" textAnchor="middle">{crackingTemp}°C</text>
              
              {/* H2 to SOFC */}
              <line x1="280" y1="70" x2="370" y2="70" stroke="#00d9ff" strokeWidth="3"/>
              <polygon points="370,70 360,65 360,75" fill="#00d9ff"/>
              <text x="325" y="60" fill="#00d9ff" fontSize="12" fontWeight="bold">H₂ ({currentData.h2Flow.toFixed(1)} kg/h)</text>
              
              {/* SOFC */}
              <rect x="370" y="40" width="100" height="80" fill="none" stroke="#00d9ff" strokeWidth="3"/>
              <text x="420" y="75" fill="#00d9ff" fontSize="14" textAnchor="middle" fontWeight="bold">SOFC</text>
              <text x="420" y="95" fill="#00d9ff" fontSize="11" textAnchor="middle">{sofcCells} cells</text>
              <text x="420" y="110" fill="#4ade80" fontSize="10" textAnchor="middle">{currentData.sofcPower.toFixed(0)} kW</text>
              
              {/* NH3 to DCE */}
              <line x1="280" y1="130" x2="370" y2="130" stroke="#ff6b35" strokeWidth="3"/>
              <polygon points="370,130 360,125 360,135" fill="#ff6b35"/>
              <text x="325" y="150" fill="#ff6b35" fontSize="12" fontWeight="bold">NH₃ ({((1 - currentData.nh3Conversion/100) * 100).toFixed(0)}%)</text>
              
              {/* DCE */}
              <rect x="370" y="110" width="100" height="60" fill="none" stroke="#ff6b35" strokeWidth="3"/>
              <text x="420" y="140" fill="#ff6b35" fontSize="14" textAnchor="middle" fontWeight="bold">DCE</text>
              <text x="420" y="155" fill="#4ade80" fontSize="10" textAnchor="middle">{currentData.dcePower.toFixed(0)} kW</text>
              
              {/* Power Combine */}
              <line x1="470" y1="80" x2="530" y2="80" stroke="#00d9ff" strokeWidth="4"/>
              <line x1="470" y1="140" x2="530" y2="140" stroke="#ff6b35" strokeWidth="4"/>
              <line x1="530" y1="80" x2="530" y2="140" stroke="#4ade80" strokeWidth="4"/>
              <line x1="530" y1="110" x2="600" y2="110" stroke="#4ade80" strokeWidth="4"/>
              <polygon points="600,110 590,105 590,115" fill="#4ade80"/>
              
              {/* Generator */}
              <circle cx="650" cy="110" r="40" fill="none" stroke="#4ade80" strokeWidth="3"/>
              <text x="650" y="110" fill="#4ade80" fontSize="18" textAnchor="middle" fontWeight="bold">⚡</text>
              <text x="650" y="130" fill="#4ade80" fontSize="11" textAnchor="middle">GENERATOR</text>
              
              {/* Output */}
              <line x1="690" y1="110" x2="750" y2="110" stroke="#4ade80" strokeWidth="4"/>
              <text x="770" y="115" fill="#4ade80" fontSize="18" fontWeight="bold">{currentData.totalPower.toFixed(1)} kW</text>
              
              {/* Emissions */}
              <line x1="420" y1="40" x2="420" y2="10" stroke="#888" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="420" y="30" fill="#888" fontSize="10" textAnchor="middle">CO₂: 0 g</text>
              <line x1="420" y1="170" x2="420" y2="190" stroke="#888" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="420" y="185" fill="#ff6b35" fontSize="10" textAnchor="middle">NOₓ: {currentData.noxEmission.toFixed(1)} g/kWh</text>
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-terminal-darker border-2 border-terminal-border p-4">
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
            <p className="text-xs text-gray-500 mt-2">Ship power demand (0-100%)</p>
          </div>

          <div className="bg-terminal-darker border-2 border-terminal-border p-4">
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
            <p className="text-xs text-gray-500 mt-2">Arrhenius reaction temperature</p>
          </div>

          <div className="bg-terminal-darker border-2 border-terminal-border p-4">
            <label className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Activity size={16} />
                SOFC Cells: {sofcCells}
              </span>
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={sofcCells}
              onChange={(e) => setSOFCCells(Number(e.target.value))}
              className="w-full"
              disabled={isRunning}
            />
            <p className="text-xs text-gray-500 mt-2">Number of fuel cells in stack</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Power Output */}
          <div className="bg-terminal-darker border-2 border-terminal-border p-4">
            <h4 className="text-sm font-bold text-terminal-text mb-3">⚡ Power Output (kW)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1d35', border: '1px solid #00d9ff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="sofcPower" stackId="1" stroke="#00d9ff" fill="#00d9ff" name="SOFC" />
                <Area type="monotone" dataKey="dcePower" stackId="1" stroke="#ff6b35" fill="#ff6b35" name="DCE" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency */}
          <div className="bg-terminal-darker border-2 border-terminal-border p-4">
            <h4 className="text-sm font-bold text-terminal-text mb-3">📊 System Efficiency (%)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis domain={[0, 100]} stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1d35', border: '1px solid #00d9ff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#00d9ff" strokeWidth={3} name="Efficiency" />
                <Line type="monotone" dataKey="nh3Conversion" stroke="#ff6b35" strokeWidth={2} name="NH₃ Conv." />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formula Reference */}
        <div className="bg-terminal-bg border-2 border-terminal-accent p-6">
          <h4 className="text-lg font-bold text-terminal-accent mb-3">📐 Thermodynamic Equations</h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm font-mono text-gray-300">
            <div>
              <p className="text-terminal-secondary font-bold mb-2">Arrhenius Equation:</p>
              <code className="bg-terminal-darker p-2 block">
                k = A × exp(-Ea / RT)<br/>
                A = 1.2×10¹⁰<br/>
                Ea = 170 kJ/mol<br/>
                R = 8.314 J/(mol·K)
              </code>
            </div>
            <div>
              <p className="text-terminal-secondary font-bold mb-2">SOFC Power:</p>
              <code className="bg-terminal-darker p-2 block">
                P = n × V × I<br/>
                n = number of cells<br/>
                V = cell voltage (~0.7V)<br/>
                I = current from H₂ flow
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
