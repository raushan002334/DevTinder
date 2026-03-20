import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { BASE_URL } from '../utils/constants'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'
import { pageVariants, buttonVariants } from '../utils/animations'

const Feed = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((store) => store.user)
  const { items: feed, hasFetched, ownerId } = useSelector((store) => store.feed)
  const userId = user?._id
  const [loading, setLoading] = useState(!hasFetched)
  const [error, setError] = useState('')

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      })
      dispatch(addFeed({ items: res.data.users || [], ownerId: userId }))
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
        return
      }
      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === 'string' ? err.response.data : null) ||
          'Failed to load feed',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (hasFetched && ownerId === userId) {
      setLoading(false)
      return
    }

    fetchFeed()
  }, [dispatch, hasFetched, navigate, ownerId, userId])

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className="min-h-[calc(100-80px)] pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-[#0d0d0d]"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-20"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#00d084] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#00d084]/20 animate-pulse" />
            </div>
            <p className="text-[#a0a0a0] font-medium tracking-wide">Finding matches...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-[#1a1a1a] rounded-3xl border border-[#ff4458]/20"
          >
            <p className="text-[#ff4458] mb-6 font-medium">{error}</p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={fetchFeed}
              className="px-6 py-2 bg-[#ff4458]/10 text-[#ff4458] rounded-full font-bold flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={18} />
              Try Again
            </motion.button>
          </motion.div>
        ) : !feed.length ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm px-6 py-12 bg-[#1a1a1a] rounded-[2.5rem] border border-[#2a2a2a] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00d084] via-[#3b82f6] to-[#00d084]" />
            <div className="w-20 h-20 bg-[#0d0d0d] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#2a2a2a] shadow-inner">
              <Sparkles className="text-[#00d084]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">You've seen them all!</h2>
            <p className="text-[#a0a0a0] leading-relaxed mb-8">
              No more profiles to show right now. Check back later for new developers joining the community.
            </p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={fetchFeed}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#00d084] py-3.5 rounded-2xl font-bold hover:bg-[#00d084]/5 transition-colors"
            >
              Refresh Feed
            </motion.button>
          </motion.div>
        ) : (
          <div className="relative w-full max-w-md perspective-1000">
            <AnimatePresence>
              <UserCard key={feed[0]._id} user={feed[0]} />
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Feed
