import { motion } from 'framer-motion'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

export default function Analytics() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
