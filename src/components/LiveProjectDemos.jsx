import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Minimize2, ExternalLink, Code } from 'lucide-react'
import FLAREAdvancedSimulator from './FLAREAdvancedSimulator'
import DCESOFCAdvancedSimulator from './DCESOFCAdvancedSimulator'

const DEMOS = [
  {
    id: 'flare',
    title: 'FLARE Emergency System',
    description: 'LoRa-based disaster communication simulation',
    tech: ['React', 'Leaflet', 'LoRa Protocol'],
    url: 'https://github.com/altunbaymirac/flare-simulation', // GitHub repo
    color: 'terminal-accent',
    features: ['Beacon Simulator', 'Station Tracking', 'RSSI Mapping'],
    status: 'Demo Coming Soon'
  },
  {
    id: 'dce-sofc',
    title: 'DCE-SOFC Hybrid Propulsion',
    description: 'NH3-fueled marine digital twin with real thermodynamics',
    tech: ['React', 'Recharts', 'Thermodynamics'],
    url: 'https://github.com/altunbaymirac/dce-sofc-simulation',
    color: 'terminal-secondary',
    features: ['Arrhenius Simulation', 'P&ID Diagram', 'Live Metrics'],
    status: 'Demo Coming Soon'
  }
]

export default function LiveProjectDemos() {
  const [activeDemo, setActiveDemo] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-terminal-text neon-glow">
            🎮 Live Project Demos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Interactive simulations running in real-time
          </p>
        </div>
      </div>

      {/* Demo Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {DEMOS.map((demo) => {
          const colorClasses = {
            'terminal-accent': { border: 'border-terminal-accent', text: 'text-terminal-accent' },
            'terminal-secondary': { border: 'border-terminal-secondary', text: 'text-terminal-secondary' }
          }
          const colors = colorClasses[demo.color]

          return (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className={`bg-terminal-darker border-2 ${colors.border} p-6 cursor-pointer group`}
              onClick={() => setActiveDemo(demo)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                    {demo.title}
                  </h3>
                  <p className="text-sm text-gray-400">{demo.description}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  className="text-terminal-text"
                >
                  <ExternalLink size={20} />
                </motion.div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {demo.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-terminal-bg border border-terminal-border text-xs font-mono text-gray-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-1">
                {demo.features.map((feature) => (
                  <div key={feature} className="flex items-center text-xs text-gray-500">
                    <span className="text-terminal-text mr-2">→</span>
                    {feature}
                  </div>
                ))}
              </div>

              {/* Hover effect */}
              <div className="mt-4 flex items-center text-sm text-terminal-text opacity-0 group-hover:opacity-100 transition-opacity">
                <Code size={16} className="mr-2" />
                Click to launch demo
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Fullscreen Demo Modal */}
      <AnimatePresence>
        {activeDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveDemo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-7xl h-[90vh] bg-terminal-bg border-4 ${
                activeDemo.color === 'terminal-accent' ? 'border-terminal-accent' :
                activeDemo.color === 'terminal-secondary' ? 'border-terminal-secondary' :
                'border-terminal-text'
              } relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-terminal-darker p-4 border-b-2 border-terminal-text flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${
                    activeDemo.color === 'terminal-accent' ? 'text-terminal-accent' :
                    activeDemo.color === 'terminal-secondary' ? 'text-terminal-secondary' :
                    'text-terminal-text'
                  } neon-glow`}>
                    {activeDemo.title}
                  </h3>
                  <p className="text-xs text-gray-500">{activeDemo.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 border-2 border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg transition-colors"
                  >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveDemo(null)}
                    className="px-4 py-2 border-2 border-terminal-accent bg-terminal-accent text-white font-mono text-sm"
                  >
                    CLOSE
                  </motion.button>
                </div>
              </div>

              {/* Demo Content */}
              <div className="h-[calc(100%-80px)] bg-terminal-darker overflow-auto">
                {activeDemo.id === 'flare' && <FLAREAdvancedSimulator />}
                {activeDemo.id === 'dce-sofc' && <DCESOFCAdvancedSimulator />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
