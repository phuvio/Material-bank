import React from 'react'
import { Link } from 'react-router-dom'
import UserDropdown from '../components/UserDropdown'
import decodeToken from '../utils/decode'
import logo from '../images/Logo_300x.png'

const Header = ({ setIsLoggedIn }) => {
  return (
    <>
      <header className="header">
        <img src={logo} alt="Logo" />
        <nav>
          <Link to={'/'}>Materiaalit</Link>
          {decodeToken().role === 'admin' && (
            <>
              <Link to={'/kayttajat'}>Käyttäjähallinta</Link>
              <Link to={'/tagit'}>Tagien hallinta</Link>
            </>
          )}
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
