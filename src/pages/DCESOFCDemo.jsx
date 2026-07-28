import { useState, useEffect } from 'react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLanguage } from '../contexts/LanguageContext'

const CATALYSTS = {
  Ru: { Ea: 80000, A: 1.2e12, label: 'Eₐ = 80 kJ/mol' },
  Ni: { Ea: 140000, A: 1.2e11, label: 'Eₐ = 140 kJ/mol' }
}

// Terminal color palette (matches dce-simulation.html)
const C = {
  green: '#d1ff00',
  cyan: '#00d4ff',
  orange: '#ff9f1c',
  heatOrange: '#ff6600',
  productGreen: '#00ff88',
  nh3Blue: '#00aaff',
  electricYellow: '#ffee00',
  dangerRed: '#ff3366',
  panelBg: '#0a0a00',
  borderDim: '#333300',
  textDim: '#666600',
  black: '#050505',
}

const S = {
  panel: { border: `1px solid ${C.borderDim}`, background: C.panelBg, padding: '15px' },
  panelTitle: { color: C.orange, fontSize: '11px', margin: '0 0 15px 0', paddingBottom: '8px', borderBottom: `1px solid ${C.borderDim}`, letterSpacing: '0.1em', fontFamily: 'inherit' },
  formulaBox: { border: `1px solid ${C.borderDim}`, padding: '10px', marginBottom: '10px', background: 'rgba(0,0,0,0.3)' },
  formulaTitle: { fontSize: '9px', color: C.textDim, display: 'block', marginBottom: '8px' },
}


const LABELS = {
  tr: {
    electric: 'ELEKTRİK', heat: 'ISI',
    stop: '[■ SİSTEMİ DURDUR]', start: '[▶ SİSTEMİ BAŞLAT]',
    controlPanel: 'KONTROL PANELİ',
    motorLoad: 'MOTOR YÜKÜ', residence: 'REZİDANS SÜRESİ (τ)', tempTarget: 'SICAKLIK HEDEFİ',
    sofcCell: 'SOFC YAKIT PİLİ', whr: 'ATIK ISI GERİ KAZANIMI',
    catalystType: 'KATALİZÖR TİPİ',
    systemInfo: '// SİSTEM BİLGİSİ', molarExpansion: 'MOLAR GENİŞLEME: 2x', combustion: 'YANMA: YOK',
    pid: 'P&ID AKIŞ DİYAGRAMI', thermoData: 'TERMODİNAMİK VERİLER',
    arrhenius: '// ARRHENİUS KİNETİĞİ', dceReaction: '// DCE REAKSİYONU', conversionRate: '// DÖNÜŞÜM ORANI',
    reactorTemp: 'REAKTÖR SICAKLIK', pressure: 'BASINÇ', conversion: 'DÖNÜŞÜM',
    motorPower: 'MOTOR GÜCÜ', sofcElectric: 'SOFC ELEKTRİK', wtwEff: 'WtW VERİM',
    liveStream: '// CANLI VERİ AKIŞI', temperature: '■ SICAKLIK', conversionLegend: '■ DÖNÜŞÜM',
    igfCode: L.igfCode,
    powerHistory: 'GÜÇ ÇIKIŞ GEÇMİŞİ',
    footerDept: '[AGÜ MAKİNE MÜHENDİSLİĞİ]',
    footerSystem: '[DCE-SOFC HİBRİT TAHRİK SİSTEMİ]',
    footerTwin: '[DİJİTAL İKİZ v2.0]'
  },
  en: {
    electric: 'ELECTRIC', heat: 'HEAT',
    stop: '[■ STOP SYSTEM]', start: '[▶ START SYSTEM]',
    controlPanel: 'CONTROL PANEL',
    motorLoad: 'ENGINE LOAD', residence: 'RESIDENCE TIME (τ)', tempTarget: 'TEMPERATURE TARGET',
    sofcCell: 'SOFC FUEL CELL', whr: 'WASTE HEAT RECOVERY',
    catalystType: 'CATALYST TYPE',
    systemInfo: '// SYSTEM INFO', molarExpansion: 'MOLAR EXPANSION: 2x', combustion: 'COMBUSTION: NONE',
    pid: 'P&ID FLOW DIAGRAM', thermoData: 'THERMODYNAMIC DATA',
    arrhenius: '// ARRHENIUS KINETICS', dceReaction: '// DCE REACTION', conversionRate: '// CONVERSION RATE',
    reactorTemp: 'REACTOR TEMP', pressure: 'PRESSURE', conversion: 'CONVERSION',
    motorPower: 'ENGINE POWER', sofcElectric: 'SOFC ELECTRIC', wtwEff: 'WtW EFFICIENCY',
    liveStream: '// LIVE DATA STREAM', temperature: '■ TEMPERATURE', conversionLegend: '■ CONVERSION',
    igfCode: 'IGF CODE CERTIFICATION',
    powerHistory: 'POWER OUTPUT HISTORY',
    footerDept: '[AGÜ MECHANICAL ENGINEERING]',
    footerSystem: '[DCE-SOFC HYBRID PROPULSION SYSTEM]',
    footerTwin: '[DIGITAL TWIN v2.0]'
  }
}

