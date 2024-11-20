import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import axios from 'axios'
import Main_page from './pages/Main_page'
import MaterialDetails from './pages/MaterialDetails'
import Users from './pages/Users'
import NewUser from './pages/NewUser'
import apiUrl from './config/config'
import NewMaterial from './pages/NewMaterial'
import LoginForm from './pages/LoginForm'
import LogoutButton from './components/Logout_button'

const App = () => {
  const [materials, setMaterials] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState({})
  const [reloadTrigger, setReloadTrigger] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const savedLoggedInUser = window.localStorage.getItem('loggedInUser')
    if (savedLoggedInUser) {
      setIsLoggedIn(true)
      setLoggedInUser(JSON.parse(savedLoggedInUser))
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${apiUrl}/api/materials`)
        .then((response) => {
          console.log('Api response:', response.data)
          setMaterials(response.data)
        })
        .catch((error) => {
          console.log('Error fetching data:', error)
        })
    }
  }, [isLoggedIn, reloadTrigger])

  const handleLoginForm = (loggedInUser) => {
    setIsLoggedIn(true)
    setLoggedInUser(loggedInUser)
    window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    navigate('/')
  }

  const handleMaterialAdded = () => {
    setReloadTrigger((prev) => !prev) // toggle to trigger re-fetch
  }

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginForm} />
  }

  return (
    <div>
      <div>
        <Link to={'/'}>Materiaalit</Link>
        {loggedInUser.role === 1 && <Link to={'/users'}>Käyttäjähallinta</Link>}
        <LogoutButton
          setIsLoggedIn={setIsLoggedIn}
          setLoggedInUser={setLoggedInUser}
        />
      </div>
      <Routes>
        <Route
          path="/materials"
          element={<Main_page materials={materials} />}
        />
        <Route path="/materials/:id" element={<MaterialDetails />} />
        <Route path="/" element={<Navigate to="/materials" replace={true} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route
          path="/newmaterial"
          element={
            <NewMaterial
              loggedInUser={loggedInUser}
              onMaterialAdded={handleMaterialAdded}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
