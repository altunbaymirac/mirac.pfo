import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import { Radio, MapPin, Activity, Zap, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom icons
const beaconIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const stationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00d9ff" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M12 7v10M7 12h10"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

export default function FLAREAdvancedSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [beacons, setBeacons] = useState([])
  const [stations, setStations] = useState([
    { id: 's1', lat: 38.7225, lng: 35.4864, name: 'Base Station', range: 3000 }
  ])
  const [time, setTime] = useState(0)
  const [stats, setStats] = useState({
    activeBeacons: 0,
    rescued: 0,
    signalStrength: 0,
    coverage: 0
  })

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime(t => t + 1)

      // Random beacon activation (earthquake simulation)
      if (Math.random() < 0.1) {
        addBeacon()
      }

      // Update signal strength and rescues
      updateStats()
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning, beacons, stations])

  const addBeacon = () => {
    const newBeacon = {
      id: `b${Date.now()}`,
      lat: 38.7225 + (Math.random() - 0.5) * 0.05,
      lng: 35.4864 + (Math.random() - 0.5) * 0.05,
      battery: 100,
      rssi: -Math.random() * 120,
      status: 'active'
    }
    setBeacons(prev => [...prev, newBeacon])
  }

  const updateStats = () => {
    const active = beacons.filter(b => b.status === 'active').length
    const avgSignal = beacons.reduce((sum, b) => sum + Math.abs(b.rssi), 0) / (beacons.length || 1)
    
    setStats({
      activeBeacons: active,
      rescued: beacons.length - active,
      signalStrength: Math.round(100 - avgSignal),
      coverage: Math.round((stations.length * 3000) / 50) // simplified
    })
  }

  const rescueBeacon = (id) => {
    setBeacons(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'rescued' } : b
    ))
  }

  const reset = () => {
    setBeacons([])
    setTime(0)
    setStats({ activeBeacons: 0, rescued: 0, signalStrength: 0, coverage: 0 })
  }

  return (
    <div className="h-full flex flex-col bg-terminal-darker">
      {/* Header */}
      <div className="p-4 bg-terminal-bg border-b-2 border-terminal-accent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Radio className="text-terminal-accent" size={28} />
            <div>
              <h3 className="text-xl font-bold text-terminal-accent">
                FLARE Emergency Network
              </h3>
              <p className="text-xs text-gray-500">LoRa Mesh Beacon Simulator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-3 border-2 ${
                isRunning 
                  ? 'bg-red-500 border-red-500 text-white' 
                  : 'bg-green-500 border-green-500 text-white'
              }`}
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-terminal-darker border border-terminal-border p-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Activity size={14} />
              Active
            </div>
            <div className="text-2xl font-bold text-terminal-accent">
              {stats.activeBeacons}
            </div>
          </div>

          <div className="bg-terminal-darker border border-terminal-border p-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Zap size={14} />
              Rescued
            </div>
            <div className="text-2xl font-bold text-green-500">
              {stats.rescued}
            </div>
          </div>

          <div className="bg-terminal-darker border border-terminal-border p-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Radio size={14} />
              Signal
            </div>
            <div className="text-2xl font-bold text-terminal-secondary">
              {stats.signalStrength}%
            </div>
          </div>

          <div className="bg-terminal-darker border border-terminal-border p-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <MapPin size={14} />
              Time
            </div>
            <div className="text-2xl font-bold text-terminal-text">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[38.7225, 35.4864]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
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
                pathOptions={{ color: '#00d9ff', fillColor: '#00d9ff', fillOpacity: 0.1 }}
              />
              <Marker position={[station.lat, station.lng]} icon={stationIcon}>
                <Popup>
                  <div className="text-sm">
                    <strong>{station.name}</strong><br/>
                    Range: {station.range}m
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
                <div className="text-sm">
                  <strong className={beacon.status === 'rescued' ? 'text-green-500' : 'text-orange-500'}>
                    {beacon.status === 'rescued' ? '✓ Rescued' : '⚠ Active SOS'}
                  </strong><br/>
                  Battery: {beacon.battery}%<br/>
                  RSSI: {beacon.rssi.toFixed(0)} dBm<br/>
                  {beacon.status === 'active' && (
                    <button
                      onClick={() => rescueBeacon(beacon.id)}
                      className="mt-2 px-3 py-1 bg-green-500 text-white text-xs"
                    >
                      Mark Rescued
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-terminal-bg border-2 border-terminal-border p-3 text-xs z-[1000]">
          <div className="font-bold text-terminal-text mb-2">Legend</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-400">Active Beacon</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400">Rescued</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-400">Base Station</span>
          </div>
        </div>
      </div>
    </div>
  )
}
