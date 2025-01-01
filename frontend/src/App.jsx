import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import Main_page from './pages/Main_page'
import MaterialDetails from './pages/MaterialDetails'
import Users from './pages/Users'
import NewUser from './pages/NewUser'
import NewMaterial from './pages/NewMaterial'
import LoginForm from './pages/LoginForm'
import LogoutButton from './components/Logout_button'
import materialService from './services/materials'
import Notification from './components/Notification'
import TagAdmin from './pages/TagAdmin'
import NewTag from './pages/NewTag'
import EditTag from './pages/EditTag'

const App = () => {
  const [materials, setMaterials] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState({})
  const [materialsReloaded, setMaterialsReloaded] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('message')
  const [notificationTimeout, setNotificationTimeout] = useState(0)

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
      materialService
        .getAll()
        .then((initialMaterials) => {
          setMaterials(initialMaterials)
        })
        .catch((error) => {
          console.log('Error fetching data:', error)
          setNotificationMessage('Virhe haettaessa materiaaleja.')
          setNotificationType('error')
          setNotificationTimeout(3000)
        })
    }
  }, [isLoggedIn, materialsReloaded])

  useEffect(() => {
    if (notificationTimeout > 0) {
      const timer = setTimeout(() => {
        setNotificationMessage(null)
      }, notificationTimeout)
      return () => clearTimeout(timer)
    }
  }, [notificationTimeout])

  const handleLoginForm = (loggedInUser) => {
    setIsLoggedIn(true)
    setLoggedInUser(loggedInUser)
    window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    navigate('/')
  }

  const handleMaterialAdded = () => {
    setMaterialsReloaded((prev) => !prev) // toggle to trigger re-fetch
    setNotificationMessage('Materiaali lisätty.')
    setNotificationType('message')
    setNotificationTimeout(2000)
  }

  const handleCloseNotification = () => {
    setNotificationMessage(null)
  }

  return (
    <div>
      {notificationMessage && (
        <Notification
          message={notificationMessage}
          timeout={notificationTimeout}
          type={notificationType}
          onClose={handleCloseNotification}
        />
      )}

      {isLoggedIn ? (
        <div>
          <div>
            <Link to={'/'}>Materiaalit</Link>
            {loggedInUser.role === 1 && (
              <>
                <Link to={'/users'}>Käyttäjähallinta</Link>
                <Link to={'/tagadmin'}>Tagien hallinta</Link>
              </>
            )}
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
            <Route
              path="/"
              element={<Navigate to="/materials" replace={true} />}
            />
            <Route
              path="/users"
              element={isLoggedIn ? <Users /> : <Navigate to="/login" />}
            />
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
            <Route path="/tagadmin" element={<TagAdmin />} />
            <Route path="/tags/:id" element={<EditTag />} />
            <Route path="/newtag" element={<NewTag />} />
          </Routes>
        </div>
      ) : (
        <LoginForm onLoginSuccess={handleLoginForm} />
      )}
    </div>
  )
}

export default App
