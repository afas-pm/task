import React, { useContext } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import Settings from './pages/Settings.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes enclosed in Layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard view="overview" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/today" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard view="today" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Layout>
                    <CalendarPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
