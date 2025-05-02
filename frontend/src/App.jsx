import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import routesConfig from './config/RoutesConfig'
import PrivateRoute from './components/PrivateRoute'
import Notification from './components/Notification'
import Header from './pages/Header'
import useNotification from './utils/useNotification'
import LoginForm from './pages/LoginForm'
import loginService from './services/login'
import NotFoundPage from './pages/NotFoundPage'
import decodeToken from './utils/decode'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('accessToken') !== null
  })
  const [decodedToken, setDecodedToken] = useState({})

  const { message, type, showNotification } = useNotification()

  const navigate = useNavigate()

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const newAccessToken = await loginService.refreshToken()

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken)

          setIsLoggedIn(true)
          const tokenData = decodeToken(newAccessToken)

          setDecodedToken(tokenData)
        } else {
          logout()
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
        logout()
      }
    }

    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      setIsLoggedIn(true)
      setDecodedToken(decodeToken(storedToken))
      refreshToken()
    }
  }, [])

  const onLoginSuccess = (newAccessToken) => {
    localStorage.setItem('accessToken', newAccessToken)
    setIsLoggedIn(true)

    const tokenData = decodeToken(newAccessToken)
    setDecodedToken(tokenData)

    navigate('/materiaalit')
  }

  const logout = () => {
    localStorage.clear()
    if (isLoggedIn) setIsLoggedIn(false)
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
                        token={decodedToken}
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
            <Route path="*" element={<NotFoundPage />} />
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
