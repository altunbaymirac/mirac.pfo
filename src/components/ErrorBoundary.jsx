import { Component } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-terminal-darker border-4 border-red-500 p-8 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
            <h1 className="text-3xl font-bold text-red-500 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 px-6 py-3 bg-terminal-accent text-white font-bold hover:opacity-80"
              >
                <Home size={20} />
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 border-2 border-terminal-text text-terminal-text hover:bg-terminal-text hover:text-terminal-bg font-bold"
              >
                <RefreshCcw size={20} />
                Reload
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
