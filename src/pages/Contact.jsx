import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Download, Github, Linkedin, Twitter, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'collaboration'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production, send to backend/EmailJS
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleDownloadCV = () => {
    // In production, link to actual PDF
    const link = document.createElement('a')
    link.href = '/cv/Mirac_Altunbay_CV.pdf'
    link.download = 'Mirac_Altunbay_CV.pdf'
    link.click()
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-terminal-text neon-glow mb-3">
            📬 Get In Touch
          </h1>
          <p className="text-gray-400">
            Let's collaborate on projects, discuss opportunities, or just chat about engineering
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-terminal-darker border-2 border-terminal-text p-6"
          >
            <h2 className="text-xl font-bold text-terminal-secondary mb-6">
              Send Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Type */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">
                  CONTACT TYPE
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-terminal-bg border-2 border-terminal-border p-3 text-terminal-text font-mono focus:border-terminal-text outline-none"
                >
                  <option value="collaboration">Collaboration Inquiry</option>
                  <option value="investor">Investor Contact</option>
                  <option value="job">Job Opportunity</option>
                  <option value="general">General Question</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">
                  NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-terminal-bg border-2 border-terminal-border p-3 text-terminal-text font-mono focus:border-terminal-text outline-none"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-terminal-bg border-2 border-terminal-border p-3 text-terminal-text font-mono focus:border-terminal-text outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">
                  SUBJECT
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full bg-terminal-bg border-2 border-terminal-border p-3 text-terminal-text font-mono focus:border-terminal-text outline-none"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">
                  MESSAGE
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full bg-terminal-bg border-2 border-terminal-border p-3 text-terminal-text font-mono focus:border-terminal-text outline-none resize-none"
                  placeholder="Your message here..."
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitted}
                className={`w-full py-3 font-bold font-mono flex items-center justify-center space-x-2 transition-all ${
                  submitted
                    ? 'bg-green-500 border-2 border-green-500 text-white'
                    : 'bg-terminal-text border-2 border-terminal-text text-terminal-bg hover:bg-transparent hover:text-terminal-text'
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle size={20} />
                    <span>MESSAGE SENT!</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info & CV */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* CV Download */}
            <div className="bg-terminal-darker border-2 border-terminal-accent p-6">
              <h2 className="text-xl font-bold text-terminal-accent mb-4">
                Download CV
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Get my full resume with project details, technical skills, and academic background
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCV}
                className="w-full bg-terminal-accent border-2 border-terminal-accent text-white py-3 font-bold font-mono flex items-center justify-center space-x-2 hover:bg-transparent hover:text-terminal-accent transition-all"
              >
                <Download size={20} />
                <span>DOWNLOAD PDF</span>
              </motion.button>
            </div>

            {/* Direct Contact */}
            <div className="bg-terminal-darker border-2 border-terminal-secondary p-6">
              <h2 className="text-xl font-bold text-terminal-secondary mb-4">
                Direct Contact
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-terminal-text" />
                  <a
                    href="mailto:mirac.altunbay@agu.edu.tr"
                    className="text-terminal-secondary hover:underline font-mono"
                  >
                    mirac.altunbay@agu.edu.tr
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-terminal-darker border-2 border-terminal-text p-6">
              <h2 className="text-xl font-bold text-terminal-text mb-4">
                Social & Professional
              </h2>
              <div className="space-y-3">
                <motion.a
                  whileHover={{ x: 5 }}
                  href="https://github.com/miracaltunbay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border-2 border-terminal-border hover:border-terminal-text transition-colors"
                >
                  <Github size={20} className="text-terminal-text" />
                  <span className="text-terminal-text font-mono text-sm">
                    github.com/miracaltunbay
                  </span>
                </motion.a>

                <motion.a
                  whileHover={{ x: 5 }}
                  href="https://linkedin.com/in/miracaltunbay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border-2 border-terminal-border hover:border-terminal-text transition-colors"
                >
                  <Linkedin size={20} className="text-terminal-secondary" />
                  <span className="text-terminal-text font-mono text-sm">
                    linkedin.com/in/miracaltunbay
                  </span>
                </motion.a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-terminal-bg border-2 border-terminal-border p-4">
              <p className="text-xs text-gray-500 font-mono">
                ⏱️ <strong className="text-terminal-text">Response time:</strong> Usually within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
