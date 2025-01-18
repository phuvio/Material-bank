import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userService from '../services/users'
import GoBackButton from '../components/GoBackButton'

const ChangePassword = ({ showNotification }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [validPassword, setValidPassword] = useState(false)
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_again: '',
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
      .then((returnedUsed) => {
        setUser(returnedUsed)
        console.log(returnedUsed)
      })
      .catch((error) => {
        console.log('Error fetching user', error)
      })
  }, [])

  const updatePassword = async (e) => {
    e.preventDefault()

    if (user.password !== formData.old_password) {
      showNotification('Väärä nykyinen salasana', 'error', 3000)
      return
    }

    setValidPassword(true)
  }

  return (
    <div className="container">
      <h2>Vaihda salasana</h2>
      <form onSubmit={updatePassword}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="old_password">Nykyinen salasana:</label>
          </div>
          <div className="col-75">
            <input
              id="old_password"
              type="text"
              name="old_password"
              value={formData.old_password}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-25">Vaatimukset salasanalle:</div>
          <div className="col-75">
            <ul className="password">
              <li>vähintään 8 merkkiä pitkä</li>
              <li>vähintään yksi pieni kirjain</li>
              <li>vähintään yksi iso kirjain</li>
              <li>vähintään yksi numero</li>
              <li>vähintään yksi erikoismerkki: @$!()_#%*?&</li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="new_password">Uusi salasana:</label>
          </div>
          <div className="col-75">
            <input
              id="new_password"
              type="text"
              name="new_password"
              value={formData.new_password}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="new_password_again">Uusi salasana uudelleen:</label>
          </div>
          <div className="col-75">
            <input
              id="new_password_again"
              type="text"
              name="new_password_again"
              value={formData.new_password_again}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="buttongroup">
            <button type="submit" disabled={!validPassword}>
              Tallenna
            </button>
            <GoBackButton onGoBack={handleGoBack} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
