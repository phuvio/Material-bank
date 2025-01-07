import React, { useState } from 'react'
import userService from '../services/users'

const NewUser = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    username: '@proneuron.fi',
    first_name: '',
    last_name: '',
    password: '',
    role: '',
  })
  const [errors, setErrors] = useState({})

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const addUser = (event) => {
    event.preventDefault()

    if (validate()) {
      showNotification('Käyttäjä luotu onnistuneesti', 'message', 2000)
      userService
        .create(formData)
        .then(() => {
          setFormData({
            username: '@proneuron.fi',
            first_name: '',
            last_name: '',
            password: '',
            role: '',
          })
          setErrors({})
        })
        .catch((error) => {
          console.log('Error creating user:', error)
          showNotification('Käyttäjän luonti epäonnistui', 'error', 3000)
        })
    } else {
      showNotification('Käyttäjän luonti epäonnistui', 'error', 3000)
    }
  }

  const validate = () => {
    let isValid = true
    const newErrors = {}
    const regexUsername =
      /^[a-zA-Z]+(-[a-zA-Z]+)?\.[a-zA-Z]+(-[a-zA-Z]+)?@proneuron\.fi$/
    const regexFirstname = /^[a-zA-ZäöåÄÖÅ]+(-[a-zA-ZäöåÄÖÅ]+)?$/
    const regexLastname = /^[a-zA-ZäöåÄÖÅ]+(-[a-zA-ZäöåÄÖÅ]+)?$/
    const regexPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,}$/

    if (!formData.username || !regexUsername.test(formData.username)) {
      newErrors.username = !formData.username
        ? 'Käyttäjätunnus on pakollinen'
        : 'Käyttäjätunnuksen tulee olla pronen sähköpostiosoite'
      isValid = false
    }

    if (!formData.first_name || !regexFirstname.test(formData.first_name)) {
      newErrors.first_name = !formData.first_name
        ? 'Etunimi on pakollinen'
        : 'Etunimi saa sisältää vain kirjaimia ja väliviivan'
      isValid = false
    }

    if (!formData.last_name || !regexLastname.test(formData.last_name)) {
      newErrors.last_name = !formData.last_name
        ? 'Sukunimi on pakollinen'
        : 'Sukunimi saa sisältää vain kirjaimia ja väliviivan'
      isValid = false
    }

    if (!formData.password || !regexPassword.test(formData.password)) {
      newErrors.password = !formData.password
        ? 'Salasana on pakollinen'
        : 'Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää: pieni ja iso kirjain, numero ja erikoismerkki: @$!#%*?&'
      isValid = false
    }

    if (!formData.role) {
      newErrors.role = 'Rooli on pakollinen'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  return (
    <div>
      <h1>Luo uusi käyttäjä</h1>
      <form onSubmit={addUser}>
        <label htmlFor="username">Käyttäjätunnus:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleFormChange}
        />
        {errors.username && <p>{errors.username}</p>}
        <label htmlFor="first_name">Etunimi:</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleFormChange}
        />
        {errors.first_name && <p>{errors.first_name}</p>}
        <label htmlFor="last_name">Sukunimi:</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleFormChange}
        />
        {errors.last_name && <p>{errors.last_name}</p>}
        <label htmlFor="password">Salasana:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleFormChange}
        />
        {errors.password && <p>{errors.password}</p>}
        <label htmlFor="role">Rooli:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleFormChange}
        >
          <option value="">Valitse</option>
          <option value="1">Pääkäyttäjä</option>
          <option value="2">Peruskäyttäjä</option>
        </select>
        {errors.role && <p>{errors.role}</p>}
        <button type="submit">Tallenna</button>
      </form>
    </div>
  )
}

export default NewUser
