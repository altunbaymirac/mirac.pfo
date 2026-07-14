import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Battery,
  CheckCircle2,
  CircleDot,
  Clock,
  Info,
  Layers,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ShieldCheck,
  Signal,
  Siren,
  WifiOff,
} from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_ORDER = {
  confirmed_alive: 1,
  vibration_detected: 2,
  broadcast_only: 3,
  safe: 4,
  silent: 5,
}

const TRIAGE = {
  confirmed_alive: {
    label: 'Confirmed alive',
    shortLabel: 'Alive',
    priority: 1,
    color: '#ef4444',
    border: 'border-red-500',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    icon: Siren,
    mapCode: 'A',
  },
  vibration_detected: {
    label: 'Vibration detected',
    shortLabel: 'Vibration',
    priority: 2,
    color: '#f97316',
    border: 'border-orange-500',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    icon: Activity,
    mapCode: 'V',
  },
  broadcast_only: {
    label: 'Broadcast only',
    shortLabel: 'Broadcast',
    priority: 3,
    color: '#9ca3af',
    border: 'border-gray-400',
    text: 'text-gray-300',
    bg: 'bg-gray-500/10',
    icon: Radio,
    mapCode: 'B',
  },
  safe: {
    label: 'Safe',
    shortLabel: 'Safe',
    priority: 'Cleared',
    color: '#22c55e',
    border: 'border-green-500',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    icon: ShieldCheck,
    mapCode: 'S',
  },
  silent: {
    label: 'Silent node',
    shortLabel: 'Silent',
    priority: 'Review',
    color: '#374151',
    border: 'border-gray-700',
    text: 'text-gray-500',
    bg: 'bg-gray-800/60',
    icon: WifiOff,
    mapCode: 'X',
  },
}

const STATION = {
  id: 'STATION-01',
  name: 'Station-01',
  position: [38.7225, 35.4864],
}

const INITIAL_BUILDINGS = [
  {
    buildingId: 'BLD-02',
    name: 'North Residence',
    hubId: 'HUB-02',
    position: [38.7316, 35.4749],
    status: 'active',
    lastHeartbeat: '5s ago',
    connectedBeacons: 18,
    neighbourHubs: ['HUB-04', 'HUB-07'],
  },
  {
    buildingId: 'BLD-04',
    name: 'Ataturk Block',
    hubId: 'HUB-04',
    position: [38.7221, 35.4862],
    status: 'active',
    lastHeartbeat: '3s ago',
    connectedBeacons: 24,
    neighbourHubs: ['HUB-02', 'HUB-07'],
  },
  {
    buildingId: 'BLD-07',
    name: 'East Apartments',
    hubId: 'HUB-07',
    position: [38.7141, 35.4995],
    status: 'active',
    lastHeartbeat: '7s ago',
    connectedBeacons: 21,
    neighbourHubs: ['HUB-02', 'HUB-04', 'HUB-11'],
  },
  {
    buildingId: 'BLD-11',
    name: 'South Dormitory',
    hubId: 'HUB-11',
    position: [38.7058, 35.4824],
    status: 'silent',
    lastHeartbeat: 'no heartbeat for 74s',
    connectedBeacons: 16,
    neighbourHubs: ['HUB-07'],
  },
]

