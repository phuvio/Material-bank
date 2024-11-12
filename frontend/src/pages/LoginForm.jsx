import { useState } from 'react'
import loginService from '../services/login'

const Login = ({ onLoginSuccess }) => {
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
        const loggedInUser = response.data
        console.log('LoggedInUser in front:', loggedInUser)
        onLoginSuccess(loggedInUser)
      }
      setUsername('')
      setPassword('')
    } catch (exception) {
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
    </div>
  )
}

export default Login
