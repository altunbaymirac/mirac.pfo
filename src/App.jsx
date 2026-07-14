import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import TerminalChatbot from './components/TerminalChatbot'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Projects from './pages/Projects'
import Analytics from './pages/Analytics'
import Contact from './pages/Contact'
import ConcreteWebDemo from './pages/ConcreteWebDemo'
import DCESOFCDemo from './pages/DCESOFCDemo'
import GeoSocialDemo from './pages/GeoSocialDemo'
import MiniGames from './pages/MiniGames'
import TakaslaPreview from './pages/TakaslaPreview'
import CV from './pages/CV'
import MatrixRain from './components/MatrixRain'

function App() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const isConcreteWebPresentation =
    (location.pathname === '/demos/concreteweb' || location.pathname === '/demos/flare') &&
    (searchParams.get('presentation') === '1' || searchParams.get('mode') === 'presentation')

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
    <ErrorBoundary>
      <div className="relative min-h-screen bg-terminal-bg">
        {!isConcreteWebPresentation && <MatrixRain />}
        {!isConcreteWebPresentation && <Navigation />}
        {!isConcreteWebPresentation && <TerminalChatbot />}
        
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
            <Route path="/demos/concreteweb" element={<ConcreteWebDemo />} />
            <Route path="/demos/flare" element={<Navigate to={`/demos/concreteweb${location.search}`} replace />} />
            <Route path="/demos/dce-sofc" element={<DCESOFCDemo />} />
            <Route path="/demos/geosocial" element={<GeoSocialDemo />} />
            <Route path="/demos/takasla" element={<TakaslaPreview />} />
            <Route path="/games" element={<MiniGames />} />
            <Route path="/cv" element={<CV />} />
          </Routes>
        </motion.div>
      </div>
    </ErrorBoundary>
  )
}

export default App
