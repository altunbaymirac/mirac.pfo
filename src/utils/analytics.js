import { useEffect, useState } from 'react'

// Simple visitor tracking using localStorage + API
export function useRealAnalytics() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    avgSessionTime: '0:00',
    bounceRate: 0,
    loading: true
  })

  useEffect(() => {
    try {
      // Track page view
      trackPageView()

      // Vercel Analytics varsa kullan
      if (window.va) {
        window.va('pageview')
      }

      // Basit localStorage tracking
      const sessionStart = Date.now()
      
      // Total visitor count (localStorage)
      const totalVisits = parseInt(localStorage.getItem('total_visits') || '0')
      localStorage.setItem('total_visits', (totalVisits + 1).toString())

      // Today's visits
      const today = new Date().toDateString()
      const lastVisit = localStorage.getItem('last_visit_date')
      const todayVisits = lastVisit === today 
        ? parseInt(localStorage.getItem('today_visits') || '0') + 1
        : 1
      
      localStorage.setItem('today_visits', todayVisits.toString())
      localStorage.setItem('last_visit_date', today)

      // Session time tracking
      const handleBeforeUnload = () => {
        const sessionTime = Math.floor((Date.now() - sessionStart) / 1000)
        const avgTime = parseInt(localStorage.getItem('avg_session_time') || '0')
        const newAvg = Math.floor((avgTime + sessionTime) / 2)
        localStorage.setItem('avg_session_time', newAvg.toString())
      }

      window.addEventListener('beforeunload', handleBeforeUnload)

      // Update stats
      const avgSeconds = parseInt(localStorage.getItem('avg_session_time') || '0')
      const minutes = Math.floor(avgSeconds / 60)
      const seconds = avgSeconds % 60

      setStats({
        totalVisitors: totalVisits + 1,
        todayVisitors: todayVisits,
        avgSessionTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        bounceRate: calculateBounceRate(),
        loading: false
      })

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    } catch (error) {
      console.error('Analytics error:', error)
      setStats({
        totalVisitors: 1,
        todayVisitors: 1,
        avgSessionTime: '0:00',
        bounceRate: 0,
        loading: false
      })
    }
  }, [])

  return stats
}

function trackPageView() {
  try {
    // Track current page
    const currentPath = window.location.pathname
    const pageViews = JSON.parse(localStorage.getItem('page_views') || '{}')
    pageViews[currentPath] = (pageViews[currentPath] || 0) + 1
    localStorage.setItem('page_views', JSON.stringify(pageViews))
  } catch (error) {
    console.error('Track page view error:', error)
  }
}

function calculateBounceRate() {
  try {
    const pageViews = JSON.parse(localStorage.getItem('page_views') || '{}')
    const totalPages = Object.values(pageViews).reduce((a, b) => a + b, 0)
    const homeViews = pageViews['/'] || 0
    return totalPages > 0 ? ((homeViews / totalPages) * 100).toFixed(1) : 0
  } catch (error) {
    console.error('Calculate bounce rate error:', error)
    return 0
  }
}


// VERCEL ANALYTICS KURULUMU:
// 1. Vercel Dashboard → Settings → Analytics → Enable
// 2. package.json'a ekle: "@vercel/analytics": "^1.1.1"
// 3. main.jsx'e ekle: import { Analytics } from '@vercel/analytics/react'
// 4. <Analytics /> component'ini render et
