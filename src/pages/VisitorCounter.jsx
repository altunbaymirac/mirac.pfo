import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

export default function VisitorCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      // Get current count
      let visitors = parseInt(localStorage.getItem('visitor_count') || '0')
      
      // Increment
      visitors += 1
      
      // Save
      localStorage.setItem('visitor_count', visitors.toString())
      
      // Display
      setCount(visitors)
    } catch (error) {
      // Fallback if localStorage fails
      setCount(1)
    }
  }, [])

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-terminal-text neon-glow mb-4">
            📊 Visitor Counter
          </h1>
          <p className="text-gray-400 mb-12">
            Simple visitor tracking using browser storage
          </p>

          {/* Big Counter */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-terminal-darker border-4 border-terminal-text p-12 mb-8"
          >
            <Users size={48} className="text-terminal-text mx-auto mb-6" />
            <div className="text-8xl md:text-9xl font-bold text-terminal-text neon-glow mb-4">
              {count.toLocaleString()}
            </div>
            <p className="text-xl text-gray-400 font-mono">
              Total Visitors
            </p>
          </motion.div>

          {/* Info */}
          <div className="bg-terminal-bg border-2 border-terminal-border p-6 text-left">
            <h3 className="text-lg font-bold text-terminal-secondary mb-3">
              📝 How it works:
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Counter stored in your browser (localStorage)</li>
              <li>✓ Increments every time you visit</li>
              <li>✓ Resets if you clear browser data</li>
              <li>✓ No analytics tracking, no cookies</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
