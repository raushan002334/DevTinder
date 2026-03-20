import axios from 'axios'
import { useDispatch } from 'react-redux'
import { motion, useAnimation } from 'framer-motion'
import { Heart, X, User as UserIcon, Code2, Sparkles, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { removeUserFromFeed } from '../utils/feedSlice'
import { cn } from '../utils/cn'

const UserCard = ({ user }) => {
  const dispatch = useDispatch()
  const controls = useAnimation()
  const [swiping, setSwiping] = useState(null) // 'liked' | 'disliked'

  // Start the entry animation when the component mounts
  useEffect(() => {
    controls.start({ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, type: 'spring', damping: 20 } })
  }, [user._id, controls])

  const handleSendRequest = async (status, toUserId) => {
    setSwiping(status === 'interested' ? 'liked' : 'disliked')
    
    // Animate swiping action
    await controls.start({
      x: status === 'interested' ? 500 : -500,
      opacity: 0,
      rotate: status === 'interested' ? 25 : -25,
      transition: { duration: 0.5, ease: "easeInOut" }
    })

    try {
      await axios.post(
        `${BASE_URL}/api/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true },
      )
      dispatch(removeUserFromFeed(toUserId))
    } catch (err) {
      console.error(err)
      // Reset position on error
      controls.start({ x: 0, opacity: 1, rotate: 0 })
      setSwiping(null)
    }
  }

  const skills = user.skills || []

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={controls}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="relative w-full max-w-md mx-auto aspect-[3/4] md:aspect-[2/3] group select-none"
    >
      {/* Premium Card Structure */}
      <div className="absolute inset-0 bg-[#1a1a1a] rounded-[2.5rem] border border-[#2a2a2a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-[#ffffff]/5">
        
        {/* User Image or Placeholder */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {user.photoURL ? (
            <motion.img 
              src={user.photoURL} 
              alt={user.firstName} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex flex-col items-center justify-center p-12">
              <UserIcon size={120} className="text-[#2a2a2a] mb-6" />
              <p className="text-[#3a3a3a] text-sm text-center font-medium max-w-[200px]">No profile photo uploaded by this developer yet</p>
            </div>
          )}
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Swipe Indicators */}
        {swiping && (
          <div className={cn(
            "absolute top-8 z-30 px-6 py-2 border-4 rounded-xl font-black text-4xl uppercase tracking-widest",
            swiping === 'liked' ? "right-8 text-[#00d084] border-[#00d084] rotate-[15deg]" : "left-8 text-[#ff4458] border-[#ff4458] -rotate-[15deg]"
          )}>
            {swiping === 'liked' ? 'LIKE' : 'NOPE'}
          </div>
        )}

        {/* User Info Overlays */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-white tracking-tight">
                {user.firstName}, {user.age}
              </h1>
              <div className="bg-[#00d084]/20 border border-[#00d084]/30 px-2 py-0.5 rounded flex items-center gap-1.5 backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                <Sparkles size={12} className="text-[#00d084]" />
                <span className="text-[10px] uppercase font-bold text-[#00d084] tracking-wider">Premium</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-[#a0a0a0] font-medium text-sm">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-[#00d084]" />
                <span>Nearby</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 uppercase tracking-wider text-[11px]">
                {user.gender}
              </div>
            </div>
          </div>

          <p className="text-[#e0e0e0] line-clamp-2 text-sm leading-relaxed max-w-[90%] font-medium">
            {user.about}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.slice(0, 3).map((skill) => (
              <span 
                key={skill} 
                className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-bold text-white tracking-wide uppercase transition-colors hover:bg-white/20"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-bold text-[#666666] tracking-wide">
                +{skills.length - 3} More
              </span>
            )}
            {skills.length === 0 && (
              <div className="flex items-center gap-2 text-[#666666] font-semibold text-xs py-1 italic">
                <Code2 size={14} />
                <span>Stacks not listed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-6 z-40">
        <motion.button
          whileHover={{ scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSendRequest('ignored', user._id)}
          className="w-16 h-16 rounded-full bg-[#1a1a1a] border-4 border-[#ff4458]/40 text-[#ff4458] flex items-center justify-center shadow-[0_8px_25px_rgba(255,68,88,0.3)] hover:shadow-[0_12px_30px_rgba(255,68,88,0.5)] transition-all group/btn"
        >
          <X size={32} className="group-hover/btn:scale-110 transition-transform" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSendRequest('interested', user._id)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00d084] to-[#00b870] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(0,208,132,0.3)] hover:shadow-[0_12px_30px_rgba(0,208,132,0.5)] transition-all group/btn"
        >
          <Heart size={32} className="fill-current group-hover/btn:scale-110 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default UserCard
