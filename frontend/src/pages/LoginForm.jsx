import React, { useState } from 'react'
import loginService from '../services/login'

const Login = ({ onLoginSuccess, showNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await loginService.login({
        username,
        password,
      })

      if (response && response.status === 200 && response.data?.accessToken) {
        const { accessToken } = response.data

        window.localStorage.setItem('accessToken', accessToken)
        onLoginSuccess(accessToken)
      } else {
        console.error('Error logging in:', response)
        showNotification('Väärä käyttäjätunnus tai salasana', 'error', 3000)
      }
    } catch (error) {
      showNotification('Väärä käyttäjätunnus tai salasana', 'error', 3000)
    } finally {
      setLoading(false)
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className="container">
      <h1>Sisäänkirjautuminen:</h1>

      {loading && <p>Yhdistetään palvelimeen...</p>}

      <form onSubmit={handleLogin}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="username">Käyttäjätunnus:</label>
          </div>
          <div className="col-75">
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              autoComplete="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="password">Salasana:</label>
          </div>
          <div className="col-75">
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              autoComplete="current-password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
        </div>
        <div className="row">
          <button type="submit" data-testid="login-button">
            Kirjaudu sisään
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
