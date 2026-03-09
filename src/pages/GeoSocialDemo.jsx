import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, Zap, TrendingUp, Clock, Heart, MessageCircle, Navigation, Home, Search, Plus } from 'lucide-react'

export default function GeoSocialDemo() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 38.7225, lng: 35.4864, name: 'AGÜ Kampüs' })
  const [isTracking, setIsTracking] = useState(false)
  const [checkIns, setCheckIns] = useState(23)
  const [nearbyUsers, setNearbyUsers] = useState(7)
  const [activeTab, setActiveTab] = useState('map')
  const [feedItems, setFeedItems] = useState([
    { id: 1, user: 'Ali K.', location: 'Starbucks Kayseri', time: '5m ago', distance: '240m', likes: 12 },
    { id: 2, user: 'Ayşe M.', location: 'AGÜ Kütüphane', time: '12m ago', distance: '180m', likes: 8 },
    { id: 3, user: 'Mehmet Y.', location: 'Park Kayseri', time: '28m ago', distance: '1.2km', likes: 15 }
  ])

  useEffect(() => {
    if (!isTracking) return
    
    const interval = setInterval(() => {
      setCurrentLocation(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lng: prev.lng + (Math.random() - 0.5) * 0.0001
      }))
      setNearbyUsers(Math.floor(Math.random() * 15) + 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [isTracking])

  const handleCheckIn = () => {
    setCheckIns(prev => prev + 1)
    setFeedItems(prev => [{
      id: Date.now(),
      user: 'Sen',
      location: currentLocation.name,
      time: 'just now',
      distance: '0m',
      likes: 0
    }, ...prev.slice(0, 4)])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-terminal-bg to-blue-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white neon-glow mb-4">
            GeoSocial App
          </h1>
          <p className="text-gray-300 text-lg">
            Location-Based Social Network • React Native + Firebase
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Android Phone Mockup */}
          <div className="flex justify-center items-start">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-[340px] h-[680px] bg-gray-900 rounded-[50px] shadow-2xl border-8 border-gray-800 relative overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-50"></div>
                
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-b from-blue-50 to-purple-50 overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between px-6 pt-2">
                    <div className="text-white text-xs font-bold">9:41</div>
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-white/30 rounded"></div>
                      <div className="w-4 h-4 bg-white/30 rounded"></div>
                      <div className="w-4 h-4 bg-white/30 rounded"></div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MapPin size={24} />
                      GeoSocial
                    </h2>
                    <p className="text-xs text-white/80 flex items-center gap-2">
                      <Navigation size={12} />
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </p>
                  </div>

                  {/* Stats Bar */}
                  <div className="bg-white/90 backdrop-blur-sm p-3 grid grid-cols-3 gap-2 border-b">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{checkIns}</div>
                      <div className="text-xs text-gray-600">Check-ins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{nearbyUsers}</div>
                      <div className="text-xs text-gray-600">Nearby</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {isTracking ? '✓' : '○'}
                      </div>
                      <div className="text-xs text-gray-600">GPS</div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-white/80 backdrop-blur-sm flex border-b">
                    {['map', 'feed', 'profile'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-semibold capitalize ${
                          activeTab === tab 
                            ? 'text-purple-600 border-b-2 border-purple-600' 
                            : 'text-gray-500'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Content Area */}
                  <div className="h-[420px] overflow-y-auto bg-gradient-to-b from-white/50 to-purple-50/50">
                    <AnimatePresence mode="wait">
                      {activeTab === 'map' && (
                        <motion.div
                          key="map"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-4 space-y-3"
                        >
                          {/* Mock Map */}
                          <div className="w-full h-48 bg-gradient-to-br from-green-200 to-blue-200 rounded-xl relative overflow-hidden border-2 border-gray-300">
                            <div className="absolute inset-0 opacity-20">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }}></div>
                              ))}
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }}></div>
                              ))}
                            </div>
                            
                            {/* Your Location Pin */}
                            <motion.div
                              animate={{ 
                                scale: isTracking ? [1, 1.2, 1] : 1,
                                y: isTracking ? [0, -5, 0] : 0
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full"
                            >
                              <MapPin className="text-red-500" size={32} fill="currentColor" />
                            </motion.div>

                            {/* Nearby Users */}
                            {[...Array(nearbyUsers)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                                className="absolute"
                                style={{
                                  top: `${30 + Math.random() * 40}%`,
                                  left: `${30 + Math.random() * 40}%`
                                }}
                              >
                                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Location Info */}
                          <div className="bg-white rounded-xl p-4 shadow">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-gray-800">{currentLocation.name}</h3>
                                <p className="text-xs text-gray-500">Kayseri, Turkey</p>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCheckIn}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-xs font-bold shadow-lg"
                              >
                                Check In
                              </motion.button>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {nearbyUsers} nearby
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap size={12} />
                                {checkIns} visits
                              </span>
                            </div>
                          </div>

                          {/* GPS Toggle */}
                          <button
                            onClick={() => setIsTracking(!isTracking)}
                            className={`w-full py-3 rounded-xl font-bold text-sm ${
                              isTracking 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-700'
                            }`}
                          >
                            {isTracking ? '✓ GPS Tracking Active' : 'Start GPS Tracking'}
                          </button>
                        </motion.div>
                      )}

                      {activeTab === 'feed' && (
                        <motion.div
                          key="feed"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-4 space-y-3"
                        >
                          {feedItems.map((item, i) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-white rounded-xl p-4 shadow"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {item.user[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-gray-800">{item.user}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                      <MapPin size={10} />
                                      {item.location}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400">{item.time}</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Navigation size={12} />
                                  {item.distance}
                                </span>
                                <button className="flex items-center gap-1 text-red-500">
                                  <Heart size={12} />
                                  {item.likes}
                                </button>
                                <button className="flex items-center gap-1 text-blue-500">
                                  <MessageCircle size={12} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === 'profile' && (
                        <motion.div
                          key="profile"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-4 space-y-3"
                        >
                          <div className="bg-white rounded-xl p-6 text-center shadow">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold">
                              M
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Mirac Altunbay</h3>
                            <p className="text-sm text-gray-500">AGÜ • Mechanical Eng.</p>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl p-3 text-center shadow">
                              <div className="text-2xl font-bold text-purple-600">{checkIns}</div>
                              <div className="text-xs text-gray-600">Check-ins</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center shadow">
                              <div className="text-2xl font-bold text-blue-600">24</div>
                              <div className="text-xs text-gray-600">Friends</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center shadow">
                              <div className="text-2xl font-bold text-green-600">156</div>
                              <div className="text-xs text-gray-600">Points</div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 shadow">
                            <h4 className="font-bold text-sm text-gray-800 mb-3">Recent Places</h4>
                            {['AGÜ Kampüs', 'Starbucks', 'Park'].map((place, i) => (
                              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                <span className="text-sm text-gray-700">{place}</span>
                                <span className="text-xs text-gray-400">{i + 2} times</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-t flex items-center justify-around">
                    {[
                      { icon: Home, label: 'Home' },
                      { icon: Search, label: 'Explore' },
                      { icon: Plus, label: 'Post' },
                      { icon: Users, label: 'Friends' }
                    ].map((item, i) => (
                      <button key={i} className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600">
                        <item.icon size={20} />
                        <span className="text-[10px]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Home Button */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin size={24} />
                About GeoSocial
              </h3>
              <p className="text-gray-300 mb-4">
                Location-based social networking app built with React Native, Firebase, and real-time GPS tracking.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span>Real-time GPS tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-400" />
                  <span>Find nearby users</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-400" />
                  <span>Location-based check-ins</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span>Gamification & points</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Tech Stack</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-3 text-center">
                  <span className="text-blue-300 font-semibold text-sm">React Native</span>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 font-semibold text-sm">Firebase</span>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-3 text-center">
                  <span className="text-purple-300 font-semibold text-sm">Expo</span>
                </div>
                <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 text-center">
                  <span className="text-green-300 font-semibold text-sm">GPS API</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-3">Live Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ GPS tracking simulation (toggle on/off)</li>
                <li>✓ Check-in system with counter</li>
                <li>✓ Nearby users detection</li>
                <li>✓ Social feed with real-time updates</li>
                <li>✓ Profile statistics</li>
                <li>✓ Interactive map view</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
