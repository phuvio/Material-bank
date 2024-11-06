import { useState } from 'react'
import axios from 'axios'
import apiUrl from '../config/config'

const NewUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    role: '2',
  })

  const handleFormChange = (event) => {
    console.log(event.target.value)
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const addUser = (event) => {
    event.preventDefault()
    axios.post(`${apiUrl}/api/users`, formData).then((res) => {
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        role: '2',
      })
    })
  }

  return (
    <div>
      <h1>Luo uusi käyttäjä</h1>
      <form onSubmit={addUser}>
        <div>
          Käyttäjätunnus:
          <input
            name="username"
            value={formData.username}
            onChange={handleFormChange}
          />
        </div>
        <div>
          Etunimi:
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
          />
        </div>
        <div>
          Sukunimi:
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
          />
        </div>
        <div>
          Salasana:
          <input
            name="password"
            value={formData.password}
            onChange={handleFormChange}
          />
        </div>
        <div>
          Rooli:
          <select name="role" value={formData.role} onChange={handleFormChange}>
            <option value="2">Valitse</option>
            <option value="1">Pääkäyttäjä</option>
            <option value="2">Peruskäyttäjä</option>
          </select>
        </div>
        <button type="submit">Tallenna</button>
      </form>
    </div>
  )
}

export default NewUser