const INITIAL_REPORTS = [
  {
    id: 'B-17',
    buildingId: 'BLD-04',
    floor: 3,
    installedLocation: 'Bedroom A / low wall socket',
    battery: 99.7,
    lastVibration: '18s ago',
    buttonState: 'short_press',
    lastPacket: '2s ago',
    relayPath: ['HUB-04', 'HUB-07', 'STATION-01'],
    triageStatus: 'confirmed_alive',
    priority: 1,
  },
  {
    id: 'B-08',
    buildingId: 'BLD-02',
    floor: 5,
    installedLocation: 'Bedroom C / wardrobe-side outlet',
    battery: 94.2,
    lastVibration: '41s ago',
    buttonState: 'none',
    lastPacket: '8s ago',
    relayPath: ['HUB-02', 'HUB-04', 'STATION-01'],
    triageStatus: 'vibration_detected',
    priority: 2,
  },
  {
    id: 'B-31',
    buildingId: 'BLD-07',
    floor: 2,
    installedLocation: 'Bedroom B / bedside outlet',
    battery: 88.9,
    lastVibration: '1m 12s ago',
    buttonState: 'none',
    lastPacket: '11s ago',
    relayPath: ['HUB-07', 'HUB-04', 'STATION-01'],
    triageStatus: 'broadcast_only',
    priority: 3,
  },
  {
    id: 'B-22',
    buildingId: 'BLD-04',
    floor: 1,
    installedLocation: 'Bedroom D / window-side outlet',
    battery: 97.1,
    lastVibration: 'none',
    buttonState: 'long_press',
    lastPacket: '6s ago',
    relayPath: ['HUB-04', 'STATION-01'],
    triageStatus: 'safe',
    priority: 'Cleared',
  },
  {
    id: 'B-14',
    buildingId: 'BLD-11',
    floor: 4,
    installedLocation: 'Bedroom A / low wall socket',
    battery: 72.4,
    lastVibration: 'unknown',
    buttonState: 'none',
    lastPacket: 'no packet for 74s',
    relayPath: ['HUB-11'],
    triageStatus: 'silent',
    priority: 'Review',
  },
  {
    id: 'B-33',
    buildingId: 'BLD-07',
    floor: 6,
    installedLocation: 'Bedroom A / desk-side outlet',
    battery: 91.6,
    lastVibration: '24s ago',
    buttonState: 'short_press',
    lastPacket: '4s ago',
    relayPath: ['HUB-07', 'HUB-04', 'STATION-01'],
    triageStatus: 'confirmed_alive',
    priority: 1,
  },
  {
    id: 'B-02',
    buildingId: 'BLD-02',
    floor: 2,
    installedLocation: 'Bedroom B / hall-side outlet',
    battery: 86.1,
    lastVibration: 'none',
    buttonState: 'none',
    lastPacket: '17s ago',
    relayPath: ['HUB-02', 'HUB-04', 'STATION-01'],
    triageStatus: 'broadcast_only',
    priority: 3,
  },
]

function createHubIcon(building, reports) {
  const priorityStatus = reports[0]?.triageStatus || (building.status === 'silent' ? 'silent' : 'broadcast_only')
  const triage = TRIAGE[priorityStatus]

  return L.divIcon({
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    html: `
      <div style="
        width:42px;height:42px;border-radius:10px;
        display:flex;align-items:center;justify-content:center;
        background:#050b12;border:3px solid ${triage.color};
        color:${triage.color};font-weight:800;font-family:monospace;
        box-shadow:0 0 18px ${triage.color}66;">
        ${building.status === 'silent' ? 'X' : 'H'}
      </div>
    `,
  })
}

const stationIcon = L.divIcon({
  className: '',
  iconSize: [46, 46],
  iconAnchor: [23, 23],
  html: `
    <div style="
      width:46px;height:46px;border-radius:8px;
      display:flex;align-items:center;justify-content:center;
      background:#04131a;border:3px solid #00d9ff;
      color:#00d9ff;font-weight:900;font-family:monospace;
      box-shadow:0 0 20px #00d9ff66;">
      ST
    </div>
  `,
})

function dedupeAndSortReports(reports) {
  const merged = new Map()

  reports.forEach((report) => {
    const current = merged.get(report.id)
    if (!current || STATUS_ORDER[report.triageStatus] < STATUS_ORDER[current.triageStatus]) {
      merged.set(report.id, report)
    }
  })

  return Array.from(merged.values()).sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.triageStatus] - STATUS_ORDER[b.triageStatus]
    if (statusDiff !== 0) return statusDiff
    return String(a.id).localeCompare(String(b.id))
  })
}

function searchZone(report) {
  const location = report.installedLocation.split('/')[0].trim()
  return `Floor ${report.floor}, ${location} search zone`
}

