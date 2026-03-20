import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Check, 
  X, 
  Bell, 
  Clock, 
  MapPin, 
  Loader2,
  ChevronRight,
  User as UserIcon
} from 'lucide-react'
import { BASE_URL } from '../utils/constants'
import { removeRequest, setRequests } from '../utils/requestSlice'
import { pageVariants, containerVariants, itemVariants, buttonVariants } from '../utils/animations'
import { cn } from '../utils/cn'

const Requests = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((store) => store.user)
  const { items: requests, hasFetched, ownerId } = useSelector((store) => store.requests)
  const userId = user?._id
  const [loading, setLoading] = useState(!hasFetched)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (hasFetched && ownerId === userId) {
      setLoading(false)
      return
    }

    const fetchRequests = async () => {
      try {
        setError('')
        setLoading(true)
        const res = await axios.get(`${BASE_URL}/api/user/requests/received`, {
          withCredentials: true,
        })
        dispatch(setRequests({ items: res.data.connectionRequests || [], ownerId: userId }))
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login')
          return
        }
        setError(
          err.response?.data?.message ||
            (typeof err.response?.data === 'string' ? err.response.data : null) ||
            'Failed to load requests',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [dispatch, hasFetched, navigate, ownerId, userId])

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      )
      dispatch(removeRequest(requestId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <motion.div 
      initial="hidden" animate="visible" exit="exit" variants={pageVariants}
      className="min-h-screen pt-28 pb-20 px-6 bg-[#0d0d0d]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-[#ff4458]">
              <Bell size={24} className="animate-bounce" />
              <span className="text-xs font-black uppercase tracking-widest">Notifications</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Connection Requests <span className="text-[#666666] font-medium ml-2">({requests.length})</span>
            </h1>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20"
            >
              <Loader2 className="w-12 h-12 text-[#00d084] animate-spin mb-4" />
              <p className="text-[#a0a0a0] font-medium tracking-wide">Fetching requests...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center p-12 bg-[#1a1a1a] rounded-3xl border border-[#ff4458]/20"
            >
              <p className="text-[#ff4458] font-bold text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#ff4458] text-white rounded-xl font-bold"
              >
                Reload
              </button>
            </motion.div>
          ) : requests.length > 0 ? (
            <motion.div 
              key="list" variants={containerVariants} initial="hidden" animate="visible"
              className="space-y-6"
            >
              {requests.map((request) => (
                <motion.div 
                  key={request._id}
                  variants={itemVariants}
                  whileHover={{ x: 5, borderColor: 'rgba(0, 208, 132, 0.2)' }}
                  className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-[#2a2a2a] p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 shadow-xl group transition-all"
                >
                  {/* Avatar with Glow Effect */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full p-0.5 bg-gradient-to-tr from-[#00d084] to-[#3b82f6]/20 overflow-hidden shadow-[0_0_20px_rgba(0,208,132,0.1)]">
                      <img 
                        src={request.fromUserId?.photoURL || "https://vectorified.com/images/default-user-icon-33.jpg"} 
                        alt={request.fromUserId?.firstName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00d084] border-4 border-[#1a1a1a] rounded-full flex items-center justify-center">
                      <Heart size={10} className="text-white fill-current" />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <h2 className="text-2xl font-black text-white truncate">
                        {request.fromUserId?.firstName} {request.fromUserId?.lastName}
                      </h2>
                      <span className="px-3 py-1 bg-[#0d0d0d] text-[#666666] text-[10px] font-black uppercase rounded-full border border-[#2a2a2a]">
                        {request.fromUserId?.gender || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 text-[#a0a0a0] text-sm mb-4 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-[#3b82f6]" />
                        <span>Just now</span>
                      </div>
                      <span className="hidden md:inline text-[#2a2a2a]">•</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-[#00d084]" />
                        <span className="truncate">Near Mumbai, IN</span>
                      </div>
                    </div>

                    <p className="text-[#e0e0e0] italic line-clamp-2 text-sm max-w-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                      "{request.fromUserId?.about || 'Interested in connecting to collaborate on tech projects!'}"
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {(request.fromUserId?.skills || []).slice(0, 4).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] text-[11px] font-bold uppercase rounded-lg tracking-wider">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0">
                    <motion.button 
                      variants={buttonVariants} whileHover="hover" whileTap="tap"
                      onClick={() => reviewRequest('rejected', request._id)}
                      className="w-14 h-14 bg-[#1a1a1a] border border-[#ff4458]/20 text-[#ff4458] rounded-2xl flex items-center justify-center hover:bg-[#ff4458]/10 transition-colors shadow-sm"
                      title="Reject"
                    >
                      <X size={24} />
                    </motion.button>
                    <motion.button 
                      variants={buttonVariants} whileHover="hover" whileTap="tap"
                      onClick={() => reviewRequest('accepted', request._id)}
                      className="w-14 h-14 bg-gradient-to-br from-[#00d084] to-[#00b870] text-white rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(0,208,132,0.3)] hover:shadow-[0_8px_20px_rgba(0,208,132,0.5)] transition-all"
                      title="Accept"
                    >
                      <Check size={24} strokeWidth={3} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-[#1a1a1a] rounded-[3rem] border-2 border-dashed border-[#2a2a2a] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d084]/20 to-transparent" />
              <div className="w-24 h-24 bg-[#0d0d0d] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-[#2a2a2a]">
                <Bell className="text-[#444444]" size={36} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">No pending requests</h3>
              <p className="text-[#a0a0a0] max-w-xs mx-auto mb-10 font-medium leading-relaxed">
                Your queue is empty. Why not head back to the feed and find some new tech matches?
              </p>
              <motion.button 
                variants={buttonVariants} whileHover="hover" whileTap="tap"
                onClick={() => navigate('/feed')}
                className="px-10 py-4 bg-[#1a1a1a] border border-[#2a2a2a] text-[#00d084] rounded-2xl font-bold flex items-center gap-2 mx-auto hover:bg-[#00d084]/5 transition-colors"
              >
                Discover Developers
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Requests