function ControlSlider({ label, value, min, max, unit, ticks, onChange, disabled }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', fontSize: '9px', color: C.textDim, marginBottom: '6px', letterSpacing: '0.15em' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))} disabled={disabled}
          style={{ flex: 1, height: '8px', background: C.borderDim, cursor: disabled ? 'not-allowed' : 'pointer', accentColor: C.green, outline: 'none' }} />
        <span style={{ fontSize: '12px', color: C.cyan, minWidth: '50px', textAlign: 'right', fontWeight: 'bold' }}>{unit}</span>
      </div>
      {ticks && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: C.borderDim, marginTop: '3px', padding: '0 2px' }}>
          {ticks.map(t => <span key={t}>{t}</span>)}
        </div>
      )}
    </div>
  )
}

function ToggleSwitch({ label, active, onToggle }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '8px', border: `1px solid ${C.borderDim}`, background: 'rgba(0,0,0,0.3)' }}>
      <label style={{ fontSize: '9px', color: C.textDim, letterSpacing: '0.1em' }}>{label}</label>
      <button onClick={onToggle} style={{
        width: '60px', height: '28px', cursor: 'pointer', position: 'relative', border: 'none',
        background: active ? `rgba(209,255,0,0.2)` : C.borderDim,
        outline: `1px solid ${active ? C.green : '#444400'}`,
        transition: 'all 0.3s', fontFamily: 'inherit'
      }}>
        <span style={{ position: 'absolute', fontSize: '8px', color: active ? C.green : C.textDim, top: '50%', transform: 'translateY(-50%)', ...(active ? { right: '24px' } : { left: '6px' }) }}>
          {active ? 'ON' : 'OFF'}
        </span>
        <span style={{
          position: 'absolute', width: '20px', height: '20px', top: '3px',
          left: active ? '35px' : '3px',
          background: active ? C.green : '#444422',
          boxShadow: active ? `0 0 10px ${C.green}` : 'none',
          transition: 'all 0.3s'
        }} />
      </button>
    </div>
  )
}

