import axios from 'axios'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import { addUser, removeUser } from '../utils/userSlice'
import { clearFeed } from '../utils/feedSlice'
import { clearConnections } from '../utils/connectionSlice'
import { clearRequests } from '../utils/requestSlice'

const Body = () => {
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)
  const [authLoading, setAuthLoading] = useState(true)
  const location = useLocation()
  
  const isLoginPage = location.pathname === '/login'

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        })
        dispatch(addUser(res.data))
      } catch {
        dispatch(removeUser())
        dispatch(clearFeed())
        dispatch(clearConnections())
        dispatch(clearRequests())
      } finally {
        setTimeout(() => setAuthLoading(false), 800) // Smooth transition
      }
    }

    fetchUser()
  }, [dispatch])

  if (authLoading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center gap-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <Loader2 className="w-16 h-16 text-[#00d084] animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-[#00d084]/20 animate-pulse" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#a0a0a0] font-bold tracking-[0.2em] uppercase text-xs"
        >
          DevTinder is initializing
        </motion.p>
      </div>
    )
  }

  if (!user && !isLoginPage) {
    return <Navigate to="/login" replace />
  }

  if (user && isLoginPage) {
    return <Navigate to="/feed" replace />
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col font-sans selection:bg-[#00d084]/30 selection:text-white">
      {!isLoginPage && <Navbar />}
      
      <main className={isLoginPage ? "" : "flex-1 w-full"}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!isLoginPage && <Footer />}

      {/* Global Background Glows */}
      {!isLoginPage && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00d084]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#3b82f6]/5 rounded-full blur-[150px]" />
        </div>
      )}
    </div>
  )
}

export default Body
