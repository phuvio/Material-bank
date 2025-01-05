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
      console.log('Login response:', response)
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
      console.log(exception)
    }
  }

  return (
    <div>
      <h1>
        Sisäänkirjautuminen:
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Käyttäjätunnus:</label>
          <input
            type="text"
            id="username"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <label htmlFor="password">Salasana:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />

          <button type="submit">Kirjaudu sisään</button>
        </form>
      </h1>
    </div>
  )
}

export default Login
