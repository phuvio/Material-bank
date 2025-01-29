import React, { useState } from 'react'
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
import ChangePassword from './pages/ChangePassword'
import Header from './pages/Header'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [materialsReloaded, setMaterialsReloaded] = useState(false)

  const { message, type, showNotification } = useNotification()

  const navigate = useNavigate()

  const onLoginSuccess = () => {
    setIsLoggedIn(true)
    navigate('/')
  }

  const handleMaterialAdded = () => {
    setMaterialsReloaded((prev) => !prev) // toggle to trigger re-fetch
  }

  return (
    <div className="main_container">
      {message && <Notification message={message} type={type} />}

      {isLoggedIn ? (
        <div>
          <Header setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route
              path="/materiaalit"
              element={<Main_page showNotification={showNotification} />}
            />
            <Route
              path="/materiaalit/:id"
              element={
                <MaterialDetails
                  onMaterialAdded={handleMaterialAdded}
                  showNotification={showNotification}
                />
              }
            />
            <Route
              path="/"
              element={<Navigate to="/materiaalit" replace={true} />}
            />
            <Route
              path="/vaihdasalasana/:id"
              element={<ChangePassword showNotification={showNotification} />}
            />
            <Route
              path="/kayttajat"
              element={isLoggedIn ? <Users /> : <Navigate to="/login" />}
            />
            <Route
              path="/muokkaakayttajaa/:id"
              element={<EditUser showNotification={showNotification} />}
            />
            <Route
              path="/uusikayttaja"
              element={<NewUser showNotification={showNotification} />}
            />
            <Route
              path="/uusimateriaali"
              element={
                <NewMaterial
                  onMaterialAdded={handleMaterialAdded}
                  showNotification={showNotification}
                />
              }
            />
            <Route
              path="/muokkaamateriaalia/:id"
              element={
                <EditMaterial
                  onMaterialAdded={handleMaterialAdded}
                  showNotification={showNotification}
                />
              }
            />
            <Route
              path="/tagit"
              element={<TagAdmin showNotification={showNotification} />}
            />
            <Route
              path="/tagit/:id"
              element={<EditTag showNotification={showNotification} />}
            />
            <Route
              path="/uusitagi"
              element={<NewTag showNotification={showNotification} />}
            />
          </Routes>
        </div>
      ) : (
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          showNotification={showNotification}
        />
      )}
    </div>
  )
}

export default App
