import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userIcon from '../images/user.png'

const UserDropdown = ({ loggedInUser, setIsLoggedIn, setLoggedInUser }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const userId = loggedInUser.user_id

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option) => {
    if (option === 'changePassword') {
      navigate(`/changepassword/${userId}`)
    } else if (option === 'logout') {
      window.localStorage.clear()
      setIsLoggedIn(false)
      setLoggedInUser({})
      navigate('/')
    }
  }

  return (
    <div className="user-dropdown">
      <button
        className="user-icon"
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <img src={userIcon} alt="User icon" className="user-avatar"></img>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button
            className="dropdown-item"
            onClick={() => handleOptionClick('changePassword')}
          >
            Vaihda salasana
          </button>
          <button
            className="dropdown-item"
            onClick={() => handleOptionClick('logout')}
          >
            Kirjaudu ulos
          </button>
        </div>
      )}
    </div>
  )
}

export default UserDropdown
