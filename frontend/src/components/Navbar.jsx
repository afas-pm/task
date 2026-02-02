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

  const navStyle = {
    background: '#333',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const linkStyle = {
    color: '#fff',
    marginRight: '1rem',
    textDecoration: 'none',
    fontWeight: 'bold'
  }

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={linkStyle}>Task App</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{ padding: '5px 10px', cursor: 'pointer', background: 'red', color: 'white', border: 'none' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

Navbar.displayName = 'Navbar'
export default Navbar