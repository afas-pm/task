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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gray-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-600 rounded-full opacity-20 blur-xl"></div>
          <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Join TaskFlow</h2>
          <p className="text-gray-400 relative z-10">Start organizing your life today</p>
        </div>

        <div className="p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-800"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-800"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-800"
                placeholder="Min 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 hover:text-red-600 font-bold transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register