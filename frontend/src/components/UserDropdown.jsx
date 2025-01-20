import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserDropdown = ({ loggedInUser, setIsLoggedIn, setLoggedInUser }) => {
  const navigate = useNavigate()
  const userId = loggedInUser.user_id
  const userName = loggedInUser.fullname

  const handleOptionChange = (event) => {
    const option = event.target.value
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
      <select
        className="user-dropdown-select"
        onChange={handleOptionChange}
        defaultValue=""
        title={`Kirjautuneena: ${userName}`}
        style={{ width: '150px' }}
      >
        <option value="" disabled hidden>
          {userName}
        </option>
        <option value="changePassword">Vaihda salasana</option>
        <option value="logout">Kirjaudu ulos</option>
      </select>
    </div>
  )
}

export default UserDropdown
