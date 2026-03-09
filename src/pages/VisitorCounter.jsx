import { motion } from 'framer-motion'
import { Users, Database, Wifi } from 'lucide-react'
import { useVisitorCounter } from '../utils/firebase'

export default function VisitorCounter() {
  const { count, loading } = useVisitorCounter()

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-terminal-text neon-glow mb-4">
            📊 Visitor Analytics
          </h1>
          <p className="text-gray-400 mb-12">
            Real-time visitor tracking powered by Firebase Realtime Database
          </p>

          {/* Big Counter */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-terminal-darker border-4 border-terminal-text p-8 md:p-12 mb-8"
          >
            <Users size={48} className="text-terminal-text mx-auto mb-6" />
            
            {loading ? (
              <div className="text-4xl md:text-6xl font-bold text-terminal-text neon-glow mb-4 animate-pulse">
                Loading...
              </div>
            ) : (
              <div className="text-6xl md:text-9xl font-bold text-terminal-text neon-glow mb-4">
                {count.toLocaleString()}
              </div>
            )}
            
            <p className="text-xl md:text-2xl text-gray-400 font-mono">
              Total Visitors
            </p>
          </motion.div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-terminal-bg border-2 border-terminal-secondary p-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-terminal-secondary" size={24} />
                <h3 className="text-lg font-bold text-terminal-secondary">
                  Firebase Realtime DB
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Real-time synchronization</li>
                <li>✓ Persistent storage (never resets)</li>
                <li>✓ Cross-device tracking</li>
                <li>✓ Instant updates globally</li>
              </ul>
            </div>

            <div className="bg-terminal-bg border-2 border-terminal-accent p-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="text-terminal-accent" size={24} />
                <h3 className="text-lg font-bold text-terminal-accent">
                  How It Works
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>→ Every visit increments Firebase counter</li>
                <li>→ Data syncs in real-time</li>
                <li>→ Fallback to localStorage if Firebase unavailable</li>
                <li>→ Privacy-friendly (no personal data stored)</li>
              </ul>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-terminal-darker border-2 border-terminal-border p-6 text-left">
            <h3 className="text-lg font-bold text-terminal-text mb-4">
              🔧 Firebase Setup Instructions
            </h3>
            <div className="space-y-3 text-sm text-gray-400 font-mono">
              <p>1. Create Firebase project at <span className="text-terminal-accent">console.firebase.google.com</span></p>
              <p>2. Enable <span className="text-terminal-secondary">Realtime Database</span></p>
              <p>3. Copy config to <code className="bg-terminal-bg px-2 py-1 text-terminal-accent">src/utils/firebase.js</code></p>
              <p>4. Deploy → Visitor counter works globally!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
