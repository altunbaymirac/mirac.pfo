import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { useVisitorCounter } from '../utils/firebase'
import { useLanguage } from '../contexts/LanguageContext'

export default function VisitorCounter({ embedded = false }) {
  const { count, loading } = useVisitorCounter()
  const { lang } = useLanguage()
  const copy = lang === 'en'
    ? { title: 'Visitor Analytics', subtitle: 'Live visitor count', loading: 'Loading...', total: 'Total Visitors' }
    : { title: 'Ziyaretçi Analitiği', subtitle: 'Canlı ziyaretçi sayısı', loading: 'Yükleniyor...', total: 'Toplam Ziyaretçi' }

  return (
    <section id="analytics" className={embedded ? 'py-20 px-4' : 'min-h-screen pt-24 px-4 pb-12'}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-terminal-text neon-glow mb-4">
            <Users className="inline-block mr-3 align-[-6px]" size={38} />
            {copy.title}
          </h1>
          <p className="text-gray-400 mb-12">
            {copy.subtitle}
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
                {copy.loading}
              </div>
            ) : (
              <div className="text-6xl md:text-9xl font-bold text-terminal-text neon-glow mb-4">
                {count.toLocaleString()}
              </div>
            )}
            
            <p className="text-xl md:text-2xl text-gray-400 font-mono">
              {copy.total}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
