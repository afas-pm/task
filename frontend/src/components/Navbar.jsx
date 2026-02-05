import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0F0F0F] border-b-[6px] border-[#D7263D] px-6 py-4 flex justify-between items-center animate-fade-in shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <Link to="/" className="group flex items-center gap-3 active:scale-95 transition-all">
          <div className="w-14 h-14 bg-[#D7263D] flex items-center justify-center border-4 border-[#F9F6EE] shadow-hard group-hover:rotate-12 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F9F6EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-3xl font-black tracking-tighter text-[#F9F6EE] uppercase italic leading-none group-hover:text-[#D7263D] transition-colors">Task-X</span>
            <span className="text-[8px] font-black text-[#D7263D] tracking-[0.5em] uppercase opacity-80">Mission Control</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-10">
        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D7263D] animate-pulse"></span>
                <span className="text-[10px] font-black text-[#D7263D] uppercase tracking-widest leading-none">Status: Active</span>
              </div>
              <span className="text-xl font-black text-[#F9F6EE] italic uppercase tracking-tighter leading-none mt-1">
                Op. {user.name.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-8 py-4 bg-[#D7263D] text-[#F9F6EE] font-black uppercase italic tracking-widest text-xs border-2 border-[#F9F6EE] shadow-hard hover:bg-[#F9F6EE] hover:text-[#D7263D] hover:shadow-hard-red transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              DISCONNECT
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[#F9F6EE] font-black hover:text-[#D7263D] transition-colors tracking-tighter uppercase italic text-lg border-b-4 border-transparent hover:border-[#D7263D] pb-1">
              LOGIN
            </Link>
            <Link
              to="/register"
              className="px-10 py-4 bg-[#F9F6EE] text-[#0F0F0F] font-black border-2 border-[#D7263D] shadow-hard hover:bg-[#D7263D] hover:text-[#F9F6EE] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest italic text-xs"
            >
              INITIALIZE
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

Navbar.displayName = 'Navbar'
export default Navbar