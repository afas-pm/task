import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import AuthContext from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  return user ? children : null
}

export default ProtectedRoute