function DataCell({ label, value, unit, barColor, barPct }) {
  return (
    <div style={{ border: `1px solid ${C.borderDim}`, padding: '8px', background: 'rgba(0,0,0,0.3)' }}>
      <span style={{ fontSize: '8px', color: C.textDim, display: 'block', marginBottom: '3px', letterSpacing: '0.1em' }}>{label}</span>
      <div>
        <span style={{ fontSize: '18px', color: C.green, fontWeight: 'bold' }}>{value}</span>
        <span style={{ fontSize: '10px', color: C.textDim, marginLeft: '3px' }}>{unit}</span>
      </div>
      <div style={{ height: '3px', background: C.borderDim, marginTop: '5px' }}>
        <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, barPct))}%`, background: barColor, transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

function PIDDiagram({ running, sofcOn, whrOn, data, L }) {
  const mono = "'Courier New', monospace"
  const lv = (v, max) => Math.min(100, Math.max(0, (v / max) * 100))

  return (
    <svg viewBox="0 0 600 400" style={{ width: '100%', height: '380px' }}>
      <style>{`
        @keyframes flowPid { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -25; } }
        @keyframes motorSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .flow-anim { animation: flowPid 1s linear infinite; }
        .motor-spin { animation: motorSpin 0.5s linear infinite; transform-origin: 420px 230px; }
      `}</style>

      <defs>
        <pattern id="pidGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a1a00" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#pidGrid)"/>

      {/* PIPES */}
      <path d="M 80 200 L 200 200" fill="none" stroke={C.borderDim} strokeWidth="8" strokeLinecap="square"/>
      <path d="M 300 100 L 300 140 L 260 140 L 260 170" fill="none" stroke={C.borderDim} strokeWidth="8" strokeLinecap="square"/>
      <path d="M 300 280 L 300 320 L 420 320 L 420 280" fill="none" stroke={C.borderDim} strokeWidth="8" strokeLinecap="square"/>
      <path d="M 465 230 L 550 230" fill="none" stroke={C.borderDim} strokeWidth="8" strokeLinecap="square"/>
      <path d="M 350 70 L 450 70 L 450 130" fill="none" stroke={C.borderDim} strokeWidth="8" strokeLinecap="square"/>

      {/* ANIMATED FLOW LINES */}
      {running && <>
        <path d="M 80 200 L 200 200" fill="none" stroke={C.nh3Blue} strokeWidth="4" strokeLinecap="square"
          strokeDasharray="10 15" className="flow-anim"/>
        {whrOn && <path d="M 300 100 L 300 140 L 260 140 L 260 170" fill="none" stroke={C.heatOrange} strokeWidth="4"
          strokeLinecap="square" strokeDasharray="10 15" className="flow-anim"/>}
        <path d="M 300 280 L 300 320 L 420 320 L 420 280" fill="none" stroke={C.productGreen} strokeWidth="4"
          strokeLinecap="square" strokeDasharray="10 15" className="flow-anim"/>
        <path d="M 465 230 L 550 230" fill="none" stroke={C.green} strokeWidth="4"
          strokeLinecap="square" strokeDasharray="10 15" className="flow-anim"/>
        {sofcOn && <path d="M 350 70 L 450 70 L 450 130" fill="none" stroke={C.electricYellow} strokeWidth="4"
          strokeLinecap="square" strokeDasharray="10 15" className="flow-anim"/>}
      </>}

      {/* NH3 TANK TK-101 */}
      <rect x="30" y="160" width="50" height="80" fill={C.panelBg} stroke={C.borderDim}/>
      <rect x="33" y={160 + 80 * (1 - data.tankLevel / 100)} width="44" height={80 * data.tankLevel / 100}
        fill={C.nh3Blue} opacity="0.6" style={{ transition: 'all 0.5s' }}/>
      <ellipse cx="55" cy="160" rx="25" ry="8" fill="#111100" stroke={C.borderDim}/>
      <ellipse cx="55" cy="240" rx="25" ry="8" fill="#111100" stroke={C.borderDim}/>
      <text x="55" y="255" fontFamily={mono} fontSize="9" fill={C.textDim} textAnchor="middle">TK-101</text>
      <text x="55" y="198" fontFamily={mono} fontSize="12" fill={C.green} textAnchor="middle" fontWeight="bold">
        {data.tankLevel.toFixed(0)}%
      </text>

      {/* SOFC STACK SOFC-101 */}
      <rect x="250" y="30" width="100" height="70" fill={C.panelBg} stroke={C.borderDim}/>
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x="258" y={40 + i * 12} width="84" height="9"
          fill={running && sofcOn ? `rgba(0,212,255,${0.2 + i * 0.12})` : '#1a1a00'}
          style={{ transition: 'fill 0.5s' }}/>
      ))}
      <text x="300" y="20" fontFamily={mono} fontSize="9" fill={C.textDim} textAnchor="middle">SOFC-101</text>
      <text x="300" y="57" fontFamily={mono} fontSize="11" fill={C.green} textAnchor="middle" fontWeight="bold">
        {data.sofcPower.toFixed(0)} kW
      </text>
      <text x="300" y="72" fontFamily={mono} fontSize="9" fill={C.cyan} textAnchor="middle">
        {data.temp.toFixed(0)}°C
      </text>

      {/* REACTOR R-101 */}
      <rect x="220" y="170" width="120" height="110" fill={C.panelBg} stroke={C.borderDim} strokeWidth="2"/>
      <rect x="230" y="185" width="100" height="80"
        fill={running ? `rgba(255,102,0,${data.conversion / 250})` : '#111100'}
        style={{ transition: 'fill 0.5s' }}/>
      <rect x="210" y="165" width="140" height="8" fill="#222200"/>
      <rect x="210" y="277" width="140" height="8" fill="#222200"/>
      <text x="280" y="160" fontFamily={mono} fontSize="9" fill={C.textDim} textAnchor="middle">R-101 CRACKER</text>
      <text x="280" y="219" fontFamily={mono} fontSize="12" fill={C.green} textAnchor="middle" fontWeight="bold">
        {data.temp.toFixed(0)}°C
      </text>
      <text x="280" y="237" fontFamily={mono} fontSize="9" fill={C.cyan} textAnchor="middle">
        {data.pressure.toFixed(2)} MPa
      </text>
      <text x="280" y="255" fontFamily={mono} fontSize="9" fill={C.productGreen} textAnchor="middle">
        X = {data.conversion.toFixed(1)}%
      </text>

      {/* BATTERY BAT-101 */}
      <rect x="420" y="130" width="60" height="80" fill={C.panelBg} stroke={C.borderDim}/>
      <rect x="440" y="122" width="20" height="10" fill="#222200"/>
      <rect x="425" y={130 + 80 * (1 - data.batterySoc / 100)} width="50" height={80 * data.batterySoc / 100}
        fill={C.productGreen} opacity="0.6" style={{ transition: 'all 0.5s' }}/>
      <text x="450" y="118" fontFamily={mono} fontSize="9" fill={C.textDim} textAnchor="middle">BAT-101</text>
      <text x="450" y="164" fontFamily={mono} fontSize="11" fill={C.green} textAnchor="middle" fontWeight="bold">
        {data.batterySoc.toFixed(0)}%
      </text>

      {/* MOTOR M-101 */}
      <circle cx="420" cy="230" r="45" fill={C.panelBg} stroke={C.borderDim} strokeWidth="2"/>
      <circle cx="420" cy="230" r="35" fill="#111100" stroke="#222200"/>
      <g className={running ? 'motor-spin' : ''}>
        <line x1="395" y1="230" x2="445" y2="230" stroke={C.green} strokeWidth="4"/>
        <line x1="420" y1="205" x2="420" y2="255" stroke={C.green} strokeWidth="4"/>
      </g>
      <circle cx="420" cy="230" r="10" fill="#222200"/>
      <rect x="463" y="222" width="25" height="16" fill="#222200" stroke={C.borderDim}/>
      <text x="420" y="290" fontFamily={mono} fontSize="9" fill={C.textDim} textAnchor="middle">M-101 DCE</text>
      <text x="420" y="197" fontFamily={mono} fontSize="11" fill={C.green} textAnchor="middle" fontWeight="bold">
        {data.motorPower.toFixed(0)} kW
      </text>

      {/* OUTPUT ARROW */}
      <polygon points="555,215 580,230 555,245" fill={running ? C.green : C.borderDim}
        style={{ transition: 'fill 0.3s', filter: running ? `drop-shadow(0 0 4px ${C.green})` : 'none' }}/>
      <text x="567" y="265" fontFamily={mono} fontSize="9" fill={C.textDim} textAnchor="middle">PERVANE</text>

      {/* VALVES */}
      {[{ tx: 130, ty: 200, id: 'V-101' }, { tx: 300, ty: 300, id: 'V-102' }].map(v => (
        <g key={v.id} transform={`translate(${v.tx}, ${v.ty})`}>
          <polygon points="-8,-8 8,0 -8,8" fill={running ? C.green : C.borderDim}/>
          <polygon points="8,-8 -8,0 8,8" fill={running ? C.green : C.borderDim}/>
          <text x="0" y="18" fontFamily={mono} fontSize="7" fill={C.textDim} textAnchor="middle">{v.id}</text>
        </g>
      ))}

      {/* LEGEND */}
      <g transform="translate(20, 370)">
        {[
          { color: C.nh3Blue, label: 'NH₃', x: 0 },
          { color: C.productGreen, label: 'N₂+H₂', x: 60 },
          { color: C.heatOrange, label: L.heat, x: 130 },
          { color: C.electricYellow, label: L.electric, x: 180 }
        ].map(l => (
          <g key={l.label}>
            <rect x={l.x} y="-8" width="10" height="10" fill={l.color}/>
            <text x={l.x + 15} y="0" fontFamily={mono} fontSize="9" fill={C.textDim}>{l.label}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function DCESOFCDemo() {
  const { lang } = useLanguage()
  const L = LABELS[lang] || LABELS.tr
  const [isRunning, setIsRunning] = useState(false)
  const [motorLoad, setMotorLoad] = useState(75)
  const [residenceTime, setResidenceTime] = useState(25)
  const [targetTemp, setTargetTemp] = useState(700)
  const [sofcOn, setSofcOn] = useState(true)
  const [whrOn, setWhrOn] = useState(true)
  const [catalyst, setCatalyst] = useState('Ru')
  const [history, setHistory] = useState([])
  const [time, setTime] = useState(0)
  const [data, setData] = useState({
    temp: 25, pressure: 0.1, conversion: 0,
    motorPower: 0, sofcPower: 0, totalPower: 0,
    wtwEff: 0, tankLevel: 85, batterySoc: 65
  })

  const calcSim = (temp, tau, load, useSofc, useWhr, cat) => {
    const R = 8.314
    const T = temp + 273.15
    const { Ea, A } = CATALYSTS[cat]
    const k = A * Math.exp(-Ea / (R * T))
    const tauSec = tau / 10
    const conversion = Math.min(0.98, Math.max(0, 1 - Math.exp(-k * tauSec)))

    const nh3Flow = load * 0.08
    const h2Flow = nh3Flow * conversion
    const nh3Rem = nh3Flow * (1 - conversion)

    const sofcPower = useSofc
      ? h2Flow * (0.48 + (temp - 600) * 0.0003) * 120
      : 0

    const whrBonus = useWhr ? 1.12 : 1.0
    const dcePower = nh3Rem * 75 * (0.35 + conversion * 0.18) * (load / 100) * whrBonus

    const totalPower = sofcPower + dcePower
    const fuelEnergy = nh3Flow * 38.28
    const wtwEff = fuelEnergy > 0 ? Math.min(74, (totalPower / fuelEnergy) * 100) : 0
    const pressure = Math.min(3.5, 0.1 + conversion * 2.5 + temp / 400)

    return {
      temp,
      pressure,
      conversion: conversion * 100,
      sofcPower,
      motorPower: dcePower,
      totalPower,
      wtwEff
    }
  }

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTime(t => t + 1)
      const sim = calcSim(targetTemp, residenceTime, motorLoad, sofcOn, whrOn, catalyst)
      setData(prev => ({
        ...prev,
        ...sim,
        tankLevel: Math.max(10, prev.tankLevel - 0.04),
        batterySoc: sofcOn
          ? Math.min(95, prev.batterySoc + 0.08)
          : Math.max(20, prev.batterySoc - 0.04)
      }))
      setHistory(prev => [...prev.slice(-40), { t: prev.length, ...sim }])
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, motorLoad, residenceTime, targetTemp, sofcOn, whrOn, catalyst])

  const reset = () => {
    setIsRunning(false)
    setHistory([])
    setTime(0)
    setData({ temp: 25, pressure: 0.1, conversion: 0, motorPower: 0, sofcPower: 0, totalPower: 0, wtwEff: 0, tankLevel: 85, batterySoc: 65 })
  }

  const tau = (residenceTime / 10).toFixed(1)
  const mono = "'Courier New', monospace"
  const hh = (n) => String(n).padStart(2, '0')
  const clock = `${hh(Math.floor(time / 3600))}:${hh(Math.floor((time % 3600) / 60))}:${hh(time % 60)}`

  const leds = [
    { id: 'SOFC', on: sofcOn && isRunning },
    { id: 'RXN', on: isRunning },
    { id: 'MTR', on: isRunning && data.motorPower > 0 },
    { id: 'BAT', on: sofcOn && isRunning, warn: data.batterySoc < 30 }
  ]

  return (
    <div style={{ fontFamily: mono, background: C.black, color: C.green, minHeight: '100vh', padding: '80px 15px 15px' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${C.green}`, paddingBottom: '10px', marginBottom: '10px', fontSize: '11px' }}>
        <div style={{ lineHeight: '1.8' }}>
          <div style={{ color: C.textDim }}>[SYSTEM: DCE-SOFC HYBRID PROPULSION]</div>
          <div style={{ color: C.textDim }}>[UNIT: AGU MECHANICAL ENGINEERING]</div>
          <div style={{ color: C.textDim }}>
            {'[STATUS: '}
            <span style={{
              color: isRunning ? C.productGreen : C.textDim,
              textShadow: isRunning ? `0 0 10px ${C.productGreen}` : 'none'
            }}>
              {isRunning ? 'ACTIVE' : 'STANDBY'}
            </span>
            {']'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: C.cyan, fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>{clock}</div>
          <div style={{ color: C.textDim, fontSize: '10px', marginTop: '4px' }}>DCE-SOFC DIGITAL TWIN v2.0</div>
        </div>
      </div>

      {/* CONTROL BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', border: `1px solid ${C.borderDim}`, background: C.panelBg, marginBottom: '15px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsRunning(r => !r)} style={{
          background: isRunning ? C.dangerRed : 'none',
          border: `${isRunning ? 2 : 1}px solid ${isRunning ? C.dangerRed : C.green}`,
          color: isRunning ? 'white' : C.green,
          padding: '8px 20px', fontFamily: mono, fontSize: '12px',
          cursor: 'pointer', fontWeight: 'bold'
        }}>
          {isRunning ? L.stop : L.start}
        </button>
        <button onClick={reset} style={{
          background: 'none', border: `1px solid ${C.green}`, color: C.green,
          padding: '8px 20px', fontFamily: mono, fontSize: '12px', cursor: 'pointer'
        }}>
          [↺ RESET]
        </button>

        {/* LED STATUS */}
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          {leds.map(led => {
            const ledColor = led.on ? (led.warn ? C.orange : C.productGreen) : C.textDim
            return (
              <span key={led.id} style={{
                padding: '4px 8px', fontSize: '9px', background: C.panelBg,
                border: `1px solid ${led.on ? ledColor : C.borderDim}`,
                color: ledColor,
                boxShadow: led.on ? `0 0 8px ${ledColor}` : 'none',
                transition: 'all 0.3s'
              }}>
                {led.id}
              </span>
            )
          })}
        </div>
      </div>

      {/* MAIN 3-COLUMN GRID */}
      <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 285px', gap: '15px', marginBottom: '15px', minWidth: '900px' }}>

        {/* LEFT: CONTROLS */}
        <div style={S.panel}>
          <h3 style={S.panelTitle}>&gt; {L.controlPanel}</h3>

          <ControlSlider label={L.motorLoad} value={motorLoad} min={0} max={100}
            unit={`${motorLoad}%`} ticks={['0', '25', '50', '75', '100']}
            onChange={setMotorLoad} disabled={isRunning} />

          <ControlSlider label={L.residence} value={residenceTime} min={5} max={50}
            unit={`${tau}s`} onChange={setResidenceTime} disabled={isRunning} />

          <ControlSlider label={L.tempTarget} value={targetTemp} min={400} max={850}
            unit={`${targetTemp}°C`} ticks={['400', '600', '800']}
            onChange={setTargetTemp} disabled={isRunning} />

          <ToggleSwitch label={L.sofcCell} active={sofcOn} onToggle={() => setSofcOn(v => !v)} />
          <ToggleSwitch label={L.whr} active={whrOn} onToggle={() => setWhrOn(v => !v)} />

          {/* Catalyst selector */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '9px', color: C.textDim, marginBottom: '6px', letterSpacing: '0.15em' }}>{L.catalystType}</div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['Ru', 'Ni'].map(cat => (
                <button key={cat} onClick={() => !isRunning && setCatalyst(cat)} style={{
                  flex: 1, padding: '8px',
                  background: catalyst === cat ? 'rgba(0,212,255,0.2)' : 'none',
                  border: `1px solid ${catalyst === cat ? C.cyan : C.borderDim}`,
                  color: catalyst === cat ? C.cyan : C.textDim,
                  fontFamily: mono, fontSize: '12px',
                  cursor: isRunning ? 'not-allowed' : 'pointer'
                }}>{cat}</button>
              ))}
            </div>
            <div style={{ fontSize: '9px', color: C.textDim, marginTop: '5px', textAlign: 'center' }}>
              {CATALYSTS[catalyst].label}
            </div>
          </div>

          {/* Info box */}
          <div style={{ marginTop: '20px', padding: '10px', border: `1px dashed ${C.borderDim}`, fontSize: '10px' }}>
            <span style={{ color: C.textDim, display: 'block', marginBottom: '8px' }}>{L.systemInfo}</span>
            <p style={{ margin: '4px 0', color: C.green }}>2NH₃ → N₂ + 3H₂</p>
            <p style={{ margin: '4px 0', color: C.green }}>{L.molarExpansion}</p>
            <p style={{ margin: '4px 0', color: C.green }}>{L.combustion}</p>
          </div>
        </div>

        {/* CENTER: P&ID */}
        <div style={S.panel}>
          <h3 style={S.panelTitle}>&gt; {L.pid}</h3>
          <PIDDiagram running={isRunning} sofcOn={sofcOn} whrOn={whrOn} data={data} L={L} />
        </div>

        {/* RIGHT: DATA & FORMULAS */}
        <div style={S.panel}>
          <h3 style={S.panelTitle}>&gt; {L.thermoData}</h3>

          {/* Arrhenius */}
          <div style={S.formulaBox}>
            <span style={S.formulaTitle}>{L.arrhenius}</span>
            <div style={{ fontSize: '13px', color: C.green, textAlign: 'center', padding: '5px 0' }}>
              <span style={{ color: C.cyan }}>k</span>
              {' = '}
              <span style={{ color: C.orange }}>A</span>
              {' · exp('}
              <span style={{ color: C.dangerRed }}>−Eₐ</span>
              {' / '}
              <span style={{ color: C.nh3Blue }}>RT</span>
              {')'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '9px', color: C.textDim, marginTop: '8px' }}>
              <span>A = {CATALYSTS[catalyst].A.toExponential(1)}</span>
              <span>Eₐ = {CATALYSTS[catalyst].Ea / 1000} kJ/mol</span>
            </div>
          </div>

          {/* DCE Reaction */}
          <div style={S.formulaBox}>
            <span style={S.formulaTitle}>{L.dceReaction}</span>
            <div style={{ fontSize: '15px', textAlign: 'center', padding: '5px 0' }}>
              <span style={{ color: C.nh3Blue }}>2NH₃</span>
              <span style={{ color: C.textDim, margin: '0 8px' }}>→</span>
              <span style={{ color: C.productGreen }}>N₂</span>
              <span style={{ color: C.textDim }}> + </span>
              <span style={{ color: C.dangerRed }}>3H₂</span>
            </div>
            <div style={{ fontSize: '9px', color: C.textDim, textAlign: 'center', marginTop: '5px' }}>
              ΔV = +100% (2 mol → 4 mol)
            </div>
          </div>

          {/* Conversion */}
          <div style={S.formulaBox}>
            <span style={S.formulaTitle}>{L.conversionRate}</span>
            <div style={{ fontSize: '13px', color: C.green, textAlign: 'center', padding: '5px 0' }}>
              <span style={{ color: C.productGreen }}>X</span> = 1 − exp(−kτ)
            </div>
            <div style={{ fontSize: '10px', color: C.textDim, textAlign: 'center', marginTop: '5px' }}>
              τ = {tau}s →{' '}
              <span style={{ color: C.productGreen }}>X = {data.conversion.toFixed(1)}%</span>
            </div>
          </div>

          {/* Data Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '15px 0' }}>
            <DataCell label={L.reactorTemp} value={data.temp.toFixed(0)} unit="°C"
              barColor={C.heatOrange} barPct={(data.temp / 850) * 100} />
            <DataCell label={L.pressure} value={data.pressure.toFixed(2)} unit="MPa"
              barColor={C.nh3Blue} barPct={(data.pressure / 3.5) * 100} />
            <DataCell label={L.conversion} value={data.conversion.toFixed(1)} unit="%"
              barColor={C.productGreen} barPct={data.conversion} />
            <DataCell label={L.motorPower} value={data.motorPower.toFixed(1)} unit="kW"
              barColor={C.green} barPct={Math.min(100, data.motorPower / 3.5)} />
            <DataCell label={L.sofcElectric} value={data.sofcPower.toFixed(1)} unit="kW"
              barColor={C.electricYellow} barPct={Math.min(100, data.sofcPower / 3.5)} />
            <DataCell label={L.wtwEff} value={data.wtwEff.toFixed(1)} unit="%"
              barColor={C.cyan} barPct={data.wtwEff} />
          </div>

          {/* Mini chart */}
          {history.length > 1 && (
            <div style={{ border: `1px solid ${C.borderDim}`, padding: '10px', marginBottom: '10px', background: 'rgba(0,0,0,0.3)' }}>
              <span style={{ fontSize: '9px', color: C.textDim, display: 'block', marginBottom: '8px' }}>{L.liveStream}</span>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={history}>
                  <Line type="monotone" dataKey="temp" stroke={C.heatOrange} dot={false} strokeWidth={1.5} />
                  <Line type="monotone" dataKey="conversion" stroke={C.productGreen} dot={false} strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '5px', fontSize: '8px' }}>
                <span style={{ color: C.heatOrange }}>{L.temperature}</span>
                <span style={{ color: C.productGreen }}>{L.conversionLegend}</span>
              </div>
            </div>
          )}

          {/* IMO Compliance */}
          <div style={{ border: `1px dashed ${C.borderDim}`, padding: '10px', fontSize: '9px' }}>
            <span style={{ color: C.textDim, display: 'block', marginBottom: '5px' }}>// UYUMLULUK</span>
            {['IMO MSC.1/Circ.1687', L.igfCode, 'SOLAS II-1'].map(s => (
              <p key={s} style={{ margin: '3px 0', color: C.green }}>◆ {s}</p>
            ))}
          </div>
        </div>
      </div>
      </div>{/* scroll wrapper */}

      {/* AREA CHART */}
      {history.length > 1 && (
        <div style={{ border: `1px solid ${C.borderDim}`, background: C.panelBg, padding: '15px', marginBottom: '15px' }}>
          <h3 style={{ ...S.panelTitle, marginBottom: '10px' }}>&gt; {L.powerHistory}</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="gSOFC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.cyan} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={C.cyan} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="gDCE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.heatOrange} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={C.heatOrange} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a00" />
              <XAxis dataKey="t" stroke={C.borderDim} tick={{ fill: C.textDim, fontSize: 9, fontFamily: mono }} />
              <YAxis stroke={C.borderDim} tick={{ fill: C.textDim, fontSize: 9, fontFamily: mono }} />
              <Tooltip contentStyle={{ background: C.panelBg, border: `1px solid ${C.borderDim}`, fontFamily: mono, fontSize: '10px', color: C.green }} />
              <Area type="monotone" dataKey="sofcPower" stackId="1" stroke={C.cyan}
                fillOpacity={1} fill="url(#gSOFC)" name="SOFC (kW)" />
              <Area type="monotone" dataKey="motorPower" stackId="1" stroke={C.heatOrange}
                fillOpacity={1} fill="url(#gDCE)" name="DCE (kW)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', border: `1px solid ${C.borderDim}`, background: C.panelBg, fontSize: '9px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ color: C.textDim }}>{L.footerDept}</span>
        <span style={{ color: C.textDim }}>{L.footerSystem}</span>
        <span style={{ color: C.cyan }}>{L.footerTwin}</span>
      </div>
    </div>
  )
}
