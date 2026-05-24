import { motion } from 'framer-motion'
import { ArrowRightLeft, Search, ShieldCheck, MessageCircle, Star, MapPin, Plus, Heart } from 'lucide-react'

const sampleItems = [
  { title: 'Arduino Starter Kit', owner: 'Ece', location: 'Kayseri', wants: 'Raspberry Pi', score: 94 },
  { title: 'Calculus Notes', owner: 'Mert', location: 'AGU', wants: 'Physics book', score: 88 },
  { title: 'Mechanical Keyboard', owner: 'Mirac', location: 'Campus', wants: 'Wireless mouse', score: 91 },
]

export default function TakaslaPreview() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-terminal-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 border-2 border-terminal-accent text-terminal-accent bg-terminal-darker">
              <ArrowRightLeft size={36} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-terminal-text neon-glow">
                Takasla Preview
              </h1>
              <p className="text-gray-400 mt-2">
                Student-focused barter marketplace concept with trust, location, and chat flow.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <section className="space-y-6">
            <div className="bg-terminal-darker border-2 border-terminal-text p-5">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 bg-terminal-bg border-2 border-terminal-border px-4 py-3">
                  <Search size={18} className="text-terminal-secondary" />
                  <span className="text-gray-500 font-mono text-sm">Search items, skills, notes...</span>
                </div>
                <button className="px-5 py-3 bg-terminal-text border-2 border-terminal-text text-terminal-bg font-bold font-mono flex items-center justify-center gap-2">
                  <Plus size={18} />
                  LIST ITEM
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: ArrowRightLeft, label: 'Smart Matching', value: '2-way' },
                { icon: ShieldCheck, label: 'Trust Layer', value: 'Verified' },
                { icon: MessageCircle, label: 'Deal Flow', value: 'Chat-first' },
              ].map((stat) => (
                <div key={stat.label} className="bg-terminal-darker border-2 border-terminal-border p-5">
                  <stat.icon className="text-terminal-secondary mb-4" size={26} />
                  <div className="text-2xl font-bold text-terminal-text">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {sampleItems.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-terminal-darker border-2 border-terminal-border hover:border-terminal-accent p-5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="h-16 w-16 border-2 border-terminal-secondary bg-terminal-bg flex items-center justify-center text-terminal-secondary">
                      <ArrowRightLeft size={28} />
                    </div>
                    <button className="text-terminal-accent">
                      <Heart size={20} />
                    </button>
                  </div>
                  <h2 className="text-lg font-bold text-terminal-text mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Wants: <span className="text-terminal-secondary">{item.wants}</span>
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1 text-terminal-accent">
                      <Star size={13} />
                      {item.score}% match
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <aside className="bg-terminal-darker border-2 border-terminal-accent p-6 h-fit">
            <h2 className="text-2xl font-bold text-terminal-accent mb-4">Product Idea</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                Takasla is a preview for a barter-first marketplace where students can exchange items, notes, books, or small services without forcing every transaction into cash.
              </p>
              <p>
                The core flow is simple: list what you have, define what you want, get a match score, then move into chat with trust indicators.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {['Item listing', 'Match scoring', 'Location filter', 'Trust badges', 'Chat handoff'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-terminal-text">-&gt;</span>
                  {feature}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
