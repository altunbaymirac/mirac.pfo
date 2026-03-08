import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { blogPosts } from '../data/blogPosts'

export default function Blog() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-terminal-text neon-glow mb-3">
            📝 Blog & Dev Log
          </h1>
          <p className="text-gray-400">
            Engineering insights, project updates, and technical deep-dives
          </p>
        </motion.div>

        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 10 }}
              className="bg-terminal-darker border-2 border-terminal-border hover:border-terminal-text transition-all p-6 group"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-terminal-text group-hover:text-terminal-secondary transition-colors">
                    {post.title}
                  </h2>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-terminal-secondary"
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                </div>

                <p className="text-gray-400 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs group-hover:border-terminal-secondary transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
