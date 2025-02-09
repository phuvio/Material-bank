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

  const { message, type, showNotification } = useNotification()

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      refreshToken()
    }
  }, [])

  const refreshToken = async () => {
    try {
      const newAccessToken = await loginService.refreshToken()

      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken)
        setIsLoggedIn(true)
      } else {
        logout()
      }
    } catch (error) {
      console.log('Error refreshing token:', error)
      logout()
    }
  }

  useEffect(() => {
    let refreshAccessTokenTimerId
    const decodedToken = decodeToken()

    if (!decodedToken || !decodedToken.exp) {
      console.error('Token decoding failed or missing exp')
      return
    }

    const expiresInMs = decodedToken.exp * 1000 - Date.now()

    if (expiresInMs <= 0) {
      console.warn('Token already expired')
      return
    }

    refreshAccessTokenTimerId = setTimeout(
      () => {
        refreshToken()
      },
      expiresInMs - 10 * 1000
    ) // Refresh 10 seconds before expiration

    return () => {
      if (refreshAccessTokenTimerId) {
        clearTimeout(refreshAccessTokenTimerId)
      }
    }
  }, [refreshToken])

  const onLoginSuccess = () => {
    setIsLoggedIn(true)
    navigate('/')
  }

  const logout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
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
