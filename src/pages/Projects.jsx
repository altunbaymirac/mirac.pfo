import { motion } from 'framer-motion'
import LiveProjectDemos from '../components/LiveProjectDemos'
import FlareBeacon3D from '../components/FlareBeacon3D'
import APIPlayground from '../components/APIPlayground'

export default function Projects() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-terminal-text neon-glow mb-3">
            💼 Projects
          </h1>
          <p className="text-gray-400">
            Live demos, 3D visualizations, and interactive APIs
          </p>
        </motion.div>

        {/* 3D Beacon Showcase */}
        <section>
          <h2 className="text-2xl font-bold text-terminal-secondary mb-6">
            3D Interactive Model
          </h2>
          <FlareBeacon3D />
        </section>

        {/* Live Demos */}
        <section>
          <LiveProjectDemos />
        </section>

        {/* API Playground */}
        <section>
          <APIPlayground />
        </section>
      </div>
    </div>
  )
}
