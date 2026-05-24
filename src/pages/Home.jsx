import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal, Rocket, Code, Cpu, ArrowRight, Download } from 'lucide-react'
import FlareBeacon3D from '../components/FlareBeacon3D'
import LiveProjectDemos from '../components/LiveProjectDemos'
import { useLanguage } from '../contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const [terminalText, setTerminalText] = useState('')
  const fullText = 'mirac@portfolio:~$ ./deploy_future.sh'

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTerminalText(fullText.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const projects = [
    {
      name: 'FLARE',
      tag: 'Emergency Communication',
      description: '6 Åubat\'tan sonra aklÄ±ma gelen bir fikir: LoRa ile Ã§alÄ±ÅŸan, enkaz altÄ±ndan sinyal yollayan bir cihaz',
      color: 'terminal-accent',
      link: '/demos/flare',
      stats: ['868 MHz', '1-3 km Range', 'Auto-Activation']
    },
    {
      name: 'DCE-SOFC',
      tag: 'Marine Propulsion',
      description: 'Amonyak yakÄ±tlÄ± gemi motoru simÃ¼lasyonu. GerÃ§ek termodinamik hesaplamalarla Ã§alÄ±ÅŸan bir dijital ikiz',
      color: 'terminal-secondary',
      link: '/demos/dce-sofc',
      stats: ['Arrhenius Kinetics', 'Zero COâ‚‚', 'Digital Twin']
    },
    {
      name: 'Takaslat',
      tag: 'Marketplace Platform',
      description: 'Para kullanmadan eÅŸya takasÄ± yapabileceÄŸin, AI destekli Ã¶neri ve mÃ¼zakere sistemi olan marketplace',
      color: 'terminal-text',
      link: 'https://takaslat.vercel.app',
      external: true,
      stats: ['React + TS', 'Node.js', 'AI Assistant']
    },
    {
      name: 'FedaGrup',
      tag: 'Client Website',
      description: 'FedaGrup Ä°nÅŸaat iÃ§in hazÄ±rladÄ±ÄŸÄ±m kurumsal web sitesi. Mobil uyumlu, hÄ±zlÄ±, gÃ¼ven veren tasarÄ±m',
      color: 'terminal-accent',
      link: 'https://www.fedagrupinsaat.com',
      external: true,
      stats: ['Production', 'Responsive', 'Client Project']
    },
    {
      name: 'GeoSocial',
      tag: 'Mobile App',
      description: 'Konuma dayalÄ± sosyal aÄŸ. React Native ile yaptÄ±m, GPS tracking ve gamification var',
      color: 'terminal-secondary',
      link: '/demos/geosocial',
      stats: ['React Native', 'Firebase', 'GPS Tracking']
    }
  ]

  const timeline = [
    {
      date: 'Eyl 2024',
      title: 'AGÃœ Makine MÃ¼hendisliÄŸi',
      desc: 'Abdullah GÃ¼l Ãœniversitesi\'nde Makine MÃ¼hendisliÄŸi\'ne baÅŸladÄ±m. MÃ¼hendislik dÃ¼ÅŸÃ¼ncesiyle tanÄ±ÅŸtÄ±m.',
      tag: 'ğŸ“ EÄŸitim',
      active: true
    },
    {
      date: 'Åub 2025',
      title: 'FLARE â€” Ä°lk Prototip',
      desc: '6 Åubat depreminden ilham aldÄ±m. LoRa 868 MHz ile enkaz altÄ± beacon simÃ¼lasyonu geliÅŸtirdim.',
      tag: 'ğŸ“¡ LoRa / IoT',
      active: true
    },
    {
      date: 'Mar 2025',
      title: 'DCE-SOFC Dijital Ä°kiz',
      desc: 'Amonyak yakÄ±tlÄ± hibrit gemi tahrik sistemi iÃ§in Arrhenius kinetikleriyle Ã§alÄ±ÅŸan dijital ikiz simÃ¼lasyonu.',
      tag: 'âš—ï¸ Termodinamik',
      active: true
    },
    {
      date: 'Nis 2025',
      title: 'FedaGrup Ä°nÅŸaat Web Sitesi',
      desc: 'Ä°lk mÃ¼ÅŸteri projem. Mobil uyumlu, hÄ±zlÄ± kurumsal web sitesi â€” production\'da yayÄ±nda.',
      tag: 'ğŸŒ Client Project',
      active: true
    },
    {
      date: 'May 2025',
      title: 'Takaslat Marketplace',
      desc: 'React + TypeScript ile AI destekli takas marketplace. MÃ¼zakere sistemi ve harita entegrasyonu.',
      tag: 'ğŸ›’ Full-Stack',
      active: true
    },
    {
      date: '2025 â†’',
      title: 'FLARE DonanÄ±m Prototipi',
      desc: 'ESP32 + LoRa modÃ¼lÃ¼ ile fiziksel prototip. AGÃœ kampÃ¼sÃ¼nde menzil testi planlanÄ±yor.',
      tag: 'ğŸ”© Sonraki AdÄ±m',
      active: false
    }
  ]

  const skills = [
    { name: 'React / TypeScript', level: 75 },
    { name: 'Node.js / Express', level: 65 },
    { name: 'Firebase / Backend', level: 60 },
    { name: 'Python / Java', level: 55 },
    { name: 'Tailwind / UI Design', level: 70 },
    { name: 'LoRa / IoT (Learning)', level: 40 }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Terminal Header */}
            <div className="inline-block bg-terminal-darker border-2 border-terminal-text p-4 mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <p className="font-mono text-terminal-text text-left">
                {terminalText}<span className="terminal-cursor">_</span>
              </p>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-terminal-text neon-glow mb-6">
              MIRAC ALTUNBAY
            </h1>
            <p className="text-xl md:text-2xl text-terminal-secondary mb-4">
              {t.home.subtitle}
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              {t.home.bio}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/projects" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 bg-terminal-text border-2 border-terminal-text text-terminal-bg font-bold font-mono flex items-center justify-center space-x-2 hover:bg-transparent hover:text-terminal-text transition-all"
                >
                  <Rocket size={20} />
                  <span className="text-sm md:text-base">{t.home.btnProjects}</span>
                </motion.button>
              </Link>

              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 border-2 border-terminal-secondary text-terminal-secondary font-bold font-mono hover:bg-terminal-secondary hover:text-terminal-bg transition-all text-sm md:text-base"
                >
                  {t.home.btnContact}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {t.home.stats.map((stat, i) => (
              <div key={i} className="bg-terminal-darker border border-terminal-border p-4 text-center">
                <div className="text-3xl font-bold text-terminal-text">{stat.value}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-terminal-text neon-glow mb-12 text-center">
            {t.home.featuredTitle}
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {projects.map((project, index) => {
              const colorClasses = {
                'terminal-accent': { border: 'border-terminal-accent', text: 'text-terminal-accent' },
                'terminal-secondary': { border: 'border-terminal-secondary', text: 'text-terminal-secondary' },
                'terminal-text': { border: 'border-terminal-text', text: 'text-terminal-text' }
              }
              const colors = colorClasses[project.color]
              const card = (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={`bg-terminal-darker border-2 ${colors.border} p-6 group cursor-pointer h-full`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-2xl font-bold ${colors.text} mb-1`}>{project.name}</h3>
                      <p className="text-xs font-mono text-gray-500">{project.tag}</p>
                    </div>
                    <motion.div whileHover={{ x: 5 }} className={colors.text}>
                      <ArrowRight size={24} />
                    </motion.div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stats.map((stat) => (
                      <span key={stat} className={`px-2 py-1 bg-terminal-bg ${colors.border} border text-xs font-mono text-gray-400`}>
                        {stat}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )

              return project.external ? (
                <a key={project.name} href={project.link} target="_blank" rel="noopener noreferrer">{card}</a>
              ) : (
                <Link key={project.name} to={project.link}>{card}</Link>
              )
            })}
          </div>

          {/* 3D Showcase */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-terminal-secondary mb-6 text-center">
              Interactive 3D Model
            </h3>
            <FlareBeacon3D />
          </div>

          {/* Live Simulations */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-terminal-text neon-glow mb-6 text-center">
              ğŸš€ Live Project Simulations
            </h3>
            <p className="text-gray-400 text-center mb-8">
              FLARE beacon tracker ve DCE-SOFC motor simÃ¼lasyonlarÄ± - gerÃ§ek zamanlÄ± Ã§alÄ±ÅŸÄ±yor!
            </p>
            <LiveProjectDemos />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-terminal-text neon-glow mb-12 text-center">
            {t.home.timelineTitle}
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-terminal-border" />
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-16 pb-10"
              >
                <div className={`absolute left-4 w-5 h-5 border-2 rotate-45 ${item.active ? 'bg-terminal-text border-terminal-text' : 'bg-terminal-bg border-terminal-border'}`} />
                <div className="bg-terminal-darker border border-terminal-border p-4">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <h3 className="text-terminal-text font-bold font-mono">{item.title}</h3>
                    <span className={`text-xs font-mono px-2 py-1 border ${item.active ? 'text-terminal-accent border-terminal-accent' : 'text-gray-500 border-terminal-border'}`}>
                      {item.date}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                  {item.tag && (
                    <span className="inline-block mt-2 text-xs font-mono text-terminal-secondary border border-terminal-secondary px-2 py-0.5">
                      {item.tag}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 px-4 bg-terminal-darker">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-terminal-text neon-glow mb-12 text-center">
            {t.home.skillsTitle}
          </h2>

          <div className="space-y-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-terminal-text font-mono">{skill.name}</span>
                  <span className="text-terminal-secondary font-mono text-sm">{skill.level}%</span>
                </div>
                <div className="h-3 bg-terminal-bg border-2 border-terminal-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-terminal-text"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-terminal-darker border-2 border-terminal-text p-12"
          >
            <Terminal size={48} className="text-terminal-text mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-terminal-text neon-glow mb-4">
              {t.home.ctaTitle}
            </h2>
            <p className="text-gray-400 mb-8">
              {t.home.ctaDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-terminal-text border-2 border-terminal-text text-terminal-bg font-bold font-mono hover:bg-transparent hover:text-terminal-text transition-all"
                >
                  {t.home.ctaBtn}
                </motion.button>
              </Link>
              <Link to="/cv">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-terminal-accent text-terminal-accent font-bold font-mono hover:bg-terminal-accent hover:text-white transition-all flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>{t.home.cvBtn}</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
