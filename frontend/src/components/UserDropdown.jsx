import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import decodeToken from '../utils/decode'

const UserDropdown = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ userId: null, fullname: '' })

  useEffect(() => {
    const decodedToken = decodeToken()
    if (decodedToken) {
      localStorage.setItem('fullname', decodedToken.fullname)
      setUser({ userId: decodedToken.user_id, fullname: decodedToken.fullname })
    } else {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    const savedFullname = localStorage.getItem('fullname')
    if (savedFullname) {
      setUser((prevUser) => ({ ...prevUser, fullname: savedFullname }))
    }
  }, [])

  const handleOptionChange = (option) => {
    if (option === 'changePassword') {
      navigate(`/vaihdasalasana/${user.userId}`)
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
        name="userOptions"
        id="user-dropdown"
        onChange={(e) => {
          handleOptionChange(e.target.value)
        }}
        value={''}
        title={`Kirjautuneena: ${user.fullname}`}
        style={{ width: '150px' }}
      >
        <option value="" disabled hidden>
          {user.fullname}
        </option>
        <option value="changePassword">Vaihda salasana</option>
        <option value="logout">Kirjaudu ulos</option>
      </select>
    </div>
  )
}

export default UserDropdown
