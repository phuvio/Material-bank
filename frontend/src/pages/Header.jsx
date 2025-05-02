import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserDropdown from '../components/UserDropdown'
import decodeToken from '../utils/decode'
import logo from '../images/Logo_300x.png'

const Header = ({ setIsLoggedIn }) => {
  const [role, setRole] = useState('')

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const decoded = await decodeToken()
        setRole(decoded?.role || '') // Ensure role is set correctly
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }

    fetchRole()
  }, [])

  return (
    <>
      <header className="header">
        <img src={logo} alt="Logo" />
        <nav>
          <Link to={'/'}>Materiaalit</Link>
          {(role === 'admin' || role === 'moderator') && (
            <Link to={'/tagit'}>Tagien hallinta</Link>
          )}
          {role === 'admin' && <Link to={'/kayttajat'}>Käyttäjähallinta</Link>}
        </nav>
        <div className="user-dropdown">
          <UserDropdown setIsLoggedIn={setIsLoggedIn} />
        </div>
      </header>
      <div className="horizontalLine"></div>
    </>
  )
}

export default Header
