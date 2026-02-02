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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-red-100">Login to your TaskFlow account</p>
        </div>

        <div className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
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
                placeholder="hello@example.com"
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
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-bold transition-colors">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

Login.displayName = 'LoginComponent'
export default Login
