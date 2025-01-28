import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import decodeToken from '../utils/decode'

const UserDropdown = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()
  const userId = decodeToken().user_id
  const userName = decodeToken().fullname
  const [selectedOption, setSelectedOption] = useState('')

  const handleOptionChange = (option) => {
    setSelectedOption('')
    if (option === 'changePassword') {
      navigate(`/vaihdasalasana/${userId}`)
    } else if (option === 'logout') {
      window.localStorage.clear()
      setIsLoggedIn(false)
      navigate('/')
    }
  }

  return (
    <div className="user-dropdown">
      <select
        className="user-dropdown-select"
        onChange={(e) => {
          handleOptionChange(e.target.value)
        }}
        value={selectedOption}
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
