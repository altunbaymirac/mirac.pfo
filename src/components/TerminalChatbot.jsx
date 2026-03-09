import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Terminal, Zap } from 'lucide-react'

const RESPONSES = {
  greetings: [
    "Merhaba! Ben Mirac'ın portfolio asistanıyım. Size nasıl yardımcı olabilirim?",
    "Hey! Mirac hakkında merak ettiğin bir şey var mı?",
    "Selam! Projeler, eğitim veya iletişim hakkında soru sorabilirsin."
  ],
  
  projects: {
    flare: "🔥 FLARE: LoRa tabanlı acil durum iletişim sistemi. 6 Şubat depreminden ilham aldı. Mesh network, GPS tracking ve beacon sistemli. /demos/flare'de canlı demo var!",
    dce: "⚡ DCE-SOFC: Amonyak yakıtlı hibrid deniz taşıtı. Sıfır CO₂ emisyonu! Arrhenius kimyası ve yakıt hücresi teknolojisi. /demos/dce-sofc'de simülasyon var!",
    geosocial: "📱 GeoSocial: Lokasyon tabanlı sosyal network. React Native + Firebase. GPS tracking ve check-in sistemi. /demos/geosocial'da mockup var!",
    all: "Mirac 3 büyük proje üzerinde çalışıyor:\n\n1. FLARE - Acil durum LoRa sistemi\n2. DCE-SOFC - Amonyak hibrid motor\n3. GeoSocial - Lokasyon sosyal app\n\nHangisi hakkında detay istersin?"
  },
  
  education: "🎓 Mirac, Abdullah Gül Üniversitesi (AGÜ) Makine Mühendisliği 1. sınıf öğrencisi. Kayseri'de okuyor.",
  
  skills: "💻 Beceriler:\n• React, React Native, Firebase\n• Java, JavaScript, Full-stack\n• LoRa, GPS, Mesh Networks\n• Termodinamik, Arrhenius kimyası\n• Mobile app geliştirme",
  
  contact: "📧 İletişim:\n• Email: mirac.altunbay@agu.edu.tr\n• GitHub: github.com/altunbaymirac\n• LinkedIn: Miraç Altunbay\n• Instagram: @altunbay.mirac\n\n/contact sayfasından form da doldurabilirsin!",
  
  games: "🎮 Portfolio'da 2 retro oyun var! Snake ve Pong. /games sayfasından oynayabilirsin. Terminal aesthetic, pixel-perfect!",
  
  cv: "📄 CV indirmek için /contact sayfasına git. Orada download butonu var. PDF formatında detaylı CV'yi indirebilirsin.",
  
  default: [
    "Hmm, tam anlayamadım. Şunları sorabilirsin:\n• Projeler hakkında\n• Eğitim/okul\n• İletişim bilgileri\n• Oyunlar\n• CV indirme",
    "Bu konuda bilgim yok. 'projeler', 'iletişim', 'eğitim', 'cv' veya 'oyunlar' hakkında soru sorabilirsin!",
    "Anlamadım 🤔 'help' yaz, sana yardımcı olayım!"
  ],
  
  help: "💡 Şunları sorabilirsin:\n\n• 'projeler' - FLARE, DCE, GeoSocial\n• 'flare' - FLARE projesi detay\n• 'eğitim' veya 'okul' - Üniversite bilgisi\n• 'iletişim' - Email, sosyal medya\n• 'beceriler' veya 'skills' - Teknik yetenekler\n• 'oyunlar' - Mini games\n• 'cv' - CV indirme"
}

const getResponse = (message) => {
  const msg = message.toLowerCase().trim()
  
  // Greetings
  if (/(merhaba|selam|hey|hi|hello|sa)/i.test(msg)) {
    return RESPONSES.greetings[Math.floor(Math.random() * RESPONSES.greetings.length)]
  }
  
  // Help
  if (/(help|yardım|nasıl)/i.test(msg)) {
    return RESPONSES.help
  }
  
  // Projects
  if (/(flare|lora|deprem|earthquake|sos|beacon)/i.test(msg)) {
    return RESPONSES.projects.flare
  }
  if (/(dce|sofc|amonyak|ammonia|yakıt|fuel|hibrid)/i.test(msg)) {
    return RESPONSES.projects.dce
  }
  if (/(geosocial|geo|gps|lokasyon|location|harita)/i.test(msg)) {
    return RESPONSES.projects.geosocial
  }
  if (/(proje|project|çalışma|work)/i.test(msg)) {
    return RESPONSES.projects.all
  }
  
  // Education
  if (/(eğitim|okul|üniversite|university|ağü|agu|öğrenci)/i.test(msg)) {
    return RESPONSES.education
  }
  
  // Skills
  if (/(beceri|skill|teknoloji|tech|yetenek|bilgi)/i.test(msg)) {
    return RESPONSES.skills
  }
  
  // Contact
  if (/(iletişim|contact|email|mail|telefon|phone|sosyal)/i.test(msg)) {
    return RESPONSES.contact
  }
  
  // Games
  if (/(oyun|game|snake|pong|retro)/i.test(msg)) {
    return RESPONSES.games
  }
  
  // CV
  if (/(cv|özgeçmiş|resume)/i.test(msg)) {
    return RESPONSES.cv
  }
  
  // Default
  return RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)]
}

export default function TerminalChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: "Merhaba! Ben Mirac'ın portfolio asistanıyım 🤖\n\n✨ Hızlı komutlar:\n• 'projeler' - Tüm projeler\n• 'iletişim' - Email/sosyal medya\n• 'cv' - CV indirme\n• 'help' - Tüm komutlar"
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions] = useState([
    'projeler',
    'flare nedir?',
    'iletişim',
    'cv',
    'oyunlar'
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { type: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = { type: 'bot', text: getResponse(input) }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 500 + Math.random() * 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-terminal-accent rounded-full flex items-center justify-center shadow-2xl border-2 border-terminal-text"
            style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}
          >
            <MessageCircle size={28} className="text-white" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-terminal-darker border-4 border-terminal-accent shadow-2xl flex flex-col"
            style={{ boxShadow: '0 0 40px rgba(0, 217, 255, 0.3)' }}
          >
            {/* Header */}
            <div className="bg-terminal-accent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={24} className="text-white" />
                <div>
                  <div className="font-bold text-white">MIRAC.AI</div>
                  <div className="text-xs text-white/80">Portfolio Assistant</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-terminal-bg">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 ${
                    msg.type === 'user'
                      ? 'bg-terminal-secondary text-white'
                      : 'bg-terminal-darker border-2 border-terminal-accent text-terminal-text'
                  } font-mono text-sm whitespace-pre-wrap`}>
                    {msg.type === 'bot' && <Zap size={14} className="inline mr-2 text-terminal-accent" />}
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-terminal-darker border-2 border-terminal-accent text-terminal-text p-3 font-mono text-sm">
                    <span className="animate-pulse">Yazıyor...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-terminal-darker border-t-2 border-terminal-accent">
              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(suggestion)
                        setTimeout(() => handleSend(), 100)
                      }}
                      className="px-3 py-1 bg-terminal-bg border border-terminal-accent text-terminal-accent text-xs font-mono hover:bg-terminal-accent hover:text-white transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Bir şey sor..."
                  className="flex-1 bg-terminal-bg border-2 border-terminal-border text-terminal-text px-4 py-2 font-mono text-sm focus:outline-none focus:border-terminal-accent"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`px-4 py-2 ${
                    input.trim()
                      ? 'bg-terminal-accent text-white hover:opacity-80'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  } font-bold transition-all`}
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 font-mono">
                'help' yazarak komutları görebilirsin
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
