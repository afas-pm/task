import React, { useContext } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
// REMOVED BROKEN LIBRARY: import { ToastContainer } from 'react-toastify'
// REMOVED BROKEN LIBRARY: import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NotFound from './pages/NotFound.jsx'

// INLINED NAVBAR TO AVOID IMPORT ISSUES
const SimpleNavbar = () => {
  const context = useContext(AuthContext)
  const user = context ? context.user : null
  const logout = context ? context.logout : () => { }
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 tracking-tight">
              TaskFlow
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium hidden sm:block">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
          {/* Use the inlined Navbar */}
          <SimpleNavbar />

          <main className="flex-1 w-full max-w-5xl mx-auto p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* CORRECTED: Dashboard is now at /dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Redirect / to /dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {/* Custom Toast Rendered in Provider */}
        </div>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
