import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, Polyline } from 'react-leaflet'
import { Radio, MapPin, Activity, Zap, AlertCircle, Play, Pause, RotateCcw, Info, Battery, Signal } from 'lucide-react'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const beaconIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff6b35" stroke="#ff6b35" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const stationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00d9ff" stroke="#00d9ff" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M12 7v10M7 12h10"/>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

export default function FLAREDemoPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [showHelp, setShowHelp] = useState(true)
  const [beacons, setBeacons] = useState([])
  const [stations, setStations] = useState([
    { id: 's1', lat: 38.7225, lng: 35.4864, name: 'AGÜ Base Station', range: 3000, color: '#00d9ff' },
    { id: 's2', lat: 38.7325, lng: 35.4964, name: 'Emergency Station 2', range: 2500, color: '#4ade80' }
  ])
  const [time, setTime] = useState(0)
  const [stats, setStats] = useState({
    activeBeacons: 0,
    rescued: 0,
    avgSignal: 0,
    coverage: 0,
    batteryAvg: 100
  })

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime(t => t + 1)

      // Random earthquake beacon activation
      if (Math.random() < 0.15) {
        const newBeacon = {
          id: `b${Date.now()}`,
          lat: 38.7225 + (Math.random() - 0.5) * 0.06,
          lng: 35.4864 + (Math.random() - 0.5) * 0.06,
          battery: 100,
          rssi: -60 - Math.random() * 60,
          status: 'active',
          timestamp: Date.now()
        }
        setBeacons(prev => [...prev, newBeacon])
      }

      // Update beacons
      setBeacons(prev => prev.map(b => ({
        ...b,
        battery: Math.max(0, b.battery - 0.05),
        rssi: -60 - Math.random() * 60
      })))

      updateStats()
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning, beacons, stations])

  const updateStats = () => {
    const active = beacons.filter(b => b.status === 'active')
    const avgSignal = active.length > 0 
      ? active.reduce((sum, b) => sum + Math.abs(b.rssi), 0) / active.length 
      : 0
    const avgBattery = beacons.length > 0
      ? beacons.reduce((sum, b) => sum + b.battery, 0) / beacons.length
      : 100
    
    setStats({
      activeBeacons: active.length,
      rescued: beacons.filter(b => b.status === 'rescued').length,
      avgSignal: Math.round(100 - avgSignal),
      coverage: Math.round((stations.reduce((sum, s) => sum + s.range, 0) / 100)),
      batteryAvg: Math.round(avgBattery)
    })
  }

  const rescueBeacon = (id) => {
    setBeacons(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'rescued' } : b
    ))
  }

  const reset = () => {
    setIsRunning(false)
    setBeacons([])
    setTime(0)
    setStats({ activeBeacons: 0, rescued: 0, avgSignal: 0, coverage: 0, batteryAvg: 100 })
  }

  return (
    <div className="min-h-screen bg-terminal-bg pt-20">
      {/* Header */}
      <div className="bg-terminal-darker border-b-2 border-terminal-accent p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Radio className="text-terminal-accent" size={40} />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-terminal-accent neon-glow">
                  FLARE Emergency System
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  LoRa 868 MHz Mesh Network Beacon Simulator
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
                className="p-3 border-2 border-terminal-accent text-terminal-accent hover:bg-terminal-accent hover:text-white"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-terminal-bg border-2 border-terminal-accent p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Activity size={14} />
                Active SOS
              </div>
              <div className="text-2xl font-bold text-terminal-accent">
                {stats.activeBeacons}
              </div>
            </div>

            <div className="bg-terminal-bg border-2 border-green-500 p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Zap size={14} />
                Rescued
              </div>
              <div className="text-2xl font-bold text-green-500">
                {stats.rescued}
              </div>
            </div>

            <div className="bg-terminal-bg border-2 border-terminal-secondary p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Signal size={14} />
                Avg Signal
              </div>
              <div className="text-2xl font-bold text-terminal-secondary">
                {stats.avgSignal}%
              </div>
            </div>

            <div className="bg-terminal-bg border-2 border-terminal-text p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Battery size={14} />
                Battery
              </div>
              <div className="text-2xl font-bold text-terminal-text">
                {stats.batteryAvg}%
              </div>
            </div>

            <div className="bg-terminal-bg border-2 border-terminal-border p-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <MapPin size={14} />
                Time
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
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
              How to Use This Simulation
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-bold text-terminal-accent mb-2">🎮 Controls</h4>
                <ul className="space-y-1">
                  <li>▸ <strong>Play/Pause</strong> - Start/stop earthquake simulation</li>
                  <li>▸ <strong>Reset</strong> - Clear all beacons and restart</li>
                  <li>▸ <strong>Click Beacon</strong> - View details and mark as rescued</li>
                  <li>▸ <strong>Zoom/Pan Map</strong> - Explore coverage area</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-terminal-accent mb-2">📡 How FLARE Works</h4>
                <ul className="space-y-1">
                  <li>▸ <strong>Auto-Activation</strong> - Beacons wake on earthquake detection</li>
                  <li>▸ <strong>LoRa 868 MHz</strong> - Penetrates concrete and debris</li>
                  <li>▸ <strong>Mesh Network</strong> - Beacons relay signals to stations</li>
                  <li>▸ <strong>GPS Location</strong> - Transmits coordinates every 10 seconds</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-terminal-accent mb-2">🔴 Orange Markers</h4>
                <ul className="space-y-1">
                  <li>▸ Active SOS beacons transmitting</li>
                  <li>▸ Click to see RSSI (signal strength)</li>
                  <li>▸ Battery level decreases over time</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-terminal-accent mb-2">🔵 Blue Circles</h4>
                <ul className="space-y-1">
                  <li>▸ Base station coverage (3 km radius)</li>
                  <li>▸ Receives LoRa transmissions</li>
                  <li>▸ Forwards to emergency services</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map */}
      <div className="h-[calc(100vh-280px)]">
        <MapContainer
          center={[38.7225, 35.4864]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />

          {/* Stations */}
          {stations.map(station => (
            <div key={station.id}>
              <Circle
                center={[station.lat, station.lng]}
                radius={station.range}
                pathOptions={{ color: station.color, fillColor: station.color, fillOpacity: 0.1, weight: 2 }}
              />
              <Marker position={[station.lat, station.lng]} icon={stationIcon}>
                <Popup>
                  <div className="text-sm">
                    <strong className="text-blue-500">{station.name}</strong><br/>
                    📡 Range: {station.range}m<br/>
                    🔋 Status: Online<br/>
                    📊 Frequency: 868 MHz
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}

          {/* Beacons */}
          {beacons.map(beacon => (
            <Marker
              key={beacon.id}
              position={[beacon.lat, beacon.lng]}
              icon={beaconIcon}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <div className={`font-bold mb-2 ${beacon.status === 'rescued' ? 'text-green-500' : 'text-orange-500'}`}>
                    {beacon.status === 'rescued' ? '✓ RESCUED' : '⚠ ACTIVE SOS'}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>🔋 Battery: {beacon.battery.toFixed(1)}%</div>
                    <div>📡 RSSI: {beacon.rssi.toFixed(0)} dBm</div>
                    <div>📍 GPS: {beacon.lat.toFixed(5)}, {beacon.lng.toFixed(5)}</div>
                    <div>⏱ Active: {Math.floor((Date.now() - beacon.timestamp) / 1000)}s</div>
                  </div>
                  {beacon.status === 'active' && (
                    <button
                      onClick={() => rescueBeacon(beacon.id)}
                      className="mt-3 w-full px-3 py-2 bg-green-500 text-white text-xs font-bold hover:bg-green-600"
                    >
                      🚑 MARK AS RESCUED
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
