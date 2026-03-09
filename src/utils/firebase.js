import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, set, increment } from 'firebase/database'
import { useState, useEffect } from 'react'

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXZtq63Ef1YUkZHuG78UKlTVCs53FBJvY",
  authDomain: "chat-mirac.firebaseapp.com",
  databaseURL: "https://chat-mirac-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-mirac",
  storageBucket: "chat-mirac.firebasestorage.app",
  messagingSenderId: "533641826188",
  appId: "1:533641826188:web:2e39acb96facc5fcf150a9",
  measurementId: "G-YQX7QEGVH2"
}

// Firebase initialize
let app, database
try {
  app = initializeApp(firebaseConfig)
  database = getDatabase(app)
} catch (error) {
  console.log('Firebase init error (expected if no config):', error.message)
}

// Visitor counter hook
export function useVisitorCounter() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!database) {
      // Fallback to localStorage if Firebase not configured
      try {
        let visitors = parseInt(localStorage.getItem('visitor_count') || '0')
        visitors += 1
        localStorage.setItem('visitor_count', visitors.toString())
        setCount(visitors)
        setLoading(false)
      } catch (error) {
        setCount(1)
        setLoading(false)
      }
      return
    }

    // Firebase implementation
    const visitorRef = ref(database, 'visitors/total')
    
    // Get current count
    get(visitorRef)
      .then((snapshot) => {
        const currentCount = snapshot.val() || 0
        const newCount = currentCount + 1
        
        // Increment
        set(visitorRef, newCount)
          .then(() => {
            setCount(newCount)
            setLoading(false)
          })
          .catch((error) => {
            console.error('Firebase set error:', error)
            setCount(currentCount)
            setLoading(false)
          })
      })
      .catch((error) => {
        console.error('Firebase get error:', error)
        setLoading(false)
      })
  }, [])

  return { count, loading }
}

// KULLANIM:
// 1. Firebase Console'da proje oluştur
// 2. Realtime Database aktif et
// 3. firebaseConfig değerlerini yukarı yapıştır
// 4. Component'te: const { count, loading } = useVisitorCounter()
