import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Check } from 'lucide-react'

const API_ENDPOINTS = [
  {
    name: 'Get Beacon Status',
    method: 'GET',
    endpoint: '/api/flare/beacon/:id',
    description: 'Retrieve real-time status of a FLARE beacon',
    params: [{ name: 'id', type: 'string', example: 'BCN-001' }],
    response: {
      id: 'BCN-001',
      status: 'SOS',
      battery: 45,
      signalStrength: -75,
      position: { lat: 38.7235, lng: 35.4890 },
      lastSeen: '2025-01-15T10:30:00Z'
    }
  },
  {
    name: 'Simulate Earthquake',
    method: 'POST',
    endpoint: '/api/flare/earthquake/simulate',
    description: 'Trigger earthquake detection on all beacons in area',
    body: {
      magnitude: 7.8,
      epicenter: { lat: 38.7200, lng: 35.4850 },
      radius: 50
    },
    response: {
      activated_beacons: 127,
      sos_signals: 89,
      safe_signals: 38,
      timestamp: '2025-01-15T10:30:15Z'
    }
  },
  {
    name: 'DCE-SOFC Metrics',
    method: 'GET',
    endpoint: '/api/dce-sofc/metrics',
    description: 'Get current thermodynamic parameters',
    response: {
      temperature: 850,
      pressure: 8.5,
      h2_production: 2.34,
      sofc_power: 450,
      dce_power: 3200,
      efficiency: 68.5
    }
  }
]

export default function APIPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0])
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const executeRequest = () => {
    setLoading(true)
    setResponse(null)

    // Simulate API call
    setTimeout(() => {
      setResponse(selectedEndpoint.response)
      setLoading(false)
    }, 1000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-terminal-text neon-glow">
          🔌 API Playground
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Test FLARE & DCE-SOFC APIs in real-time
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Endpoint Selection */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-terminal-secondary border-b border-terminal-border pb-2">
            AVAILABLE ENDPOINTS
          </h3>
          {API_ENDPOINTS.map((endpoint) => (
            <motion.div
              key={endpoint.name}
              whileHover={{ x: 5 }}
              onClick={() => setSelectedEndpoint(endpoint)}
              className={`p-3 border-2 cursor-pointer transition-all ${
                selectedEndpoint.name === endpoint.name
                  ? 'border-terminal-text bg-terminal-text/10'
                  : 'border-terminal-border hover:border-terminal-secondary'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-terminal-accent">
                  {endpoint.method}
                </span>
                <span className="text-xs text-gray-500">
                  {endpoint.endpoint.split('/').slice(-1)[0]}
                </span>
              </div>
              <p className="text-sm text-terminal-text">{endpoint.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Request Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Method & Endpoint */}
          <div className="bg-terminal-darker border-2 border-terminal-text p-4">
            <h3 className="text-xs font-bold text-terminal-secondary mb-3">REQUEST</h3>
            <div className="flex items-center space-x-3 mb-3">
              <span className={`px-3 py-1 font-mono text-xs font-bold ${
                selectedEndpoint.method === 'GET' 
                  ? 'bg-terminal-text text-terminal-bg' 
                  : 'bg-terminal-accent text-white'
              }`}>
                {selectedEndpoint.method}
              </span>
              <code className="flex-1 bg-terminal-bg p-2 border border-terminal-border text-terminal-secondary font-mono text-sm">
                {selectedEndpoint.endpoint}
              </code>
            </div>
            <p className="text-xs text-gray-400">{selectedEndpoint.description}</p>
          </div>

          {/* Parameters */}
          {selectedEndpoint.params && (
            <div className="bg-terminal-darker border-2 border-terminal-border p-4">
              <h3 className="text-xs font-bold text-terminal-secondary mb-3">PARAMETERS</h3>
              {selectedEndpoint.params.map((param) => (
                <div key={param.name} className="mb-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-terminal-text font-mono text-sm">{param.name}</span>
                    <span className="text-xs text-gray-500">({param.type})</span>
                  </div>
                  <input
                    type="text"
                    defaultValue={param.example}
                    className="w-full bg-terminal-bg border border-terminal-border p-2 text-terminal-text font-mono text-sm focus:border-terminal-text outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          {selectedEndpoint.body && (
            <div className="bg-terminal-darker border-2 border-terminal-border p-4">
              <h3 className="text-xs font-bold text-terminal-secondary mb-3">REQUEST BODY</h3>
              <pre className="bg-terminal-bg border border-terminal-border p-3 text-terminal-text font-mono text-xs overflow-x-auto">
                {JSON.stringify(selectedEndpoint.body, null, 2)}
              </pre>
            </div>
          )}

          {/* Execute Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={executeRequest}
            disabled={loading}
            className="w-full bg-terminal-text border-2 border-terminal-text text-terminal-bg py-3 font-bold font-mono flex items-center justify-center space-x-2 hover:bg-transparent hover:text-terminal-text transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-terminal-bg border-t-transparent rounded-full animate-spin" />
                <span>EXECUTING...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>EXECUTE REQUEST</span>
              </>
            )}
          </motion.button>

          {/* Response */}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-terminal-darker border-2 border-terminal-text p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-terminal-text">RESPONSE</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className="p-2 border border-terminal-border text-terminal-text hover:border-terminal-text transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
              <pre className="bg-terminal-bg border border-terminal-border p-3 text-terminal-text font-mono text-xs overflow-x-auto max-h-64">
                {JSON.stringify(response, null, 2)}
              </pre>
              <div className="mt-2 flex items-center space-x-2 text-xs">
                <span className="px-2 py-1 bg-green-500 text-white font-mono">200 OK</span>
                <span className="text-gray-500">Response time: 127ms</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
