import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowLeft, Calendar, Clock, Share2, Copy, Check } from 'lucide-react'
import { blogPosts } from '../data/blogPosts'
import { useState } from 'react'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)
  const [copied, setCopied] = useState(false)

  if (!post) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-terminal-text mb-4">404</h1>
          <p className="text-gray-400 mb-6">Post not found</p>
          <Link to="/blog" className="text-terminal-secondary hover:underline">
            ← Back to blog
          </Link>
        </div>
      </div>
    )
  }

  const sharePost = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <article className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link to="/blog">
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center space-x-2 text-terminal-secondary mb-8 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Back to blog</span>
          </motion.div>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-terminal-text neon-glow mb-4">
            {post.title}
          </h1>

          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>{post.readTime} read</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-terminal-bg border border-terminal-text text-terminal-text font-mono text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sharePost}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-terminal-border text-terminal-text hover:border-terminal-text transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span className="text-sm font-mono">Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span className="text-sm font-mono">Share</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-terminal-text neon-glow mt-8 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-terminal-secondary mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-terminal-accent mt-4 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-300 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-none space-y-2 mb-4">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start text-gray-300">
                  <span className="text-terminal-text mr-2">→</span>
                  <span>{children}</span>
                </li>
              ),
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <div className="my-4 border-2 border-terminal-text">
                    <div className="bg-terminal-darker px-4 py-2 border-b-2 border-terminal-text">
                      <span className="text-xs font-mono text-terminal-secondary">
                        {match[1]}
                      </span>
                    </div>
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        background: '#0a0e27',
                        fontSize: '0.85rem',
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="bg-terminal-bg border border-terminal-border px-2 py-1 font-mono text-terminal-secondary text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-terminal-accent pl-4 italic text-gray-400 my-4">
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr className="border-terminal-border my-8" />
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-terminal-secondary hover:text-terminal-text underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>
      </article>
    </div>
  )
}
