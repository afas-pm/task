import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import API from '../utils/api'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { email, password } = formData

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await API.post('/user/login', { email, password })
      if (res.data.token) {
        const userData = res.data.user || { email: res.data.email, name: res.data.name }
        login(res.data.token, userData)
        toast.success(res.data.message || 'Welcome back! Logged in successfully.')
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 selection:bg-[#D7263D] selection:text-white">
      <div className="w-full max-w-md bg-white border-4 border-[#0F0F0F] shadow-hard-lg animate-slide-up relative overflow-hidden">
        {/* Abstract Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D7263D] translate-x-16 -translate-y-16 rotate-45 border-4 border-[#0F0F0F]"></div>

        <div className="bg-[#0F0F0F] p-10 text-left border-b-4 border-[#D7263D]">
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">Login</h2>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-[#D7263D]"></div>
            <p className="text-[#F9F6EE] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Authentication Required</p>
          </div>
        </div>

        <div className="p-10">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]" htmlFor="email">
                Access Identifier (Email)
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={onChange}
                className="w-full px-5 py-4 bg-[#F9F6EE] border-2 border-[#0F0F0F] text-sm font-black uppercase tracking-widest focus:bg-white focus:shadow-hard transition-all outline-none"
                placeholder="ID@DOMAIN.COM"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]" htmlFor="password">
                Secure Key (Password)
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={onChange}
                className="w-full px-5 py-4 bg-[#F9F6EE] border-2 border-[#0F0F0F] text-sm font-black uppercase tracking-widest focus:bg-white focus:shadow-hard transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F0F0F] text-white font-black uppercase italic tracking-[0.25em] text-sm py-5 border-2 border-[#0F0F0F] shadow-hard hover:bg-[#D7263D] hover:shadow-hard-red active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed group mt-4 relative z-10"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 bg-[#D7263D] animate-bounce"></span>
                  SYNCHRONIZING...
                </span>
              ) : 'ESTABLISH LINK'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t-2 border-[#F9F6EE] text-left">
            <p className="text-[#0F0F0F] text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Unrecognized Operator?</p>
            <Link to="/register" className="text-xl font-black italic tracking-tighter text-[#D7263D] hover:text-[#0F0F0F] transition-colors border-b-4 border-transparent hover:border-[#0F0F0F] pb-1">
              INITIALIZE NEW ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

Login.displayName = 'LoginComponent'
export default Login
