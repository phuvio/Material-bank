import React from 'react'
import { useNavigate } from 'react-router-dom'

const LogoutButton = ({ setIsLoggedIn, setLoggedInUser }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    window.localStorage.clear()
    setIsLoggedIn(false)
    setLoggedInUser({})
    navigate('/')
  }

  return <button onClick={handleClick}>Kirjaudu ulos</button>
}

export default LogoutButton
