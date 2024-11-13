import { useNavigate } from 'react-router-dom'

const LogoutButton = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    window.localStorage.clear()
    setIsLoggedIn(false)
    navigate('/')
  }

  return <button onClick={handleClick}>Kirjaudu ulos</button>
}

export default LogoutButton
