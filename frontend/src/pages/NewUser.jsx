import React, { useState } from 'react'
import userService from '../services/users'
import Notification from '../components/Notification'

const NewUser = () => {
  const [formData, setFormData] = useState({
    username: '@proneuron.fi',
    first_name: '',
    last_name: '',
    password: '',
    role: '',
  })
  const [errors, setErrors] = useState({})
  const [notificationMessage, setNotificationMessage] = useState({})

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

    if (validate()) {
      setNotificationMessage({
        message: 'Käyttäjä luotu onnistuneesti',
        type: 'message',
        timeout: 2000,
      })
      userService.create(formData).then(() => {
        setFormData({
          username: '@proneuron.fi',
          first_name: '',
          last_name: '',
          password: '',
          role: '',
        })
      })
      setErrors({})
    } else {
      setNotificationMessage({
        message: 'Käyttäjän luonti epäonnistui',
        type: 'error',
        timeout: 3000,
      })
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
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

    if (!formData.username) {
      newErrors.username = 'Käyttäjätunnus on pakollinen'
      isValid = false
    }

    if (!regexUsername.test(formData.username)) {
      newErrors.username =
        'Käyttäjätunnuksen tulee olla pronen sähköpostiosoite'
      isValid = false
    }

    if (!formData.first_name) {
      newErrors.first_name = 'Etunimi on pakollinen'
      isValid = false
    }

    if (!regexFirstname.test(formData.first_name)) {
      newErrors.first_name = 'Etunimi saa sisältää vain kirjaimia ja väliviivan'
      isValid = false
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Sukunimi on pakollinen'
      isValid = false
    }

    if (!regexLastname.test(formData.last_name)) {
      newErrors.last_name = 'Sukunimi saa sisältää vain kirjaimia ja väliviivan'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'Salasana on pakollinen'
      isValid = false
    }

    if (!regexPassword.test(formData.password)) {
      newErrors.password =
        'Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältäen pienen ja ison kirjaimen sekä numeron'
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
        <label>Käyttäjätunnus:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleFormChange}
        />
        {errors.username && <p>{errors.username}</p>}
        <label>Etunimi:</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleFormChange}
        />
        {errors.first_name && <p>{errors.first_name}</p>}
        <label>Sukunimi:</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleFormChange}
        />
        {errors.last_name && <p>{errors.last_name}</p>}
        <label>Salasana:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleFormChange}
        />
        {errors.password && <p>{errors.password}</p>}
        <label>Rooli:</label>
        <select name="role" value={formData.role} onChange={handleFormChange}>
          <option value="">Valitse</option>
          <option value="1">Pääkäyttäjä</option>
          <option value="2">Peruskäyttäjä</option>
        </select>
        {errors.role && <p>{errors.role}</p>}
        <button type="submit">Tallenna</button>
      </form>

      {notificationMessage.message && (
        <Notification
          message={notificationMessage.message}
          type={notificationMessage.type}
          timeout={notificationMessage.timeout}
          onClose={() => setNotificationMessage({})}
        />
      )}
    </div>
  )
}

export default NewUser
