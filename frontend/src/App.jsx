import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import routesConfig from './config/RoutesConfig'
import PrivateRoute from './components/PrivateRoute'
import Notification from './components/Notification'
import Header from './pages/Header'
import useNotification from './utils/useNotification'
import LoginForm from './pages/LoginForm'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { message, type, showNotification } = useNotification()

  const navigate = useNavigate()

  const onLoginSuccess = () => {
    setIsLoggedIn(true)
    navigate('/')
  }

  return (
    <div className="main_container">
      {message && <Notification message={message} type={type} />}

      {isLoggedIn ? (
        <div>
          <Header setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            {routesConfig.map(
              ({ path, element: Element, requiredRoles, to }) =>
                to ? (
                  <Route
                    key={path}
                    path={path}
                    element={<Navigate to={to} replace />}
                  />
                ) : requiredRoles ? (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <PrivateRoute
                        element={
                          <Element showNotification={showNotification} />
                        }
                        requiredRoles={requiredRoles}
                      />
                    }
                  />
                ) : (
                  <Route
                    key={path}
                    path={path}
                    element={<Element showNotification={showNotification} />}
                  />
                )
            )}
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
