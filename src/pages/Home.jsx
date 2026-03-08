import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal, Rocket, Code, Cpu, ArrowRight, Download } from 'lucide-react'
import FlareBeacon3D from '../components/FlareBeacon3D'

export default function Home() {
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
      description: '6 Şubat\'tan sonra aklıma gelen bir fikir: LoRa ile çalışan, enkaz altından sinyal yollayan bir cihaz',
      color: 'terminal-accent',
      link: '/projects',
      stats: ['868 MHz', '1-3 km Range', 'Auto-Activation']
    },
    {
      name: 'DCE-SOFC',
      tag: 'Marine Propulsion',
      description: 'Amonyak yakıtlı gemi motoru simülasyonu. Gerçek termodinamik hesaplamalarla çalışan bir dijital ikiz',
      color: 'terminal-secondary',
      link: '/projects',
      stats: ['Real Physics', 'Zero CO₂', 'Digital Twin']
    },
    {
      name: 'GeoSocial',
      tag: 'Mobile App',
      description: 'Konuma dayalı sosyal ağ. React Native ile yaptım, GPS tracking ve gamification var',
      color: 'terminal-text',
      link: '/blog/react-native-vs-flutter',
      stats: ['React Native', 'Firebase', 'GPS Tracking']
    }
  ]

  const skills = [
    { name: 'React / React Native', level: 70 },
    { name: 'Firebase / Backend', level: 60 },
    { name: 'Java / Python', level: 55 },
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
              Engineering Student
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Working on FLARE, an emergency communication system inspired by the 6 February earthquake. 
              Also building simulations and mobile apps. First-year at AGÜ, learning by doing.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-terminal-text border-2 border-terminal-text text-terminal-bg font-bold font-mono flex items-center space-x-2 hover:bg-transparent hover:text-terminal-text transition-all"
                >
                  <Rocket size={20} />
                  <span>PROJELERİ GÖR</span>
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-terminal-secondary text-terminal-secondary font-bold font-mono hover:bg-terminal-secondary hover:text-terminal-bg transition-all"
                >
                  İLETİŞİM
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
            {[
              { label: 'Projects', value: '3' },
              { label: 'Technologies', value: '10+' },
              { label: 'Lines of Code', value: '5k+' },
              { label: 'Coffee Consumed', value: '∞' }
            ].map((stat, i) => (
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
            Featured Projects
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`bg-terminal-darker border-2 border-${project.color} p-6 group cursor-pointer`}
              >
                <Link to={project.link}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-2xl font-bold text-${project.color} mb-1`}>
                        {project.name}
                      </h3>
                      <p className="text-xs font-mono text-gray-500">{project.tag}</p>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`text-${project.color}`}
                    >
                      <ArrowRight size={24} />
                    </motion.div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.stats.map((stat) => (
                      <span
                        key={stat}
                        className={`px-2 py-1 bg-terminal-bg border border-${project.color} text-xs font-mono text-gray-400`}
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* 3D Showcase */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-terminal-secondary mb-6 text-center">
              Interactive 3D Model
            </h3>
            <FlareBeacon3D />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 px-4 bg-terminal-darker">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-terminal-text neon-glow mb-12 text-center">
            Technical Skills
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
              Projeler Hakkında Konuşalım
            </h2>
            <p className="text-gray-400 mb-8">
              FLARE, DCE-SOFC veya başka bir proje hakkında sohbet etmek istersen yazabilirsin.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-terminal-text border-2 border-terminal-text text-terminal-bg font-bold font-mono hover:bg-transparent hover:text-terminal-text transition-all"
                >
                  İLETİŞİME GEÇ
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-terminal-accent text-terminal-accent font-bold font-mono hover:bg-terminal-accent hover:text-white transition-all flex items-center space-x-2"
              >
                <Download size={20} />
                <span>CV İNDİR</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