function StatCard({ label, value, triageKey, icon: Icon }) {
  const triage = triageKey ? TRIAGE[triageKey] : null

  return (
    <div className={`bg-terminal-bg border-2 ${triage?.border || 'border-terminal-border'} p-3`}>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
        <Icon size={14} />
        {label}
      </div>
      <div className={`text-2xl font-bold ${triage?.text || 'text-terminal-text'}`}>
        {value}
      </div>
    </div>
  )
}

function TriageBadge({ status }) {
  const triage = TRIAGE[status]
  const Icon = triage.icon

  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 border ${triage.border} ${triage.text} ${triage.bg} text-xs font-mono`}>
      <Icon size={14} />
      {triage.label}
    </span>
  )
}

function BeaconDetail({ report }) {
  if (!report) {
    return (
      <div className="bg-terminal-darker border border-terminal-border p-5 text-sm text-gray-400">
        Select a beacon report to inspect installation and relay details.
      </div>
    )
  }

  const rows = [
    ['Beacon ID', report.id],
    ['Building ID', report.buildingId],
    ['Floor', report.floor],
    ['Installed location', report.installedLocation],
    ['Battery', `${report.battery.toFixed(1)}%`],
    ['Last vibration', report.lastVibration],
    ['Button state', report.buttonState.replace('_', ' ')],
    ['Last packet time', report.lastPacket],
    ['Relay path', report.relayPath.join(' -> ')],
    ['Triage status', TRIAGE[report.triageStatus].label],
    ['Priority', report.priority],
  ]

  return (
    <div className={`bg-terminal-darker border-2 ${TRIAGE[report.triageStatus].border} p-5`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-bold text-terminal-text">{report.id}</h3>
          <p className="text-xs text-gray-500 font-mono">{searchZone(report)}</p>
        </div>
        <TriageBadge status={report.triageStatus} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="bg-terminal-bg border border-terminal-border p-3">
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{label}</div>
            <div className="text-terminal-text font-mono break-words">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ConcreteWebDemo() {
  const [isRunning, setIsRunning] = useState(true)
  const [showMesh, setShowMesh] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS)
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [selectedBuildingId, setSelectedBuildingId] = useState('BLD-04')
  const [selectedReportId, setSelectedReportId] = useState('B-17')
  const [tick, setTick] = useState(0)

  const params = new URLSearchParams(window.location.search)
  const isPresentation = params.get('presentation') === '1' || params.get('mode') === 'presentation'
  const isDevControlsVisible = import.meta.env.DEV && !isPresentation

  const sortedReports = useMemo(() => dedupeAndSortReports(reports), [reports])
  const selectedBuilding = buildings.find((building) => building.buildingId === selectedBuildingId) || buildings[0]
  const selectedBuildingReports = sortedReports.filter((report) => report.buildingId === selectedBuilding.buildingId)
  const selectedReport = sortedReports.find((report) => report.id === selectedReportId) || selectedBuildingReports[0] || sortedReports[0]
  const meshLinks = buildings.flatMap((building) =>
    building.neighbourHubs
      .map((hubId) => {
        const neighbour = buildings.find((candidate) => candidate.hubId === hubId)
        if (!neighbour || building.hubId > neighbour.hubId) return null
        return [building.position, neighbour.position]
      })
      .filter(Boolean)
  )

  const stats = {
    confirmed_alive: sortedReports.filter((report) => report.triageStatus === 'confirmed_alive').length,
    vibration_detected: sortedReports.filter((report) => report.triageStatus === 'vibration_detected').length,
    broadcast_only: sortedReports.filter((report) => report.triageStatus === 'broadcast_only').length,
    safe: sortedReports.filter((report) => report.triageStatus === 'safe').length,
    activeHubs: buildings.filter((building) => building.status === 'active').length,
    silentNodes:
      sortedReports.filter((report) => report.triageStatus === 'silent').length +
      buildings.filter((building) => building.status === 'silent').length,
  }

  const injectTestEvent = () => {
    const cycle = ['confirmed_alive', 'vibration_detected', 'broadcast_only', 'safe', 'silent']
    const target = sortedReports.find((report) => report.buildingId === selectedBuilding.buildingId) || sortedReports[0]
    const nextStatus = cycle[(cycle.indexOf(target.triageStatus) + 1) % cycle.length]
    const nextTriage = TRIAGE[nextStatus]

    setReports((current) =>
      current.map((report) =>
        report.id === target.id
          ? {
              ...report,
              triageStatus: nextStatus,
              priority: nextTriage.priority,
              buttonState:
                nextStatus === 'confirmed_alive'
                  ? 'short_press'
                  : nextStatus === 'safe'
                    ? 'long_press'
                    : 'none',
              lastPacket: nextStatus === 'silent' ? 'no packet for 62s' : 'just now',
              lastVibration: nextStatus === 'vibration_detected' ? 'just now' : report.lastVibration,
            }
          : report
      )
    )
    setSelectedReportId(target.id)
  }

  const advanceHeartbeat = () => {
    setTick((value) => value + 1)
    setBuildings((current) =>
      current.map((building) => {
        if (building.hubId !== 'HUB-11') {
          return { ...building, status: 'active', lastHeartbeat: `${3 + ((tick + building.connectedBeacons) % 6)}s ago` }
        }

        return {
          ...building,
          status: tick % 3 === 2 ? 'active' : 'silent',
          lastHeartbeat: tick % 3 === 2 ? '9s ago' : `no heartbeat for ${74 + tick * 7}s`,
        }
      })
    )
  }

  const reset = () => {
    setIsRunning(true)
    setTick(0)
    setBuildings(INITIAL_BUILDINGS)
    setReports(INITIAL_REPORTS)
    setSelectedBuildingId('BLD-04')
    setSelectedReportId('B-17')
  }

  useEffect(() => {
    if (!isRunning) return undefined
    const id = window.setInterval(advanceHeartbeat, 4500)
    return () => window.clearInterval(id)
  }, [isRunning, tick])

  return (
    <div className={`min-h-screen bg-terminal-bg ${isPresentation ? 'pt-0' : 'pt-20'}`}>
      <header className="bg-terminal-darker border-b-2 border-terminal-accent">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-5">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <Radio className="text-terminal-accent mt-1" size={36} />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-terminal-accent neon-glow">
                  ConcreteWeb Mesh & Triage Simulation
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-3xl">
                  Building-level HUB mesh with registered bedroom beacons and a prioritized rescue station view.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-3 border-2 ${
                  showInfo
                    ? 'bg-terminal-text border-terminal-text text-terminal-bg'
                    : 'border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg'
                }`}
                title="How the simulation works"
              >
                <Info size={20} />
              </button>
              <button
                onClick={() => setShowMesh(!showMesh)}
                className={`p-3 border-2 ${
                  showMesh
                    ? 'bg-terminal-secondary border-terminal-secondary text-white'
                    : 'border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg'
                }`}
                title="Toggle HUB mesh links"
              >
                <Layers size={20} />
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-3 border-2 ${
                  isRunning ? 'bg-terminal-secondary border-terminal-secondary' : 'bg-green-600 border-green-600'
                } text-white`}
                title={isRunning ? 'Pause heartbeat simulation' : 'Resume heartbeat simulation'}
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={reset}
                className="p-3 border-2 border-terminal-accent text-terminal-accent hover:bg-terminal-accent hover:text-white"
                title="Reset demo state"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatCard label="Confirmed alive" value={stats.confirmed_alive} triageKey="confirmed_alive" icon={Siren} />
            <StatCard label="Vibration detected" value={stats.vibration_detected} triageKey="vibration_detected" icon={Activity} />
            <StatCard label="Broadcast only" value={stats.broadcast_only} triageKey="broadcast_only" icon={Radio} />
            <StatCard label="Safe" value={stats.safe} triageKey="safe" icon={ShieldCheck} />
            <StatCard label="Active HUBs" value={stats.activeHubs} icon={Signal} />
            <StatCard label="Silent nodes" value={stats.silentNodes} triageKey="silent" icon={WifiOff} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 font-mono">
            <span className="inline-flex items-center gap-2">
              <CircleDot size={14} />
              Mesh links: {meshLinks.length}
            </span>
            <span>One HUB per building</span>
            <span>Beacon positions are registered during installation, not reported as GPS coordinates.</span>
          </div>

          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 grid lg:grid-cols-4 gap-3 bg-terminal-bg border-2 border-terminal-text p-4"
            >
              <div>
                <div className="text-terminal-text font-bold mb-1">1. Registered beacons</div>
                <p className="text-xs text-gray-400">
                  Each bedroom beacon is paired with a Beacon ID, building, floor, and installed location during setup.
                </p>
              </div>
              <div>
                <div className="text-terminal-text font-bold mb-1">2. One HUB per building</div>
                <p className="text-xs text-gray-400">
                  The map shows buildings and their single HUB. Beacon reports do not create GPS points on the map.
                </p>
              </div>
              <div>
                <div className="text-terminal-text font-bold mb-1">3. HUB mesh relay</div>
                <p className="text-xs text-gray-400">
                  HUBs forward reports through neighbouring HUBs over a simulated 868 MHz store-and-forward mesh.
                </p>
              </div>
              <div>
                <div className="text-terminal-text font-bold mb-1">4. Station triage</div>
                <p className="text-xs text-gray-400">
                  The Station merges repeated packets by Beacon ID and sorts reports by life sign priority.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 grid xl:grid-cols-[1.15fr_0.85fr] gap-5">
        <section className="space-y-5">
          <div className="bg-terminal-darker border-2 border-terminal-border overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-4 border-b border-terminal-border">
              <div>
                <h2 className="text-xl font-bold text-terminal-text">City HUB Mesh</h2>
                <p className="text-xs text-gray-500">Map displays buildings and their single LoRa HUB, not individual beacon GPS points.</p>
              </div>
              <TriageBadge status={selectedBuilding.status === 'silent' ? 'silent' : selectedBuildingReports[0]?.triageStatus || 'broadcast_only'} />
            </div>

            <div className="h-[430px] md:h-[560px]">
              <MapContainer center={[38.7195, 35.4864]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={!isPresentation}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />

                {showMesh &&
                  meshLinks.map((link, index) => (
                    <Polyline
                      key={`hub-link-${index}`}
                      positions={link}
                      pathOptions={{ color: '#00d9ff', weight: 2, opacity: 0.55, dashArray: '8 8' }}
                    />
                  ))}

                <Marker position={STATION.position} icon={stationIcon}>
                  <Popup>
                    <strong>{STATION.name}</strong>
                    <br />
                    Prioritized triage view
                    <br />
                    Receives reports through HUB relay paths
                  </Popup>
                </Marker>

                {buildings.map((building) => {
                  const buildingReports = sortedReports.filter((report) => report.buildingId === building.buildingId)
                  return (
                    <Marker
                      key={building.buildingId}
                      position={building.position}
                      icon={createHubIcon(building, buildingReports)}
                      eventHandlers={{
                        click: () => {
                          setSelectedBuildingId(building.buildingId)
                          setSelectedReportId(buildingReports[0]?.id)
                        },
                      }}
                    >
                      <Popup>
                        <strong>{building.name}</strong>
                        <br />
                        {building.buildingId} / {building.hubId}
                        <br />
                        Heartbeat: {building.lastHeartbeat}
                        <br />
                        Registered beacons: {building.connectedBeacons}
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-terminal-darker border-2 border-terminal-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-terminal-secondary" size={20} />
                <h2 className="text-xl font-bold text-terminal-text">Selected Building</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl font-bold text-terminal-accent">{selectedBuilding.buildingId}</div>
                    <div className="text-gray-400">{selectedBuilding.name}</div>
                  </div>
                  <span className={`px-3 py-1 border text-xs font-mono ${
                    selectedBuilding.status === 'active'
                      ? 'border-green-500 text-green-400 bg-green-500/10'
                      : 'border-gray-700 text-gray-500 bg-gray-800/60'
                  }`}>
                    {selectedBuilding.status === 'active' ? 'HUB heartbeat active' : 'HUB silent from neighbour heartbeat checks'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-terminal-bg border border-terminal-border p-3">
                    <div className="text-gray-500 text-xs">HUB ID</div>
                    <div className="font-mono text-terminal-text">{selectedBuilding.hubId}</div>
                  </div>
                  <div className="bg-terminal-bg border border-terminal-border p-3">
                    <div className="text-gray-500 text-xs">Last heartbeat</div>
                    <div className="font-mono text-terminal-text">{selectedBuilding.lastHeartbeat}</div>
                  </div>
                  <div className="bg-terminal-bg border border-terminal-border p-3">
                    <div className="text-gray-500 text-xs">Registered beacons</div>
                    <div className="font-mono text-terminal-text">{selectedBuilding.connectedBeacons}</div>
                  </div>
                  <div className="bg-terminal-bg border border-terminal-border p-3">
                    <div className="text-gray-500 text-xs">Neighbour HUBs</div>
                    <div className="font-mono text-terminal-text">{selectedBuilding.neighbourHubs.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-terminal-darker border-2 border-terminal-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="text-terminal-secondary" size={20} />
                <h2 className="text-xl font-bold text-terminal-text">Registered Search Zones</h2>
              </div>
              <div className="space-y-2">
                {selectedBuildingReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`w-full text-left border p-3 transition-colors ${
                      selectedReport?.id === report.id
                        ? `${TRIAGE[report.triageStatus].border} ${TRIAGE[report.triageStatus].bg}`
                        : 'border-terminal-border bg-terminal-bg hover:border-terminal-text'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="font-mono text-terminal-text">{report.id}</span>
                      <TriageBadge status={report.triageStatus} />
                    </div>
                    <div className="text-xs text-gray-400">{searchZone(report)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="bg-terminal-darker border-2 border-terminal-border p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-terminal-text">Station Triage Queue</h2>
                <p className="text-xs text-gray-500">Repeated packets are merged by Beacon ID and sorted by operational priority.</p>
              </div>
              <Clock className="text-terminal-secondary" size={20} />
            </div>

            <div className="space-y-2 max-h-[410px] overflow-y-auto pr-1">
              {sortedReports.map((report) => {
                const triage = TRIAGE[report.triageStatus]
                const Icon = triage.icon
                return (
                  <button
                    key={report.id}
                    onClick={() => {
                      setSelectedReportId(report.id)
                      setSelectedBuildingId(report.buildingId)
                    }}
                    className={`w-full text-left border p-3 transition-colors ${
                      selectedReport?.id === report.id
                        ? `${triage.border} ${triage.bg}`
                        : 'border-terminal-border bg-terminal-bg hover:border-terminal-text'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={triage.text} size={18} />
                        <div className="min-w-0">
                          <div className="text-terminal-text font-mono">{report.id}</div>
                          <div className="text-xs text-gray-500 truncate">{report.buildingId} / Floor {report.floor}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${triage.text}`}>{triage.shortLabel}</div>
                        <div className="text-[11px] text-gray-500">P: {report.priority}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <BeaconDetail report={selectedReport} />

          <div className="bg-terminal-darker border-2 border-terminal-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-terminal-secondary" size={20} />
              <h2 className="text-xl font-bold text-terminal-text">Architecture Notes</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>One fixed beacon is registered per bedroom installation point.</li>
              <li>Beacons do not report GPS; location comes from the installation registry.</li>
              <li>Each building has one HUB that relays reports to neighbouring HUBs over 868 MHz LoRa.</li>
              <li>Silent HUBs are flagged from missing heartbeat observations through neighbour HUBs.</li>
              <li>The Station view is a triage interface for search prioritization, not a measurement claim.</li>
            </ul>
          </div>

          {isDevControlsVisible && (
            <div className="bg-terminal-darker border-2 border-dashed border-terminal-secondary p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-terminal-secondary">Inject test event</h2>
                  <p className="text-xs text-gray-500">Visible only in development mode and hidden in presentation mode.</p>
                </div>
                <CheckCircle2 className="text-terminal-secondary" size={20} />
              </div>
              <button
                onClick={injectTestEvent}
                className="w-full px-4 py-3 border-2 border-terminal-secondary text-terminal-secondary font-bold hover:bg-terminal-secondary hover:text-terminal-bg transition-colors"
              >
                Cycle selected building report
              </button>
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}
