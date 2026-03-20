import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  X, 
  User as UserIcon, 
  Camera, 
  Code, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react'
import { BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'
import { pageVariants, buttonVariants, formVariants, containerVariants, itemVariants } from '../utils/animations'
import { cn } from '../utils/cn'

const EditProfile = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    photoURL: user?.photoURL || '',
    age: user?.age || '',
    gender: user?.gender || '',
    about: user?.about || '',
    skills: (user?.skills || []).join(', '),
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      }

      const res = await axios.patch(`${BASE_URL}/api/profile/edit`, payload, {
        withCredentials: true,
      })

      dispatch(addUser(res.data.user))
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        navigate('/profile')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const inputFields = [
    { name: 'firstName', label: 'First Name', placeholder: 'John', icon: UserIcon },
    { name: 'lastName', label: 'Last Name', placeholder: 'Doe', icon: UserIcon },
    { name: 'age', label: 'Age', placeholder: '25', type: 'number', icon: Info },
    { name: 'gender', label: 'Gender', placeholder: 'male', icon: Info },
    { name: 'photoURL', label: 'Photo URL', placeholder: 'https://...', icon: Camera },
  ]

  return (
    <motion.div 
      initial="hidden" animate="visible" exit="exit" variants={pageVariants}
      className="min-h-screen pt-28 pb-20 px-6 bg-[#0d0d0d]"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#00d084] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 size={24} />
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <motion.button 
            variants={buttonVariants} whileHover="hover" whileTap="tap"
            onClick={() => navigate('/profile')}
            className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] rounded-2xl hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h1 className="text-3xl font-black text-white tracking-tight">Edit Profile</h1>
        </div>

        <motion.div 
          variants={formVariants}
          className="bg-[#1a1a1a]/60 backdrop-blur-xl border border-[#2a2a2a] rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider ml-1">
                    {field.label}
                  </label>
                  <div className="relative group">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
                    <input
                      className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20 transition-all font-medium"
                      name={field.name}
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* About Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider ml-1">About Bio</label>
              <div className="relative group">
                <Info className="absolute left-4 top-4 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
                <textarea
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20 transition-all font-medium min-h-[120px] resize-none"
                  name="about"
                  placeholder="Tell us about yourself..."
                  value={formData.about}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider ml-1">Skills (Comma Separated)</label>
              <div className="relative group">
                <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
                <input
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20 transition-all font-medium"
                  name="skills"
                  placeholder="React, Node.js, Python, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
              <p className="text-[10px] text-[#666666] ml-1">E.g. JavaScript, AWS, UI/UX, Docker</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex items-center gap-2 text-[#ff4458] bg-[#ff4458]/10 p-4 rounded-xl border border-[#ff4458]/20"
                >
                  <AlertCircle size={18} />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button 
                type="button"
                variants={buttonVariants} whileHover="hover" whileTap="tap"
                onClick={() => navigate('/profile')}
                className="flex-1 py-4 px-6 bg-[#0d0d0d] text-[#666666] hover:text-white rounded-2xl font-bold border border-[#2a2a2a] transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button 
                variants={buttonVariants} whileHover="hover" whileTap="tap"
                disabled={loading}
                className="flex-[2] py-4 px-6 bg-gradient-to-r from-[#00d084] to-[#00b870] text-white rounded-2xl font-bold shadow-[0_10px_25px_rgba(0,208,132,0.3)] hover:shadow-[0_15px_30px_rgba(0,208,132,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                type="submit"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EditProfile
