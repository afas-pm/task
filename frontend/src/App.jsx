import React, { useContext } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NotFound from './pages/NotFound.jsx'

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#F9F6EE] text-[#0F0F0F] font-sans flex flex-col selection:bg-[#D7263D] selection:text-white">
          <Navbar />

          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
