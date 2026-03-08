import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Eye, Users, Clock, TrendingUp, Globe, FileText } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalVisitors: 1247,
    todayVisitors: 43,
    avgSessionTime: '3:24',
    bounceRate: 32.5,
    mostViewedPage: '/projects/flare',
    pageViews: {
      '/': 423,
      '/projects': 387,
      '/blog': 212,
      '/projects/flare': 156,
      '/contact': 69
    },
    geographic: {
      'Turkey': 542,
      'USA': 284,
      'Germany': 156,
      'UK': 98,
      'Others': 167
    },
    timeSeriesVisitors: [],
    devices: {
      'Desktop': 65,
      'Mobile': 28,
      'Tablet': 7
    }
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayVisitors: prev.todayVisitors + Math.floor(Math.random() * 3),
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 2)
      }))
    }, 5000)

    // Generate time series data
    const now = new Date()
    const timeData = []
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      timeData.push({
        time: hour.getHours() + ':00',
        visitors: Math.floor(Math.random() * 50) + 20
      })
    }
    setStats(prev => ({ ...prev, timeSeriesVisitors: timeData }))

    return () => clearInterval(interval)
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#00ff41', font: { family: 'monospace' } }
      }
    },
    scales: {
      x: {
        ticks: { color: '#666', font: { family: 'monospace', size: 10 } },
        grid: { color: '#1a1d35' }
      },
      y: {
        ticks: { color: '#666', font: { family: 'monospace', size: 10 } },
        grid: { color: '#1a1d35' }
      }
    }
  }

  const visitorChartData = {
    labels: stats.timeSeriesVisitors.map(d => d.time),
    datasets: [
      {
        label: 'Visitors',
        data: stats.timeSeriesVisitors.map(d => d.visitors),
        borderColor: '#00ff41',
        backgroundColor: 'rgba(0, 255, 65, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const geographicChartData = {
    labels: Object.keys(stats.geographic),
    datasets: [
      {
        data: Object.values(stats.geographic),
        backgroundColor: [
          '#00ff41',
          '#00d9ff',
          '#ff6b35',
          '#fbbf24',
          '#8b5cf6',
        ],
        borderWidth: 0,
      },
    ],
  }

  const deviceChartData = {
    labels: Object.keys(stats.devices).map(k => `${k} (${stats.devices[k]}%)`),
    datasets: [
      {
        data: Object.values(stats.devices),
        backgroundColor: ['#00ff41', '#00d9ff', '#ff6b35'],
        borderWidth: 0,
      },
    ],
  }

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-terminal-darker border-2 border-${color} p-6`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1 font-mono">{label}</p>
          <p className={`text-3xl font-bold text-${color} neon-glow-${color === 'terminal-text' ? '' : 'cyan'}`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp size={12} className="mr-1 text-green-500" />
              <span className="text-green-500 font-mono">+{trend}%</span>
              <span className="text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}/10 border border-${color}`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-terminal-text neon-glow">
          📊 Real-Time Analytics
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Live visitor statistics and engagement metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="TOTAL VISITORS"
          value={stats.totalVisitors.toLocaleString()}
          trend={12.5}
          color="terminal-text"
        />
        <StatCard
          icon={Eye}
          label="TODAY'S VISITORS"
          value={stats.todayVisitors}
          trend={8.3}
          color="terminal-secondary"
        />
        <StatCard
          icon={Clock}
          label="AVG SESSION TIME"
          value={stats.avgSessionTime}
          color="terminal-accent"
        />
        <StatCard
          icon={TrendingUp}
          label="BOUNCE RATE"
          value={`${stats.bounceRate}%`}
          color="terminal-text"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Visitor Trend */}
        <div className="bg-terminal-darker border-2 border-terminal-text p-6">
          <h3 className="text-sm font-bold text-terminal-text mb-4 flex items-center">
            <TrendingUp size={16} className="mr-2" />
            24-HOUR VISITOR TREND
          </h3>
          <div className="h-64">
            <Line data={visitorChartData} options={chartOptions} />
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-terminal-darker border-2 border-terminal-secondary p-6">
          <h3 className="text-sm font-bold text-terminal-secondary mb-4 flex items-center">
            <Globe size={16} className="mr-2" />
            GEOGRAPHIC DISTRIBUTION
          </h3>
          <div className="h-64">
            <Doughnut 
              data={geographicChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { 
                      color: '#00ff41', 
                      font: { family: 'monospace', size: 11 },
                      padding: 10
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-terminal-darker border-2 border-terminal-accent p-6">
          <h3 className="text-sm font-bold text-terminal-accent mb-4 flex items-center">
            <Eye size={16} className="mr-2" />
            DEVICE BREAKDOWN
          </h3>
          <div className="h-64">
            <Doughnut 
              data={deviceChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { 
                      color: '#00ff41', 
                      font: { family: 'monospace', size: 11 },
                      padding: 15
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-terminal-darker border-2 border-terminal-text p-6">
          <h3 className="text-sm font-bold text-terminal-text mb-4 flex items-center">
            <FileText size={16} className="mr-2" />
            TOP PAGES
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.pageViews)
              .sort(([, a], [, b]) => b - a)
              .map(([page, views], index) => (
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-terminal-secondary font-mono text-xs">
                      #{index + 1}
                    </span>
                    <code className="text-terminal-text font-mono text-sm">
                      {page}
                    </code>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-terminal-bg h-2 border border-terminal-border">
                      <div
                        className="h-full bg-terminal-text"
                        style={{ 
                          width: `${(views / Math.max(...Object.values(stats.pageViews))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-terminal-accent font-mono text-sm w-12 text-right">
                      {views}
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-terminal-darker border-2 border-terminal-text p-6">
        <h3 className="text-sm font-bold text-terminal-text mb-4">
          🔴 LIVE ACTIVITY FEED
        </h3>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center text-gray-400">
            <span className="text-terminal-text mr-2">→</span>
            <span className="text-terminal-secondary">[{new Date().toLocaleTimeString()}]</span>
            <span className="ml-2">Visitor from <span className="text-terminal-text">Turkey</span> viewed <span className="text-terminal-accent">/projects/flare</span></span>
          </div>
          <div className="flex items-center text-gray-400">
            <span className="text-terminal-text mr-2">→</span>
            <span className="text-terminal-secondary">[{new Date(Date.now() - 30000).toLocaleTimeString()}]</span>
            <span className="ml-2">New visitor from <span className="text-terminal-text">USA</span> landed on <span className="text-terminal-accent">/</span></span>
          </div>
          <div className="flex items-center text-gray-400">
            <span className="text-terminal-text mr-2">→</span>
            <span className="text-terminal-secondary">[{new Date(Date.now() - 60000).toLocaleTimeString()}]</span>
            <span className="ml-2">Visitor from <span className="text-terminal-text">Germany</span> downloaded CV</span>
          </div>
        </div>
      </div>
    </div>
  )
}
