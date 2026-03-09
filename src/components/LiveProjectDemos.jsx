import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Minimize2, ExternalLink, Code } from 'lucide-react'

const DEMOS = [
  {
    id: 'flare',
    title: 'FLARE Emergency System',
    description: 'LoRa-based disaster communication simulation',
    tech: ['React', 'Leaflet', 'LoRa Protocol'],
    url: '/demos/flare',
    color: 'terminal-accent',
    features: ['Interactive Map', 'Beacon Tracking', 'Mesh Network', 'How to Use Guide'],
    status: 'Live Demo'
  },
  {
    id: 'dce-sofc',
    title: 'DCE-SOFC Hybrid Propulsion',
    description: 'NH3-fueled marine digital twin with real thermodynamics',
    tech: ['React', 'Recharts', 'Thermodynamics'],
    url: '/demos/dce-sofc',
    color: 'terminal-secondary',
    features: ['Animated P&ID', 'Arrhenius Simulation', 'Live Charts', 'Formula Reference'],
    status: 'Live Demo'
  },
  {
    id: 'geosocial',
    title: 'GeoSocial Mobile App',
    description: 'Location-based social network with real-time GPS tracking',
    tech: ['React Native', 'Firebase', 'GPS'],
    url: '/demos/geosocial',
    color: 'terminal-text',
    features: ['Android Mockup', 'GPS Tracking', 'Check-in System', 'Social Feed'],
    status: 'Live Demo'
  }
]

export default function LiveProjectDemos() {
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMOS.map((demo) => {
          const colorClasses = {
            'terminal-accent': { border: 'border-terminal-accent', text: 'text-terminal-accent' },
            'terminal-secondary': { border: 'border-terminal-secondary', text: 'text-terminal-secondary' },
            'terminal-text': { border: 'border-terminal-text', text: 'text-terminal-text' }
          }
          const colors = colorClasses[demo.color]

          return (
            <Link key={demo.id} to={demo.url}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`bg-terminal-darker border-2 ${colors.border} p-6 cursor-pointer group`}
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

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 border ${colors.border} ${colors.text} text-xs font-mono`}>
                    {demo.status}
                  </span>
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
                  Click to launch full demo
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
