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
        { id: Date.now(), progress: 0, speed: 0.8 + Math.random() * 0.4, path: Math.random() > 0.5 ? 'sofc' : 'dce' }
      ])
    }, 600)
    return () => clearInterval(particleInterval)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning) return
    const animInterval = setInterval(() => {
      setFlowParticles(prev => prev.map(p => ({
        ...p,
        progress: p.progress + p.speed
      })))
    }, 40)
    return () => clearInterval(animInterval)
  }, [isRunning])

  const reset = () => {
    setIsRunning(false)
    setHistory([])
    setTime(0)
    setFlowParticles([])
    setCurrentData({
      totalPower: 0,
      efficiency: 0,
      h2Flow: 0,
      nh3Conversion: 0,
      sofcVoltage: 0,
      dcePower: 0,
      sofcPower: 0,
      noxEmission: 0
    })
  }

  return (
    <div className="min-h-screen bg-terminal-bg pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-terminal-secondary neon-glow mb-2">
              DCE-SOFC Hybrid Marine Propulsion
            </h1>
            <p className="text-gray-400">Ammonia-Fueled Zero-Carbon Power System</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowHelp(!showHelp)} className="p-3 border-2 border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg">
              <Info size={20} />
            </button>
            <button onClick={() => setIsRunning(!isRunning)} className={`px-6 py-3 border-2 ${isRunning ? 'bg-red-500 border-red-500' : 'bg-green-500 border-green-500'} text-white font-bold flex items-center gap-2`}>
              {isRunning ? <><Pause size={20} />STOP</> : <><Play size={20} />START</>}
            </button>
            <button onClick={reset} className="p-3 border-2 border-terminal-accent text-terminal-accent hover:bg-terminal-accent hover:text-white">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <motion.div whileHover={{ scale: 1.02, y: -2 }} className="bg-gradient-to-br from-blue-500/20 to-transparent border-2 border-terminal-text p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10"><Zap size={80} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><Zap size={14} />Total Power</div>
              <div className="text-3xl font-bold text-terminal-text">{currentData.totalPower.toFixed(1)}</div>
              <div className="text-xs text-gray-500">kW</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} className="bg-gradient-to-br from-purple-500/20 to-transparent border-2 border-terminal-secondary p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10"><TrendingUp size={80} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><TrendingUp size={14} />Efficiency</div>
              <div className="text-3xl font-bold text-terminal-secondary">{currentData.efficiency.toFixed(1)}</div>
              <div className="text-xs text-gray-500">%</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} className="bg-gradient-to-br from-orange-500/20 to-transparent border-2 border-terminal-accent p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10"><Thermometer size={80} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><Thermometer size={14} />NH₃ Conv.</div>
              <div className="text-3xl font-bold text-terminal-accent">{currentData.nh3Conversion.toFixed(1)}</div>
              <div className="text-xs text-gray-500">%</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} className="bg-gradient-to-br from-green-500/20 to-transparent border-2 border-green-500 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10"><Droplet size={80} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><Droplet size={14} />CO₂</div>
              <div className="text-3xl font-bold text-green-500">0</div>
              <div className="text-xs text-gray-500">g/kWh</div>
            </div>
          </motion.div>
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
        {/* FULLY ANIMATED P&ID DIAGRAM */}
        <div className="bg-terminal-darker border-4 border-terminal-secondary p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-terminal-secondary mb-4 flex items-center gap-2">
            <Activity size={24} />
            Live Animated Process Diagram
          </h3>
          
          <div className="relative bg-gradient-to-br from-terminal-bg via-black to-terminal-bg border-2 border-terminal-border p-8 min-h-[500px] overflow-hidden">
            {/* Animated Background Grid */}
            <motion.div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(#00d9ff 1px, transparent 1px), linear-gradient(90deg, #00d9ff 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
              animate={{ backgroundPosition: isRunning ? ['0px 0px', '40px 40px'] : '0px 0px' }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />

            {/* Animated Flow Particles WITH GLOW TRAILS */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 25 }}>
              {flowParticles.map((p) => {
                const progress = p.progress / 100
                let cx, cy
                
                if (progress < 0.15) {
                  cx = 130 + (progress / 0.15) * 130
                  cy = 250
                } else if (progress < 0.3) {
                  const local = (progress - 0.15) / 0.15
                  cx = 260 + local * 120
                  cy = p.path === 'sofc' ? 250 - local * 110 : 250 + local * 120
                } else if (progress < 0.55) {
                  const local = (progress - 0.3) / 0.25
                  cx = 380 + local * 100
                  cy = p.path === 'sofc' ? 140 : 370
                } else if (progress < 0.75) {
                  const local = (progress - 0.55) / 0.2
                  cx = 480 + local * 160
                  cy = p.path === 'sofc' ? 140 + local * 110 : 370 - local * 120
                } else {
                  const local = (progress - 0.75) / 0.25
                  cx = 640 + local * 120
                  cy = 250
                }
                
                return (
                  <g key={p.id}>
                    <motion.circle r="15" cx={cx} cy={cy} fill={p.path === 'sofc' ? '#00d9ff' : '#ff6b35'} opacity="0.05" style={{ filter: 'blur(8px)' }} />
                    <motion.circle r="10" cx={cx} cy={cy} fill={p.path === 'sofc' ? '#00d9ff' : '#ff6b35'} opacity="0.15" style={{ filter: 'blur(4px)' }} />
                    <motion.circle r="6" cx={cx} cy={cy} fill={p.path === 'sofc' ? '#00d9ff' : '#ff6b35'} opacity="0.8" style={{ filter: `drop-shadow(0 0 12px ${p.path === 'sofc' ? '#00d9ff' : '#ff6b35'})` }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
                  </g>
                )
              })}
            </svg>

            {/* Main P&ID SVG */}
            <svg viewBox="0 0 900 500" className="w-full h-full relative" style={{ zIndex: 15 }}>
              <defs>
                <filter id="glowStrong"><feGaussianBlur stdDeviation="6"/><feComponentTransfer><feFuncA type="discrete" tableValues="1 1"/></feComponentTransfer></filter>
                <filter id="glowMedium"><feGaussianBlur stdDeviation="3"/></filter>
                <linearGradient id="nh3Grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#00d9ff" stopOpacity="0.3"/><stop offset="100%" stopColor="#00d9ff" stopOpacity="0.7"/></linearGradient>
                <radialGradient id="crackerGrad"><stop offset="0%" stopColor="#ff3300"/><stop offset="100%" stopColor="#ff6b35" stopOpacity="0.6"/></radialGradient>
                <radialGradient id="sofcGrad"><stop offset="0%" stopColor="#00d9ff" stopOpacity="0.6"/><stop offset="100%" stopColor="#00d9ff" stopOpacity="0"/></radialGradient>
              </defs>

              {/* NH3 TANK - BREATHING ANIMATION */}
              <motion.g animate={{ opacity: isRunning ? [0.9, 1, 0.9] : 1, scale: isRunning ? [1, 1.02, 1] : 1 }} transition={{ duration: 2.5, repeat: Infinity }} style={{ transformOrigin: '100px 250px' }}>
                <motion.rect x="30" y="180" width="140" height="140" rx="12" fill="url(#nh3Grad)" stroke="#00d9ff" strokeWidth="5" filter="url(#glowMedium)" animate={{ strokeWidth: isRunning ? [5, 7, 5] : 5 }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.rect x="45" y="200" width="110" height="100" fill="#00d9ff" opacity="0.25" animate={{ height: isRunning ? [100, 75, 100] : 100, y: isRunning ? [200, 225, 200] : 200 }} transition={{ duration: 4, repeat: Infinity }} />
                <text x="100" y="245" fill="#00d9ff" fontSize="32" textAnchor="middle" fontWeight="bold" filter="url(#glowMedium)">NH₃</text>
                <text x="100" y="275" fill="#00d9ff" fontSize="18" textAnchor="middle">TANK</text>
              </motion.g>

              {/* ANIMATED FLOW LINE NH3 → CRACKER */}
              <motion.line x1="170" y1="250" x2="240" y2="250" stroke="#00d9ff" strokeWidth="10" strokeDasharray="15 8" filter="url(#glowMedium)" animate={{ strokeDashoffset: isRunning ? [0, -23] : 0, strokeWidth: isRunning ? [10, 13, 10] : 10 }} transition={{ strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: 'linear' }, strokeWidth: { duration: 1.5, repeat: Infinity } }} />
              <polygon points="245,250 230,243 230,257" fill="#00d9ff" filter="url(#glowMedium)"/>

              {/* CRACKER - INTENSE PULSING ANIMATION */}
              <motion.g animate={{ filter: isRunning ? ['url(#glowMedium)', 'url(#glowStrong)', 'url(#glowMedium)'] : 'url(#glowMedium)', scale: isRunning ? [1, 1.06, 1] : 1 }} transition={{ duration: 1.3, repeat: Infinity }} style={{ transformOrigin: '310px 250px' }}>
                <motion.circle cx="310" cy="250" r="85" fill="url(#crackerGrad)" stroke="#ff6b35" strokeWidth="6" animate={{ strokeWidth: isRunning ? [6, 10, 6] : 6 }} transition={{ duration: 1.3, repeat: Infinity }} />
                <motion.circle cx="310" cy="250" r="70" fill="none" stroke="#ff0000" strokeWidth="4" opacity="0.4" animate={{ r: isRunning ? [70, 78, 70] : 70, opacity: isRunning ? [0.4, 0.8, 0.4] : 0.4 }} transition={{ duration: 0.9, repeat: Infinity }} />
                <text x="310" y="235" fill="white" fontSize="24" textAnchor="middle" fontWeight="bold">CRACKER</text>
                <text x="310" y="270" fill="white" fontSize="28" textAnchor="middle" fontWeight="bold">{crackingTemp}°C</text>
                <motion.g animate={{ y: isRunning ? [0, -8, 0] : 0, opacity: isRunning ? [0.7, 1, 0.7] : 0.4 }} transition={{ duration: 0.25, repeat: Infinity }}>
                  <path d="M280,190 L290,170 L300,190 L310,170 L320,190 L330,170 L340,190" fill="none" stroke="#ffff00" strokeWidth="4" filter="url(#glowMedium)"/>
                </motion.g>
              </motion.g>

              {/* H2 TO SOFC - ANIMATED */}
              <motion.line x1="395" y1="195" x2="475" y2="140" stroke="#00d9ff" strokeWidth="10" strokeDasharray="12 6" filter="url(#glowMedium)" animate={{ strokeDashoffset: isRunning ? [0, -18] : 0, strokeWidth: isRunning ? [10, 13, 10] : 10 }} transition={{ strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' }, strokeWidth: { duration: 1.2, repeat: Infinity } }} />
              <polygon points="480,138 467,133 472,146" fill="#00d9ff" filter="url(#glowMedium)"/>
              <motion.text x="435" y="162" fill="#00d9ff" fontSize="15" textAnchor="middle" fontWeight="bold" animate={{ opacity: isRunning ? [0.7, 1, 0.7] : 0.8 }} transition={{ duration: 1.5, repeat: Infinity }}>H₂ {currentData.h2Flow.toFixed(1)} kg/h</motion.text>

              {/* SOFC STACK - LAYERED PULSE ANIMATION */}
              <motion.g animate={{ opacity: isRunning ? [0.85, 1, 0.85] : 1, scale: isRunning ? [1, 1.03, 1] : 1 }} transition={{ duration: 2.2, repeat: Infinity }} style={{ transformOrigin: '560px 160px' }}>
                <rect x="480" y="80" width="160" height="140" rx="10" fill="none" stroke="#00d9ff" strokeWidth="7" filter="url(#glowMedium)"/>
                {[...Array(12)].map((_, i) => (
                  <motion.rect key={i} x="490" y={90 + i * 11} width="140" height="9" fill="#00d9ff" initial={{ opacity: 0.15 + i * 0.05 }} animate={{ opacity: isRunning ? [0.15 + i * 0.05, 0.4 + i * 0.05, 0.15 + i * 0.05] : 0.15 + i * 0.05 }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.08 }} />
                ))}
                <text x="560" y="145" fill="#00d9ff" fontSize="26" textAnchor="middle" fontWeight="bold">SOFC</text>
                <text x="560" y="175" fill="#00d9ff" fontSize="16" textAnchor="middle">{sofcCells} Cells</text>
                <motion.text x="560" y="205" fill="#4ade80" fontSize="22" textAnchor="middle" fontWeight="bold" animate={{ scale: isRunning ? [1, 1.15, 1] : 1 }} transition={{ duration: 1.2, repeat: Infinity }} filter="url(#glowMedium)">{currentData.sofcPower.toFixed(0)} kW</motion.text>
                <motion.circle cx="560" cy="160" r="75" fill="url(#sofcGrad)" pointerEvents="none" animate={{ opacity: isRunning ? [0.3, 0.6, 0.3] : 0.2 }} transition={{ duration: 2, repeat: Infinity }} />
              </motion.g>

              {/* NH3 TO DCE - ANIMATED */}
              <motion.line x1="395" y1="305" x2="475" y2="370" stroke="#ff6b35" strokeWidth="10" strokeDasharray="12 6" filter="url(#glowMedium)" animate={{ strokeDashoffset: isRunning ? [0, -18] : 0, strokeWidth: isRunning ? [10, 13, 10] : 10 }} transition={{ strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' }, strokeWidth: { duration: 1.2, repeat: Infinity } }} />
              <polygon points="480,372 467,367 472,380" fill="#ff6b35" filter="url(#glowMedium)"/>
              <motion.text x="435" y="330" fill="#ff6b35" fontSize="14" textAnchor="middle" fontWeight="bold" animate={{ opacity: isRunning ? [0.7, 1, 0.7] : 0.8 }} transition={{ duration: 1.5, repeat: Infinity }}>NH₃ {(100 - currentData.nh3Conversion).toFixed(0)}%</motion.text>

              {/* DCE ENGINE - VIBRATING ANIMATION */}
              <motion.g animate={{ x: isRunning ? [0, 3, -3, 0] : 0, y: isRunning ? [0, -2, 2, 0] : 0 }} transition={{ duration: 0.12, repeat: Infinity }}>
                <rect x="480" y="300" width="160" height="130" rx="10" fill="none" stroke="#ff6b35" strokeWidth="7" filter="url(#glowMedium)"/>
                <motion.circle cx="530" cy="355" r="32" fill="#ff6b35" opacity="0.25" stroke="#ff6b35" strokeWidth="4" animate={{ r: isRunning ? [32, 38, 32] : 32, opacity: isRunning ? [0.25, 0.5, 0.25] : 0.25 }} transition={{ duration: 0.25, repeat: Infinity }} />
                <motion.circle cx="590" cy="355" r="32" fill="#ff6b35" opacity="0.25" stroke="#ff6b35" strokeWidth="4" animate={{ r: isRunning ? [38, 32, 38] : 32, opacity: isRunning ? [0.5, 0.25, 0.5] : 0.25 }} transition={{ duration: 0.25, repeat: Infinity, delay: 0.125 }} />
                <text x="560" y="345" fill="#ff6b35" fontSize="28" textAnchor="middle" fontWeight="bold">DCE</text>
                <text x="560" y="375" fill="#ff6b35" fontSize="17" textAnchor="middle">DIESEL</text>
                <motion.text x="560" y="410" fill="#ff0000" fontSize="22" textAnchor="middle" fontWeight="bold" animate={{ scale: isRunning ? [1, 1.15, 1] : 1 }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} filter="url(#glowMedium)">{currentData.dcePower.toFixed(0)} kW</motion.text>
              </motion.g>

              {/* POWER MERGE - PULSING LINES */}
              <motion.line x1="640" y1="160" x2="700" y2="220" stroke="#00d9ff" strokeWidth="12" filter="url(#glowMedium)" animate={{ strokeWidth: isRunning ? [12, 16, 12] : 12 }} transition={{ duration: 1.3, repeat: Infinity }} />
              <motion.line x1="640" y1="365" x2="700" y2="280" stroke="#ff6b35" strokeWidth="12" filter="url(#glowMedium)" animate={{ strokeWidth: isRunning ? [12, 16, 12] : 12 }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.5 }} />
              <motion.line x1="700" y1="250" x2="770" y2="250" stroke="#4ade80" strokeWidth="14" filter="url(#glowStrong)" animate={{ strokeWidth: isRunning ? [14, 19, 14] : 14 }} transition={{ duration: 1.1, repeat: Infinity }} />

              {/* GENERATOR - FULL ROTATION */}
              <motion.g animate={{ rotate: isRunning ? 360 : 0 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '745px 250px' }}>
                <circle cx="745" cy="250" r="65" fill="none" stroke="#4ade80" strokeWidth="10" filter="url(#glowStrong)"/>
                <circle cx="745" cy="250" r="50" fill="rgba(74, 222, 128, 0.15)"/>
                <path d="M745,200 L770,250 L745,300 L720,250 Z" fill="#4ade80" filter="url(#glowMedium)"/>
              </motion.g>

              {/* TOTAL POWER - MEGA PULSE */}
              <motion.text x="745" y="360" fill="#4ade80" fontSize="38" textAnchor="middle" fontWeight="bold" animate={{ scale: isRunning ? [1, 1.2, 1] : 1 }} transition={{ duration: 1.6, repeat: Infinity }} filter="url(#glowStrong)">{currentData.totalPower.toFixed(1)} kW</motion.text>
              <text x="745" y="390" fill="#4ade80" fontSize="18" textAnchor="middle">TOTAL OUTPUT</text>

              {/* EFFICIENCY BADGE - PULSE */}
              <motion.g animate={{ scale: isRunning ? [1, 1.08, 1] : 1 }} transition={{ duration: 2.3, repeat: Infinity }} style={{ transformOrigin: '835px 240px' }}>
                <rect x="790" y="200" width="90" height="80" rx="12" fill="rgba(183, 148, 246, 0.2)" stroke="#b794f6" strokeWidth="4" filter="url(#glowMedium)"/>
                <text x="835" y="230" fill="#b794f6" fontSize="15" textAnchor="middle" fontWeight="bold">EFFICIENCY</text>
                <motion.text x="835" y="265" fill="#b794f6" fontSize="30" textAnchor="middle" fontWeight="bold" animate={{ scale: isRunning ? [1, 1.12, 1] : 1 }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }}>{currentData.efficiency.toFixed(1)}%</motion.text>
              </motion.g>
            </svg>
          </div>
        </div>

        {/* CONTROLS */}
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

        {/* CHARTS */}
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

        {/* EQUATIONS */}
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
