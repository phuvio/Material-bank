import React, { useState } from 'react'
import loginService from '../services/login'

const Login = ({
  onLoginSuccess,
  notificationMessage,
  setNotificationMessage,
}) => {
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
        const loggedInUser = response.data.loggedInUser
        const token = response.data.token

        window.localStorage.setItem(
          'loggedInUser',
          JSON.stringify(loggedInUser)
        )
        window.localStorage.setItem('token', token)
        onLoginSuccess(loggedInUser)
      } else {
        setNotificationMessage('Väärä käyttäjätunnus tai salasana')
        setUsername('')
        setPassword('')
      }
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        setNotificationMessage('Väärä käyttäjätunnus tai salasana')
      } else {
        setNotificationMessage('Virhe kirjautumisessa')
      }

      setUsername('')
      setPassword('')
      console.log(exception)
    }
  }

  return (
    <div>
      <h1>
        Sisäänkirjautuminen:
        <form onSubmit={handleLogin}>
          <label>
            Käyttäjätunnus:
            <input
              type="text"
              value={username}
              name="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
          <label>
            Salasana:
            <input
              type="password"
              value={password}
              name="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
          <button type="submit">Kirjaudu sisään</button>
        </form>
      </h1>

      {notificationMessage && (
        <Notification
          message={notificationMessage}
          type="error"
          timeout={3000}
          onClose={() => setNotificationMessage('')}
        />
      )}
    </div>
  )
}

export default Login
