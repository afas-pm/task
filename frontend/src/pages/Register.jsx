import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import API from '../utils/api'

const Register = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { name, email, password } = formData

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await API.post('/user/register', { name, email, password })
      toast.success(res.data.message || 'Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 selection:bg-[#D7263D] selection:text-white">
      <div className="w-full max-w-md bg-white border-4 border-[#0F0F0F] shadow-hard-lg animate-slide-up relative overflow-hidden">
        {/* Abstract Accent */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D7263D] -translate-x-16 translate-y-16 rotate-45 border-4 border-[#0F0F0F]"></div>

        <div className="bg-[#0F0F0F] p-10 text-left border-b-4 border-[#D7263D]">
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">Join</h2>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-[#D7263D]"></div>
            <p className="text-[#F9F6EE] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Operator Initialization</p>
          </div>
        </div>

        <div className="p-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]" htmlFor="name">
                Full Legal Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={onChange}
                className="w-full px-5 py-4 bg-[#F9F6EE] border-2 border-[#0F0F0F] text-sm font-black uppercase tracking-widest focus:bg-white focus:shadow-hard transition-all outline-none"
                placeholder="OPERATOR NAME"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]" htmlFor="email">
                Comm Channel (Email)
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
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]" htmlFor="password">
                Secure Key (Pass)
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={onChange}
                className="w-full px-5 py-4 bg-[#F9F6EE] border-2 border-[#0F0F0F] text-sm font-black uppercase tracking-widest focus:bg-white focus:shadow-hard transition-all outline-none"
                placeholder="MIN 6 CHARS"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D7263D] text-white font-black uppercase italic tracking-[0.25em] text-sm py-5 border-2 border-[#0F0F0F] shadow-hard hover:bg-[#0F0F0F] hover:shadow-hard-red active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed group mt-4 relative z-10"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 bg-white animate-bounce"></span>
                  ENCRYPTING...
                </span>
              ) : 'INITIALIZE'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t-2 border-[#F9F6EE] text-left">
            <p className="text-[#0F0F0F] text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Existing Operator?</p>
            <Link to="/login" className="text-xl font-black italic tracking-tighter text-[#0F0F0F] hover:text-[#D7263D] transition-colors border-b-4 border-transparent hover:border-[#D7263D] pb-1">
              LINK ESTABLISHED ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register