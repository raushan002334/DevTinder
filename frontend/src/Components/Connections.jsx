import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MessageSquare, 
  UserMinus, 
  Search, 
  Loader2, 
  MapPin, 
  Code2,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import { BASE_URL } from '../utils/constants'
import { setConnections } from '../utils/connectionSlice'
import { pageVariants, containerVariants, itemVariants, buttonVariants } from '../utils/animations'
import { cn } from '../utils/cn'

const Connections = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((store) => store.user)
  const { items: connections, hasFetched, ownerId } = useSelector((store) => store.connections)
  const userId = user?._id
  const [loading, setLoading] = useState(!hasFetched)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (hasFetched && ownerId === userId) {
      setLoading(false)
      return
    }

    const fetchConnections = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL}/api/user/connections`, {
          withCredentials: true,
        })
        dispatch(setConnections({ items: res.data.connections || [], ownerId: userId }))
      } catch (err) {
        if (err.response?.status === 401) navigate('/login')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [dispatch, hasFetched, navigate, ownerId, userId])

  const filteredConnections = connections.filter(conn => 
    `${conn.firstName} ${conn.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <motion.div 
      initial="hidden" animate="visible" exit="exit" variants={pageVariants}
      className="min-h-screen pt-28 pb-20 px-6 bg-[#0d0d0d]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#00d084]">
              <Users size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Network</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              My Connections <span className="text-[#666666] font-medium ml-2">({connections.length})</span>
            </h1>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-[#00d084] transition-all font-medium text-sm"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20"
            >
              <Loader2 className="w-12 h-12 text-[#00d084] animate-spin mb-4" />
              <p className="text-[#a0a0a0] font-medium">Loading your network...</p>
            </motion.div>
          ) : filteredConnections.length > 0 ? (
            <motion.div 
              key="list" variants={containerVariants} initial="hidden" animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredConnections.map((conn) => (
                <motion.div 
                  key={conn._id}
                  variants={itemVariants}
                  whileHover={{ y: -5, borderColor: 'rgba(0, 208, 132, 0.3)' }}
                  className="bg-[#1a1a1a]/60 backdrop-blur-md border border-[#2a2a2a] p-6 rounded-[2rem] flex items-center gap-6 transition-all group"
                >
                  {/* Connection Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#2a2a2a] group-hover:border-[#00d084]/50 transition-colors bg-[#0d0d0d]">
                      <img 
                        src={conn.photoURL || "https://vectorified.com/images/default-user-icon-33.jpg"} 
                        alt={conn.firstName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00d084] border-4 border-[#1a1a1a] rounded-full" />
                  </div>

                  {/* Connection Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold text-white truncate">
                        {conn.firstName} {conn.lastName}
                      </h2>
                      <div className="px-2 py-0.5 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-black uppercase rounded border border-[#3b82f6]/20">
                        {conn.gender?.charAt(0) || 'M'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#a0a0a0] text-sm mb-3">
                      <MapPin size={14} className="text-[#00d084]" />
                      <span className="truncate">Active Developer</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(conn.skills || []).slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-[#0d0d0d] text-[#666666] text-[10px] font-bold uppercase rounded-md border border-[#2a2a2a]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <motion.button 
                      variants={buttonVariants} whileHover="hover" whileTap="tap"
                      className="p-3 bg-[#00d084]/10 text-[#00d084] rounded-xl hover:bg-[#00d084] hover:text-white transition-all shadow-sm"
                      title="Message"
                    >
                      <MessageSquare size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-[#1a1a1a] rounded-[3rem] border border-[#2a2a2a] border-dashed"
            >
              <div className="w-20 h-20 bg-[#0d0d0d] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-[#666666]" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No connections found</h3>
              <p className="text-[#a0a0a0] max-w-xs mx-auto mb-8 font-medium">
                {searchTerm ? `No results for "${searchTerm}"` : "You haven't made any connections yet. Start swiping to meet new developers!"}
              </p>
              {!searchTerm && (
                <motion.button 
                  variants={buttonVariants} whileHover="hover" whileTap="tap"
                  onClick={() => navigate('/feed')}
                  className="px-8 py-3 bg-[#00d084] text-white rounded-2xl font-bold flex items-center gap-2 mx-auto"
                >
                  Discover Developers
                  <ChevronRight size={18} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Connections
