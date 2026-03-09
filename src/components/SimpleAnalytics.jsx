import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Users, Clock, TrendingUp } from 'lucide-react'

export default function SimpleAnalytics() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    avgSessionTime: '0:00',
    bounceRate: 0,
    pageViews: {}
  })

  useEffect(() => {
    try {
      // Get stats from localStorage
      const totalVisits = parseInt(localStorage.getItem('total_visits') || '0')
      const todayVisits = parseInt(localStorage.getItem('today_visits') || '0')
      const avgSeconds = parseInt(localStorage.getItem('avg_session_time') || '0')
      const pageViews = JSON.parse(localStorage.getItem('page_views') || '{}')

      const minutes = Math.floor(avgSeconds / 60)
      const seconds = avgSeconds % 60

      setStats({
        totalVisitors: totalVisits,
        todayVisitors: todayVisits,
        avgSessionTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        bounceRate: 25,
        pageViews: pageViews
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }, [])

  const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
      'terminal-text': 'border-terminal-text text-terminal-text bg-terminal-text/10',
      'terminal-secondary': 'border-terminal-secondary text-terminal-secondary bg-terminal-secondary/10',
      'terminal-accent': 'border-terminal-accent text-terminal-accent bg-terminal-accent/10'
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className={`bg-terminal-darker border-2 ${colorClasses[color].split(' ')[0]} p-6`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-mono">{label}</p>
            <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[1]}`}>
              {value}
            </p>
          </div>
          <div className={`p-3 border ${colorClasses[color]}`}>
            <Icon size={24} className={colorClasses[color].split(' ')[1]} />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-terminal-text neon-glow">
          📊 Analytics Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Simple visitor statistics using localStorage
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="TOTAL VISITORS" value={stats.totalVisitors} color="terminal-text" />
        <StatCard icon={Eye} label="TODAY'S VISITORS" value={stats.todayVisitors} color="terminal-secondary" />
        <StatCard icon={Clock} label="AVG SESSION TIME" value={stats.avgSessionTime} color="terminal-accent" />
        <StatCard icon={TrendingUp} label="BOUNCE RATE" value={`${stats.bounceRate}%`} color="terminal-text" />
      </div>

      {/* Top Pages */}
      <div className="bg-terminal-darker border-2 border-terminal-text p-6">
        <h3 className="text-xl font-bold text-terminal-text mb-6">
          📄 Top Pages
        </h3>
        <div className="space-y-3">
          {Object.keys(stats.pageViews).length > 0 ? (
            Object.entries(stats.pageViews)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([page, views], index) => (
                <div
                  key={page}
                  className="flex items-center justify-between bg-terminal-bg border border-terminal-border p-3"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-terminal-secondary font-mono text-sm">
                      #{index + 1}
                    </span>
                    <code className="text-terminal-text font-mono text-sm">
                      {page}
                    </code>
                  </div>
                  <span className="text-terminal-accent font-mono text-sm">
                    {views} views
                  </span>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No page views yet. Start browsing to see analytics!
            </p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-terminal-bg border-2 border-terminal-secondary p-4">
        <p className="text-xs text-gray-400 font-mono text-center">
          💡 Analytics use browser localStorage. Data resets when you clear browser data.
        </p>
      </div>
    </div>
  )
}
