import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, Briefcase, BarChart3, Mail, Github, Linkedin, Instagram, Menu, X, Gamepad2 } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'home' },
    { path: '/blog', icon: BookOpen, label: 'blog' },
    { path: '/projects', icon: Briefcase, label: 'projects' },
    { path: '/games', icon: Gamepad2, label: 'games' },
    { path: '/analytics', icon: BarChart3, label: 'analytics' },
    { path: '/contact', icon: Mail, label: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-terminal-darker/95 backdrop-blur-sm border-b-2 border-terminal-text"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-bold text-lg md:text-xl neon-glow"
            >
              <span className="text-terminal-text">mirac@</span>
              <span className="text-terminal-secondary">portfolio</span>
              <span className="text-terminal-text hidden sm:inline">:~$</span>
              <span className="terminal-cursor hidden sm:inline">_</span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
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
                        ? 'bg-terminal-text text-terminal-bg border-terminal-text'
                        : 'border-terminal-border text-terminal-text hover:border-terminal-text'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-mono">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Desktop Social */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://github.com/altunbaymirac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-text hover:text-terminal-secondary"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://www.linkedin.com/in/miraç-altunbay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-text hover:text-terminal-secondary"
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://www.instagram.com/altunbay.mirac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-text hover:text-terminal-accent"
            >
              <Instagram size={20} />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-terminal-text border-2 border-terminal-text"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-terminal-darker border-t-2 border-terminal-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 border-2 ${
                        isActive
                          ? 'bg-terminal-text text-terminal-bg border-terminal-text'
                          : 'border-terminal-border text-terminal-text'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-mono">{item.label}</span>
                    </div>
                  </Link>
                )
              })}

              {/* Mobile Social */}
              <div className="flex items-center justify-center space-x-6 pt-4 border-t-2 border-terminal-border">
                <a
                  href="https://github.com/altunbaymirac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-text"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/miraç-altunbay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-text"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="https://www.instagram.com/altunbay.mirac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-text"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
