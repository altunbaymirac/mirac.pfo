import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, Briefcase, BarChart3, Mail, Github, Linkedin, Instagram } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'home' },
    { path: '/blog', icon: BookOpen, label: 'blog' },
    { path: '/projects', icon: Briefcase, label: 'projects' },
    { path: '/analytics', icon: BarChart3, label: 'analytics' },
    { path: '/contact', icon: Mail, label: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-terminal-darker/80 backdrop-blur-sm border-b-2 border-terminal-text"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-bold text-xl neon-glow"
            >
              <span className="text-terminal-text">mirac@</span>
              <span className="text-terminal-secondary">portfolio</span>
              <span className="text-terminal-text">:~$</span>
              <span className="terminal-cursor">_</span>
            </motion.div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 border-2 transition-all ${
                      isActive
                        ? 'border-terminal-text bg-terminal-text/10 text-terminal-text'
                        : 'border-terminal-border text-gray-500 hover:border-terminal-secondary hover:text-terminal-secondary'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-mono">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3">
            <motion.a
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 300 }}
              href="https://github.com/altunbaymirac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-text hover:text-terminal-secondary"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: -360 }}
              transition={{ type: 'spring', stiffness: 300 }}
              href="https://www.linkedin.com/in/miraç-altunbay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-text hover:text-terminal-secondary"
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 300 }}
              href="https://www.instagram.com/altunbay.mirac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-text hover:text-terminal-accent"
            >
              <Instagram size={20} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
