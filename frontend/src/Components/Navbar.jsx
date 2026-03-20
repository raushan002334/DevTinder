import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, 
  User, 
  Users, 
  Heart, 
  Settings, 
  Menu, 
  X,
  Flame
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { removeUser } from '../utils/userSlice'
import { clearFeed } from '../utils/feedSlice'
import { clearConnections } from '../utils/connectionSlice'
import { clearRequests } from '../utils/requestSlice'
import { cn } from '../utils/cn'
import { buttonVariants } from '../utils/animations'

const Navbar = () => {
  const user = useSelector((store) => store.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true })
      dispatch(removeUser())
      dispatch(clearFeed())
      dispatch(clearConnections())
      dispatch(clearRequests())
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  const navLinks = [
    { name: 'Feed', path: '/feed', icon: Flame },
    { name: 'Requests', path: '/requests', icon: Heart },
    { name: 'Connections', path: '/connections', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-[#0d0d0d]/80 backdrop-blur-md border-[#2a2a2a] py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link to="/feed" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-[#00d084] to-[#00b870] p-1.5 rounded-lg shadow-[0_0_15px_rgba(0,208,132,0.3)] group-hover:shadow-[0_0_20px_rgba(0,208,132,0.5)] transition-all">
              <Flame size={24} className="text-white fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#00d084] to-[#00b870] bg-clip-text text-transparent">
              DevTinder
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {user && navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={cn(
                "relative text-sm font-medium transition-colors hover:text-[#00d084]",
                location.pathname === link.path ? "text-[#00d084]" : "text-[#a0a0a0]"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00d084] rounded-full"
                />
              )}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4 border-l border-[#2a2a2a] pl-8">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate('/profile')}
                className="relative group"
              >
                <div className="w-10 h-10 rounded-full border-2 border-[#2a2a2a] overflow-hidden group-hover:border-[#00d084] transition-all shadow-lg">
                  <img 
                    src={user.photoURL || "https://vectorified.com/images/default-user-icon-33.jpg"} 
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00d084] border-2 border-[#0d0d0d] rounded-full shadow-[0_0_5px_rgba(0,208,132,0.5)]" />
              </motion.button>
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleLogout}
                className="p-2 text-[#a0a0a0] hover:text-[#ff4458] transition-colors rounded-lg hover:bg-[#ff4458]/10"
                title="Logout"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          ) : (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/login" 
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00d084] to-[#00b870] text-white text-sm font-semibold shadow-[0_4px_15px_rgba(0,208,132,0.3)] hover:shadow-[0_6px_20px_rgba(0,208,132,0.4)] transition-all"
              >
                Sign In
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#a0a0a0] hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[51] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#1a1a1a] z-[52] p-6 shadow-2xl border-r border-[#2a2a2a] md:hidden"
            >
              <div className="flex items-center gap-3 mb-10">
                <Flame size={28} className="text-[#00d084]" />
                <span className="text-xl font-bold text-white">DevTinder</span>
              </div>

              <div className="flex flex-col gap-6">
                {user && navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-lg transition-colors py-2",
                      location.pathname === link.path ? "text-[#00d084]" : "text-[#a0a0a0] hover:text-white"
                    )}
                  >
                    <link.icon size={22} />
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-10 left-6 right-6 pt-6 border-t border-[#2a2a2a]">
                {user ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.photoURL || "https://vectorified.com/images/default-user-icon-33.jpg"} 
                        alt={user.firstName}
                        className="w-12 h-12 rounded-full border border-[#2a2a2a] object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-[#a0a0a0] text-xs">Premium Member</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 text-[#ff4458] hover:opacity-80 transition-opacity font-medium py-2"
                    >
                      <LogOut size={22} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-[#00d084] text-white font-bold"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
