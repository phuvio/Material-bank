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
import EditMaterial from './pages/EditMaterial'
import useNotification from './utils/useNotification'

const App = () => {
  const [materials, setMaterials] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState({})
  const [materialsReloaded, setMaterialsReloaded] = useState(false)

  const { message, type, showNotification } = useNotification()

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
          const sortedMaterials = initialMaterials.sort((a, b) =>
            a.name > b.name ? 1 : -1
          )
          setMaterials(sortedMaterials)
        })
        .catch((error) => {
          console.log('Error fetching data:', error)
          showNotification('Virhe haettaessa materiaaleja.', 'error', 3000)
        })
    }
  }, [isLoggedIn, materialsReloaded])

  const handleLoginForm = (loggedInUser) => {
    setIsLoggedIn(true)
    setLoggedInUser(loggedInUser)
    window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    navigate('/')
  }

  const handleMaterialAdded = () => {
    setMaterialsReloaded((prev) => !prev) // toggle to trigger re-fetch
  }

  return (
    <div>
      {message && <Notification message={message} type={type} />}

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
            <Route
              path="/materials/:id"
              element={
                <MaterialDetails
                  loggedInUser={loggedInUser}
                  showNotification={showNotification}
                />
              }
            />
            <Route
              path="/"
              element={<Navigate to="/materials" replace={true} />}
            />
            <Route
              path="/users"
              element={isLoggedIn ? <Users /> : <Navigate to="/login" />}
            />
            <Route
              path="/newuser"
              element={<NewUser showNotification={showNotification} />}
            />
            <Route
              path="/newmaterial"
              element={
                <NewMaterial
                  loggedInUser={loggedInUser}
                  onMaterialAdded={handleMaterialAdded}
                  showNotification={showNotification}
                />
              }
            />
            <Route
              path="/editmaterial/:id"
              element={
                <EditMaterial
                  onMaterialAdded={handleMaterialAdded}
                  showNotification={showNotification}
                />
              }
            />
            <Route
              path="/tagadmin"
              element={<TagAdmin showNotification={showNotification} />}
            />
            <Route
              path="/tags/:id"
              element={<EditTag showNotification={showNotification} />}
            />
            <Route
              path="/newtag"
              element={<NewTag showNotification={showNotification} />}
            />
          </Routes>
        </div>
      ) : (
        <LoginForm
          onLoginSuccess={handleLoginForm}
          showNotification={showNotification}
        />
      )}
    </div>
  )
}

export default App
