import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Projects from './pages/Projects'
import Analytics from './pages/Analytics'
import Contact from './pages/Contact'
import MatrixRain from './components/MatrixRain'

function App() {
  // Google Analytics page view tracking
  useEffect(() => {
    // Google Analytics varsa sayfa görüntüleme kaydı
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: window.location.pathname,
      })
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-terminal-bg">
      <MatrixRain />
      <Navigation />
      <ChatWidget />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </motion.div>
    </div>
  )
}

export default App
