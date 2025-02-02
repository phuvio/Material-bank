import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/login'

const LogoutButton = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    window.localStorage.clear()
    logout()
    setIsLoggedIn(false)
    navigate('/')
  }

  return <button onClick={handleClick}>Kirjaudu ulos</button>
}

export default LogoutButton
