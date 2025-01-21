import React from 'react'
import { Link } from 'react-router-dom'
import UserDropdown from '../components/UserDropdown'
import logo from '../images/Logo_300x.png'

const Header = ({ loggedInUser, setIsLoggedIn, setLoggedInUser }) => {
  return (
    <>
      <header className="header">
        <img src={logo} alt="Logo" />
        <nav>
          <Link to={'/'}>Materiaalit</Link>
          {loggedInUser.role === 'admin' && (
            <>
              <Link to={'/users'}>Käyttäjähallinta</Link>
              <Link to={'/tagadmin'}>Tagien hallinta</Link>
            </>
          )}
        </nav>
        <div className="user-dropdown">
          <UserDropdown
            loggedInUser={loggedInUser}
            setIsLoggedIn={setIsLoggedIn}
            setLoggedInUser={setLoggedInUser}
          />
        </div>
      </header>
      <div className="horizontalLine"></div>
    </>
  )
}

export default Header
