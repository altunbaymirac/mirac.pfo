import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, ArrowRight } from 'lucide-react'
import LiveProjectDemos from '../components/LiveProjectDemos'
import FlareBeacon3D from '../components/FlareBeacon3D'
import APIPlayground from '../components/APIPlayground'

const PROJECTS = [
  {
    title: 'FLARE',
    type: 'Emergency Communication',
    description: 'LoRa tabanlı afet sonrası enkaz altı sinyal ve mesh network simülasyonu.',
    tech: ['LoRa', 'React', 'Leaflet'],
    href: '/demos/flare',
    color: 'terminal-accent'
  },
  {
    title: 'DCE-SOFC',
    type: 'Marine Propulsion',
    description: 'Amonyak yakıtlı hibrit gemi tahrik sistemi için canlı dijital ikiz.',
    tech: ['Thermodynamics', 'Recharts', 'Simulation'],
    href: '/demos/dce-sofc',
    color: 'terminal-secondary'
  },
  {
    title: 'GeoSocial',
    type: 'Mobile App',
    description: 'Konum tabanlı sosyal ağ fikri için React Native tarzı interaktif demo.',
    tech: ['React Native', 'Firebase', 'GPS'],
    href: '/demos/geosocial',
    color: 'terminal-text'
  },
  {
    title: 'FedaGrup',
    type: 'Client Website',
    description: 'FedaGrup İnşaat için hazırlanmış canlı kurumsal web sitesi.',
    tech: ['Web Design', 'Responsive', 'Production'],
    href: 'https://www.fedagrupinsaat.com',
    external: true,
    color: 'terminal-accent'
  },
  {
    title: 'Takasla',
    type: 'Marketplace Preview',
    description: 'Öğrenciler için takas odaklı marketplace ürün önizlemesi.',
    tech: ['Product Design', 'Marketplace', 'React'],
    href: '/demos/takasla',
    color: 'terminal-secondary'
  }
]

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

        <section>
          <h2 className="text-2xl font-bold text-terminal-text neon-glow mb-6">
            Current Projects
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {PROJECTS.map((project, index) => {
              const colorClasses = {
                'terminal-accent': 'border-terminal-accent text-terminal-accent',
                'terminal-secondary': 'border-terminal-secondary text-terminal-secondary',
                'terminal-text': 'border-terminal-text text-terminal-text'
              }

              const card = (
                <motion.article
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className={`h-full bg-terminal-darker border-2 ${colorClasses[project.color]} p-5 group`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-terminal-text mb-1">
                        {project.title}
                      </h3>
                      <p className={`text-xs font-mono ${colorClasses[project.color].split(' ')[1]}`}>
                        {project.type}
                      </p>
                    </div>
                    {project.external ? (
                      <ExternalLink className="text-terminal-text group-hover:text-terminal-secondary transition-colors" size={22} />
                    ) : (
                      <ArrowRight className="text-terminal-text group-hover:text-terminal-secondary transition-colors" size={22} />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-terminal-bg border border-terminal-border text-xs text-gray-400 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.article>
              )

              return project.external ? (
                <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer">
                  {card}
                </a>
              ) : (
                <Link key={project.title} to={project.href}>
                  {card}
                </Link>
              )
            })}
          </div>
        </section>

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
