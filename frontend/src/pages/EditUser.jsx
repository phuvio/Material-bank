import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userService from '../services/users'
import { validateUserUpdate } from '../utils/userValidations'
import GoBackButton from '../components/GoBackButton'

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

  const handleGoBack = () => {
    navigate(-1)
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

    const formToSubmit = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      role: formData.role,
    }

    if (formData.password && formData.password !== '') {
      formToSubmit.password = formData.password
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
    <div className="container">
      <h2>Muokkaa käyttäjää</h2>
      <form onSubmit={updateUser}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="name">Etunimi:</label>
          </div>
          <div className="col-75">
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleFormChange}
            />
            {errors.first_name && <span>{errors.first_name}</span>}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="last_name">Sukunimi:</label>
          </div>
          <div className="col-75">
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleFormChange}
            />
            {errors.last_name && <span>{errors.last_name}</span>}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="password">
              Salasana<br></br>(jos jätät salasanan tyhjäksi, se ei vaihdu):
            </label>
          </div>
          <div className="col-75">
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
            />
            {errors.password && <span>{errors.password}</span>}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="role">Rooli:</label>
          </div>
          <div className="row-75">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
            >
              <option value="">Valitse</option>
              <option value="admin">Pääkäyttäjä</option>
              <option value="basic">Peruskäyttäjä</option>
            </select>
            {errors.role && <span>{errors.role}</span>}
          </div>
        </div>
        <div className="row">
          <div className="buttongroup">
            <button type="submit">Tallenna</button>
            <GoBackButton onGoBack={handleGoBack} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditUser
