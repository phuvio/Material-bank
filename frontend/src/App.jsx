import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
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
import Notification from './components/Notification'
import TagAdmin from './pages/TagAdmin'
import NewTag from './pages/NewTag'
import EditTag from './pages/EditTag'
import EditMaterial from './pages/EditMaterial'
import useNotification from './utils/useNotification'
import EditUser from './pages/EditUser'
import Header from './pages/Header'

const App = () => {
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
          <Header
            loggedInUser={loggedInUser}
            setIsLoggedIn={setIsLoggedIn}
            setLoggedInUser={setLoggedInUser}
          />
          <Routes>
            <Route
              path="/materials"
              element={
                <Main_page
                  loggedInUser={loggedInUser}
                  showNotification={showNotification}
                />
              }
            />
            <Route
              path="/materials/:id"
              element={
                <MaterialDetails
                  loggedInUser={loggedInUser}
                  onMaterialAdded={handleMaterialAdded}
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
              path="/edituser/:id"
              element={<EditUser showNotification={showNotification} />}
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
