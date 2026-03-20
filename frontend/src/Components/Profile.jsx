import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Users, 
  Edit3, 
  ChevronRight, 
  MapPin, 
  ShieldCheck,
  Star
} from 'lucide-react'
import { pageVariants, buttonVariants, containerVariants, itemVariants } from '../utils/animations'
import { cn } from '../utils/cn'

const Profile = () => {
  const user = useSelector((store) => store.user)
  const navigate = useNavigate()

  if (!user) {
    return (
      <motion.div 
        initial="hidden" animate="visible" variants={pageVariants}
        className="min-h-screen flex items-center justify-center pt-20 px-6 bg-[#0d0d0d]"
      >
        <div className="text-center p-12 bg-[#1a1a1a] rounded-3xl border border-[#2a2a2a] max-w-sm">
          <div className="w-16 h-16 bg-[#ff4458]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-[#ff4458]" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-[#a0a0a0] mb-8">Please login to view your premium profile.</p>
          <motion.button
            variants={buttonVariants} whileHover="hover" whileTap="tap"
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-[#00d084] text-white rounded-xl font-bold"
          >
            Go to Login
          </motion.button>
        </div>
      </motion.div>
    )
  }

  const skills = user.skills || []

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen pt-28 pb-20 px-6 bg-[#0d0d0d]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d084]/20 to-[#3b82f6]/20 blur-[100px] -z-10 opacity-50" />
          
          <div className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-[#2a2a2a] rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              {/* Avatar Section */}
              <div className="relative group mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-tr from-[#00d084] via-[#00d084]/20 to-[#3b82f6] shadow-[0_0_30px_rgba(0,208,132,0.2)]">
                  <div className="w-full h-full rounded-full border-4 border-[#0d0d0d] overflow-hidden bg-[#0d0d0d]">
                    <img 
                      src={user.photoURL || "https://vectorified.com/images/default-user-icon-33.jpg"} 
                      alt={user.firstName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#00d084] rounded-full border-4 border-[#1a1a1a] flex items-center justify-center shadow-lg">
                  <ShieldCheck size={14} className="text-white" />
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                      {user.firstName} {user.lastName}
                    </h1>
                    <span className="px-3 py-1 bg-[#00d084]/10 border border-[#00d084]/20 rounded-full text-[10px] font-black text-[#00d084] uppercase tracking-widest flex items-center gap-1.5">
                      <Star size={10} className="fill-current" />
                      Pro Developer
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-[#a0a0a0] text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#00d084]" />
                      India
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5 uppercase tracking-wide">
                      <Users size={16} className="text-[#3b82f6]" />
                      {user.gender}
                    </div>
                  </div>
                </div>

                <p className="text-[#e0e0e0] leading-relaxed max-w-xl italic">
                  "{user.about || 'A passionate developer looking for meaningful tech connections.'}"
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link 
                      to="/profile/edit" 
                      className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#00d084] to-[#00b870] text-white rounded-2xl font-bold shadow-[0_10px_25px_rgba(0,208,132,0.3)] hover:shadow-[0_15px_30px_rgba(0,208,132,0.4)] transition-all"
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Email Info */}
          <motion.div variants={itemVariants} className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-3xl group hover:border-[#00d084]/30 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#00d084]/10 flex items-center justify-center text-[#00d084]">
                <Mail size={20} />
              </div>
              <h3 className="text-white font-bold">Contact</h3>
            </div>
            <p className="text-[#a0a0a0] text-sm break-all font-medium">{user.emailId}</p>
          </motion.div>

          {/* Age Info */}
          <motion.div variants={itemVariants} className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-3xl group hover:border-[#3b82f6]/30 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                <Calendar size={20} />
              </div>
              <h3 className="text-white font-bold">Birthday</h3>
            </div>
            <p className="text-[#a0a0a0] text-sm font-medium">{user.age ? `${user.age} Years Old` : 'Age not specified'}</p>
          </motion.div>

          {/* Verification Status */}
          <motion.div variants={itemVariants} className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-3xl group hover:border-[#00d084]/30 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#00d084]/10 flex items-center justify-center text-[#00d084]">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-white font-bold">Verified</h3>
            </div>
            <div className="flex items-center gap-2 text-[#00d084] text-sm font-bold uppercase tracking-wider">
              Profile Verified
              <ChevronRight size={14} />
            </div>
          </motion.div>
        </motion.div>

        {/* Skills Section */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-[2.5rem] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00d084]/5 to-transparent blur-2xl" />
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#00d084] rounded-full" />
            Tech Stack & Skills
          </h2>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span 
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="px-5 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] hover:border-[#00d084]/40 hover:bg-[#00d084]/5 rounded-2xl text-[#e0e0e0] font-bold text-xs uppercase tracking-wider transition-all cursor-default shadow-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-[#0d0d0d] rounded-3xl border-2 border-dashed border-[#2a2a2a]">
              <p className="text-[#666666] font-medium italic">No skills listed yet. Add some to get better matches!</p>
              <Link to="/profile/edit" className="text-[#00d084] text-sm font-bold mt-2 inline-block hover:underline">Edit now →</Link>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Profile
