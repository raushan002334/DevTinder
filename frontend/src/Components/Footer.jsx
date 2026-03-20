import { Github, Twitter, Linkedin, Heart, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { buttonVariants } from '../utils/animations'

const Footer = () => {
  return (
    <footer className="w-full bg-[#0d0d0d] border-t border-[#1a1a1a] pt-16 pb-8 px-6 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/feed" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-[#00d084] to-[#00b870] p-1.5 rounded-lg">
                <Flame size={20} className="text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#00d084] transition-colors">
                DevTinder
              </span>
            </Link>
            <p className="text-[#666666] text-sm leading-relaxed max-w-sm">
              The premium networking platform for developers to find their next tech match, collaborator, or friend. Built by devs, for devs.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:text-[#00d084] hover:border-[#00d084]/30 transition-all shadow-sm"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wider text-xs uppercase">Platform</h4>
            <ul className="space-y-3 text-[#666666] text-sm font-medium">
              <li><Link to="/feed" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Discover</Link></li>
              <li><Link to="/requests" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Requests</Link></li>
              <li><Link to="/connections" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Network</Link></li>
              <li><Link to="/profile" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Profile Settings</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wider text-xs uppercase">Community</h4>
            <ul className="space-y-3 text-[#666666] text-sm font-medium">
              <li><a href="#" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Guidelines</a></li>
              <li><a href="#" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Support</a></li>
              <li><a href="#" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:text-[#00d084] transition-colors underline-offset-4 hover:underline">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a1a1a] gap-4">
          <p className="text-[#444444] text-xs font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} DevTinder Inc.
          </p>
          <div className="flex items-center gap-1.5 text-[#444444] text-[10px] font-black uppercase tracking-widest">
            Made with <Heart size={10} className="text-[#ff4458] fill-current" /> for the Dev Community
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
