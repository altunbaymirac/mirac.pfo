import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { Zap, Gauge, Thermometer, Droplet, Play, Pause, RotateCcw, Info, TrendingUp, Activity, Flame, Wind } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DCESOFCDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [showHelp, setShowHelp] = useState(true)
  const [motorLoad, setMotorLoad] = useState(50)
  const [crackingTemp, setCrackingTemp] = useState(850)
  const [sofcCells, setSOFCCells] = useState(500)
  const [flowParticles, setFlowParticles] = useState([])
  
  const [currentData, setCurrentData] = useState({
    totalPower: 0,
    efficiency: 0,
    h2Flow: 0,
    nh3Conversion: 0,
    sofcVoltage: 0,
    dcePower: 0,
    sofcPower: 0,
    noxEmission: 0
  })
  
  const [history, setHistory] = useState([])
  const [time, setTime] = useState(0)

  const calculateCracking = (temp) => {
    const R = 8.314
    const Ea = 170000
    const A = 1.2e10
    const T = temp + 273.15
    const k = A * Math.exp(-Ea / (R * T))
    return Math.min(1, Math.max(0, 1 - Math.exp(-k * 0.5)))
  }

  const calculateSOFC = (h2Flow, temp) => {
    const E0 = 1.23
    const voltage = E0 - 0.0002 * (temp + 273.15 - 1073)
    const current = (h2Flow * 2 * 96485) / 3600
    const power = (sofcCells * voltage * current) / 1000
    return { power, voltage }
  }

  const calculateDCE = (load, nh3Remaining) => {
    return { power: (load / 100) * 300 * nh3Remaining * 0.9 }
  }

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTime(t => t + 1)
      const conversion = calculateCracking(crackingTemp)
      const h2Flow = motorLoad * 2 * conversion
      const sofc = calculateSOFC(h2Flow, crackingTemp)
      const dce = calculateDCE(motorLoad, 1 - conversion)
      const totalPower = sofc.power + dce.power
      const efficiency = Math.min(100, (totalPower / (motorLoad * 18)) * 100)

      const newData = {
        time,
        totalPower,
        efficiency,
        h2Flow,
        nh3Conversion: conversion * 100,
        sofcVoltage: sofc.voltage,
        dcePower: dce.power,
        sofcPower: sofc.power,
        noxEmission: 20 * (1 + ((crackingTemp - 700) / 300) * 0.5)
      }
      setCurrentData(newData)
      setHistory(prev => [...prev.slice(-40), newData])
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, motorLoad, crackingTemp, sofcCells, time])

  useEffect(() => {
    if (!isRunning) return
    const particleInterval = setInterval(() => {
      setFlowParticles(prev => [
        ...prev.filter(p => p.progress < 100),
        { id: Date.now(), progress: 0, speed: 1 + Math.random() }
      ])
    }, 800)
    return () => clearInterval(particleInterval)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning) return
    const animInterval = setInterval(() => {
      setFlowParticles(prev => prev.map(p => ({
        ...p,
        progress: p.progress + p.speed
      })))
    }, 50)
    return () => clearInterval(animInterval)
  }, [isRunning])

  const reset = () => {
    setIsRunning(false)
    setHistory([])
    setTime(0)
    setFlowParticles([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-terminal-bg via-terminal-darker to-terminal-bg pt-20 pb-12">
      <div className="bg-terminal-darker/90 backdrop-blur-sm border-b-2 border-terminal-secondary p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div animate={{ rotate: isRunning ? 360 : 0 }} transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }}>
                <Zap className="text-terminal-secondary" size={40} />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-terminal-secondary neon-glow">DCE-SOFC Hybrid Propulsion</h1>
                <p className="text-gray-400 text-sm flex items-center gap-2"><Flame size={16} />NH₃ Cracking + SOFC Digital Twin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowHelp(!showHelp)} className="p-3 border-2 border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg"><Info size={20} /></button>
              <button onClick={() => setIsRunning(!isRunning)} className={`p-3 border-2 ${isRunning ? 'bg-red-500 border-red-500' : 'bg-green-500 border-green-500'} text-white font-bold shadow-lg`}>
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={reset} className="p-3 border-2 border-terminal-secondary text-terminal-secondary hover:bg-terminal-secondary hover:text-white"><RotateCcw size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: 'Total Power', value: currentData.totalPower.toFixed(1), unit: 'kW', color: 'terminal-text' },
              { icon: TrendingUp, label: 'Efficiency', value: currentData.efficiency.toFixed(1), unit: '%', color: 'terminal-secondary' },
              { icon: Thermometer, label: 'NH₃ Conv.', value: currentData.nh3Conversion.toFixed(1), unit: '%', color: 'terminal-accent' },
              { icon: Droplet, label: 'CO₂', value: '0', unit: 'g/kWh', color: 'green-500' }
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02, y: -2 }} className={`bg-gradient-to-br from-${stat.color}/20 to-transparent border-2 border-${stat.color} p-4 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 opacity-10"><stat.icon size={80} /></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><stat.icon size={14} />{stat.label}</div>
                  <div className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.unit}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-terminal-darker/90 border-b-2 border-terminal-border">
            <div className="max-w-7xl mx-auto p-6">
              <h3 className="text-xl font-bold text-terminal-secondary mb-4 flex items-center gap-2"><Info size={20} />How This Works</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
                <div className="bg-terminal-bg/50 p-4 border border-terminal-accent/30">
                  <h4 className="font-bold text-terminal-accent mb-2"><Flame size={16} className="inline mr-2" />Process Steps</h4>
                  <ol className="space-y-1 list-decimal list-inside text-xs">
                    <li>NH₃ heated to {crackingTemp}°C</li>
                    <li>Arrhenius: 2NH₃ → N₂ + 3H₂</li>
                    <li>H₂ powers SOFC ({sofcCells} cells)</li>
                    <li>Remaining NH₃ to DCE backup</li>
                    <li>Combined output: {currentData.totalPower.toFixed(0)} kW</li>
                  </ol>
                </div>
                <div className="bg-terminal-bg/50 p-4 border border-terminal-secondary/30">
                  <h4 className="font-bold text-terminal-secondary mb-2"><Gauge size={16} className="inline mr-2" />Controls</h4>
                  <ul className="space-y-1 text-xs">
                    <li>▸ Motor Load: Ship power demand</li>
                    <li>▸ Cracking Temp: Conversion rate</li>
                    <li>▸ SOFC Cells: Stack size</li>
                    <li>▸ Higher temp = Better efficiency</li>
                  </ul>
                </div>
                <div className="bg-terminal-bg/50 p-4 border border-green-500/30">
                  <h4 className="font-bold text-green-500 mb-2"><Droplet size={16} className="inline mr-2" />Benefits</h4>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Zero CO₂ (no carbon in NH₃)</li>
                    <li>✓ ~70% system efficiency</li>
                    <li>✓ Easy storage vs H₂</li>
                    <li>⚠ NOₓ: {currentData.noxEmission.toFixed(1)} g/kWh</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        <div className="bg-terminal-darker/90 border-2 border-terminal-secondary p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-terminal-secondary mb-4 flex items-center gap-2"><Activity size={20} />Animated Process Flow</h3>
          <div className="bg-gradient-to-br from-terminal-bg to-terminal-darker border border-terminal-border p-4 relative">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              {flowParticles.map(p => (
                <motion.circle key={p.id} r="4" fill="#00d9ff" initial={{ cx: 110, cy: 100 }} animate={{ cx: 110 + (p.progress / 100) * 640, cy: p.progress < 40 ? 100 : p.progress < 60 ? 70 : 130 }} style={{ filter: 'drop-shadow(0 0 3px #00d9ff)' }} />
              ))}
            </svg>
            <svg viewBox="0 0 900 200" className="w-full h-48">
              <motion.rect x="30" y="50" width="80" height="100" fill="none" stroke="#00d9ff" strokeWidth="3" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
              <text x="70" y="105" fill="#00d9ff" fontSize="16" textAnchor="middle" fontWeight="bold">NH₃</text>
              <line x1="110" y1="100" x2="180" y2="100" stroke="#00d9ff" strokeWidth="3"/>
              <polygon points="180,100 170,95 170,105" fill="#00d9ff"/>
              <motion.circle cx="230" cy="100" r="50" fill="none" stroke="#ff6b35" strokeWidth="3" animate={{ filter: isRunning ? ['drop-shadow(0 0 5px #ff6b35)', 'drop-shadow(0 0 20px #ff6b35)'] : 'none' }} transition={{ duration: 1, repeat: Infinity }} />
              <text x="230" y="95" fill="#ff6b35" fontSize="14" textAnchor="middle" fontWeight="bold">CRACKER</text>
              <text x="230" y="115" fill="#ff6b35" fontSize="13" textAnchor="middle" fontWeight="bold">{crackingTemp}°C</text>
              <line x1="280" y1="70" x2="370" y2="70" stroke="#00d9ff" strokeWidth="3"/>
              <text x="325" y="60" fill="#00d9ff" fontSize="11" fontWeight="bold">H₂ {currentData.h2Flow.toFixed(1)} kg/h</text>
              <motion.rect x="370" y="40" width="100" height="80" fill="none" stroke="#00d9ff" strokeWidth="3" animate={{ opacity: isRunning ? [0.8, 1] : 1 }} transition={{ duration: 1.5, repeat: Infinity }} />
              <text x="420" y="75" fill="#00d9ff" fontSize="14" textAnchor="middle" fontWeight="bold">SOFC</text>
              <text x="420" y="110" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">{currentData.sofcPower.toFixed(0)} kW</text>
              <line x1="280" y1="130" x2="370" y2="130" stroke="#ff6b35" strokeWidth="3"/>
              <motion.rect x="370" y="110" width="100" height="60" fill="none" stroke="#ff6b35" strokeWidth="3" animate={{ opacity: isRunning ? [0.7, 1] : 1 }} transition={{ duration: 1.2, repeat: Infinity }} />
              <text x="420" y="140" fill="#ff6b35" fontSize="14" textAnchor="middle" fontWeight="bold">DCE</text>
              <text x="420" y="160" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">{currentData.dcePower.toFixed(0)} kW</text>
              <line x1="470" y1="80" x2="530" y2="80" stroke="#00d9ff" strokeWidth="4"/>
              <line x1="470" y1="140" x2="530" y2="140" stroke="#ff6b35" strokeWidth="4"/>
              <line x1="530" y1="80" x2="530" y2="140" stroke="#4ade80" strokeWidth="4"/>
              <line x1="530" y1="110" x2="600" y2="110" stroke="#4ade80" strokeWidth="4"/>
              <motion.circle cx="650" cy="110" r="40" fill="none" stroke="#4ade80" strokeWidth="3" animate={{ rotate: isRunning ? 360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
              <text x="650" y="115" fill="#4ade80" fontSize="22" textAnchor="middle" fontWeight="bold">⚡</text>
              <line x1="690" y1="110" x2="750" y2="110" stroke="#4ade80" strokeWidth="4"/>
              <motion.text x="790" y="115" fill="#4ade80" fontSize="20" fontWeight="bold" animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }} transition={{ duration: 1, repeat: Infinity }}>{currentData.totalPower.toFixed(1)} kW</motion.text>
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Gauge, label: 'Motor Load', value: motorLoad, min: 0, max: 100, unit: '%', set: setMotorLoad },
            { icon: Thermometer, label: 'Cracking Temp', value: crackingTemp, min: 700, max: 1000, unit: '°C', set: setCrackingTemp },
            { icon: Activity, label: 'SOFC Cells', value: sofcCells, min: 100, max: 1000, step: 50, unit: '', set: setSOFCCells }
          ].map((ctrl, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-terminal-darker to-terminal-bg border-2 border-terminal-border p-6 shadow-lg">
              <label className="flex items-center justify-between text-sm text-gray-300 mb-3">
                <span className="flex items-center gap-2 font-bold"><ctrl.icon size={18} className="text-terminal-accent" />{ctrl.label}</span>
                <span className="text-2xl font-bold text-terminal-accent">{ctrl.value}{ctrl.unit}</span>
              </label>
              <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step || 1} value={ctrl.value} onChange={(e) => ctrl.set(Number(e.target.value))} className="w-full h-2 bg-terminal-bg rounded-lg appearance-none cursor-pointer accent-terminal-accent" disabled={isRunning} />
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-terminal-darker/90 border-2 border-terminal-border p-4 shadow-lg">
            <h4 className="text-sm font-bold text-terminal-text mb-3 flex items-center gap-2"><Zap size={16} />Power Output</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorSOFC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8}/><stop offset="95%" stopColor="#00d9ff" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorDCE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8}/><stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#0a0e27', border: '1px solid #00d9ff' }} />
                <Legend />
                <Area type="monotone" dataKey="sofcPower" stackId="1" stroke="#00d9ff" fillOpacity={1} fill="url(#colorSOFC)" name="SOFC (kW)" />
                <Area type="monotone" dataKey="dcePower" stackId="1" stroke="#ff6b35" fillOpacity={1} fill="url(#colorDCE)" name="DCE (kW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-terminal-darker/90 border-2 border-terminal-border p-4 shadow-lg">
            <h4 className="text-sm font-bold text-terminal-text mb-3 flex items-center gap-2"><TrendingUp size={16} />Efficiency</h4>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={[{ value: currentData.efficiency, fill: '#00d9ff' }]} startAngle={180} endAngle={0}>
                <RadialBar background dataKey="value" cornerRadius={10} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-terminal-secondary">{currentData.efficiency.toFixed(1)}%</text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-terminal-bg to-terminal-darker border-2 border-terminal-accent p-6 shadow-lg">
          <h4 className="text-lg font-bold text-terminal-accent mb-4 flex items-center gap-2"><Wind size={20} />Thermodynamic Equations</h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm font-mono text-gray-300">
            <div className="bg-terminal-darker/50 p-4 border border-terminal-secondary/30">
              <p className="text-terminal-secondary font-bold mb-2">Arrhenius:</p>
              <code className="bg-terminal-bg/50 p-3 block rounded text-xs">k = A × exp(-Ea / RT)<br/>A = 1.2×10¹⁰, Ea = 170 kJ/mol<br/>T = {crackingTemp + 273} K</code>
            </div>
            <div className="bg-terminal-darker/50 p-4 border border-terminal-accent/30">
              <p className="text-terminal-accent font-bold mb-2">SOFC Power:</p>
              <code className="bg-terminal-bg/50 p-3 block rounded text-xs">P = n × V × I / 1000<br/>n = {sofcCells} cells<br/>P = {currentData.sofcPower.toFixed(1)} kW</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
