import React, { useState } from 'react'
import loginService from '../services/login'

const Login = ({ onLoginSuccess, showNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const response = await loginService.login({
        username,
        password,
      })

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data

        window.localStorage.setItem('accessToken', accessToken)
        window.localStorage.setItem('refreshToken', refreshToken)
        onLoginSuccess(accessToken, refreshToken)
      } else {
        console.log('Error logging in:', response)
        showNotification('Väärä käyttäjätunnus tai salasana', 'error', 3000)
        setUsername('')
        setPassword('')
      }
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        showNotification('Väärä käyttäjätunnus tai salasana', 'error', 3000)
      } else {
        showNotification('Virhe kirjautumisessa', 'error', 3000)
      }

      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className="container">
      <h1>Sisäänkirjautuminen:</h1>
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
