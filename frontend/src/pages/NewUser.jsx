import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'
import { validateUser } from '../utils/userValidations'
import GoBackButton from '../components/GoBackButton'

const NewUser = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    username: '@proneuron.fi',
    first_name: '',
    last_name: '',
    password: '',
    role: '',
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

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

  const addUser = async (event) => {
    event.preventDefault()

    const validationErrors = await validateUser(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      userService
        .create(formData)
        .then(() => {
          showNotification('Käyttäjä luotu onnistuneesti', 'message', 2000)
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

  return (
    <div className="container">
      <h1>Luo uusi käyttäjä</h1>
      <form onSubmit={addUser}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="username">Käyttäjätunnus:</label>
          </div>
          <div className="col-75">
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
            />
            <p>Käyttäjätunnus on muotoa etunimi.sukunimi@proneuron.fi.</p>
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="first_name">Etunimi:</label>
          </div>
          <div className="col-75">
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleFormChange}
            />
            {errors.first_name && (
              <p className="error-text">{errors.first_name}</p>
            )}
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
            {errors.last_name && (
              <p className="error-text">{errors.last_name}</p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="password">Salasana:</label>
          </div>
          <div className="col-75">
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
            />
            <ul className="password">
              <li>vähintään 8 merkkiä pitkä</li>
              <li>vähintään yksi pieni kirjain</li>
              <li>vähintään yksi iso kirjain</li>
              <li>vähintään yksi numero</li>
              <li>
                vähintään yksi erikoismerkki: !?.,+-*/=@$#%^&()_ &#123;
                &#125;[];:´"
              </li>
            </ul>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="role">Rooli:</label>
          </div>
          <div className="col-75">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
            >
              <option value="">Valitse</option>
              <option value="admin">Pääkäyttäjä</option>
              <option value="moderator">Moderaattori</option>
              <option value="basic">Peruskäyttäjä</option>
            </select>
            <p>
              Peruskäyttäjä voi luoda uusia materiaaleja, muokata materiaalien
              tageja ja muokata tai poistaa itse luomiaan materiaaleja.
            </p>
            <p>Moderaattori voi myös luoda ja muokata tageja.</p>
            {errors.role && <p className="error-text">{errors.role}</p>}
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

export default NewUser
