import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userService from '../services/users'
import { validateUserUpdate } from '../utils/userValidations'

const EditUser = ({ showNotification }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    password: '',
    role: '',
  })
  const [user, setUser] = useState()

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    userService
      .getSingle(id)
      .then((returnedUser) => {
        setFormData({
          first_name: returnedUser.first_name,
          last_name: returnedUser.last_name,
          password: '',
          role: returnedUser.role,
        })
        setUser(returnedUser)
      })
      .catch((error) => {
        console.log('Error fetching user:', error)
      })
  }, [id, showNotification])

  const updateUser = async (e) => {
    e.preventDefault()

    const validationErrors = await validateUserUpdate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      showNotification('Käyttäjän päivitys epäonnistui', 'error', 3000)
      return
    }

    const formToSubmit = new FormData()

    formToSubmit.append('first_name', formData.first_name)
    formToSubmit.append('last_name', formData.last_name)
    formToSubmit.append('role', formData.role)

    if (!(formData.password === '')) {
      formToSubmit.append('password', formData.password)
    }

    userService
      .update(id, formToSubmit)
      .then(() => {
        showNotification(
          'Käyttäjän tiedot päivitetty onnistuneesti',
          'message',
          2000
        )
        setFormData({
          ...formData,
        })
        navigate('/users')
      })
      .catch((error) => {
        console.log('Error updateing user', error)
        showNotification(
          'Käyttäjän tietojen päivitys epäonnistui',
          'error',
          3000
        )
      })
  }

  if (user === null) {
    return <div>Ladataan...</div>
  }

  return (
    <div>
      <h2>Muokkaa käyttäjää</h2>
      <form onSubmit={updateUser}>
        <label htmlFor="name">Etunimi:</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleFormChange}
        />
        {errors.first_name && <span>{errors.first_name}</span>}
        <label htmlFor="last_name">Sukunimi:</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleFormChange}
        />
        {errors.last_name && <span>{errors.last_name}</span>}
        <label htmlFor="password">
          Salasana (jos jätät salasanan tyhjäksi, se ei vaihdu):
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleFormChange}
        />
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
        {errors.role && <span>{errors.role}</span>}
        <button type="submit">Tallenna</button>
      </form>
    </div>
  )
}

export default EditUser
