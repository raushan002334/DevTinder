import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'
import { clearFeed } from '../utils/feedSlice'
import { clearConnections } from '../utils/connectionSlice'
import { clearRequests } from '../utils/requestSlice'
import { cn } from '../utils/cn'
import { buttonVariants, formVariants, pageVariants } from '../utils/animations'

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
  })
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/feed', { replace: true })
    }
  }, [navigate, user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = isLoginForm ? '/login' : '/signup'
      const payload = isLoginForm
        ? { emailId: formData.emailId, password: formData.password }
        : formData

      const res = await axios.post(`${BASE_URL}${endpoint}`, payload, {
        withCredentials: true,
      })
      dispatch(clearFeed())
      dispatch(clearConnections())
      dispatch(clearRequests())
      dispatch(addUser(res.data.data || res.data.user || res.data))
      navigate('/feed')
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0d0d0d] relative overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00d084]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <motion.div 
          className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#2a2a2a] p-8 rounded-3xl shadow-2xl"
          layout
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d084] to-[#00b870] mb-6 shadow-[0_0_20px_rgba(0,208,132,0.3)]"
            >
              <ArrowRight className="text-white" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLoginForm ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#a0a0a0]">
              {isLoginForm ? 'Ready to find your tech match?' : 'Join the elite developer community'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLoginForm && (
                <motion.div 
                  key="signup-fields"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider ml-1">First Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
                      <input
                        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20 transition-all font-medium"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider ml-1">Last Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
                      <input
                        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20 transition-all font-medium"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
                <input
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20 transition-all font-medium"
                  name="emailId"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.emailId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] group-focus-within:text-[#00d084] transition-colors" size={18} />
                <input
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-[#00d084] focus:ring-1 focus:ring-[#00d084]/20 transition-all font-medium"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex items-center gap-2 text-[#ff4458] bg-[#ff4458]/10 p-3.5 rounded-xl border border-[#ff4458]/20"
                >
                  <AlertCircle size={18} />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00d084] to-[#00b870] text-white py-4 rounded-xl font-bold shadow-[0_4px_20px_rgba(0,208,132,0.3)] hover:shadow-[0_6px_25px_rgba(0,208,132,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
              type="submit"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLoginForm ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center bg-[#0d0d0d] p-4 rounded-2xl border border-[#2a2a2a]">
            <p className="text-[#a0a0a0] text-sm font-medium">
              {isLoginForm ? "Don't have an account?" : 'Already a member?'}
              <button
                className="ml-2 text-[#00d084] hover:text-[#00b870] font-bold transition-colors"
                onClick={() => setIsLoginForm((prev) => !prev)}
              >
                {isLoginForm ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Login
