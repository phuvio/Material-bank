import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userService from '../services/users'
import GoBackButton from '../components/GoBackButton'
import '../styles/changePassword.css'

const ChangePassword = ({ showNotification }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [validPassword, setValidPassword] = useState(false)
  const [progressBars, setProgressBars] = useState({
    newPassword: 0,
    newPasswordAgain: 0,
  })
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

    let passwordStrength = progressBars.newPassword
    let passwordAgainStrength = progressBars.newPasswordAgain

    if (name === 'new_password') {
      passwordStrength = 0
      if (value.length > 7) passwordStrength += 1
      if (value.match(/(?=.*[0-9])/)) passwordStrength += 1
      if (value.match(/(?=.*[a-z])/)) passwordStrength += 1
      if (value.match(/(?=.*[A-Z])/)) passwordStrength += 1
      if (value.match(/(?=.*[!?.,+\-*/=@$#%^&()_{}[\];:´"])/))
        passwordStrength += 1

      setProgressBars((prevData) => ({
        ...prevData,
        newPassword: passwordStrength,
      }))
    }

    if (
      value === formData.new_password_again ||
      (name === 'new_password_again' && value === formData.new_password)
    ) {
      passwordAgainStrength = 1
      setProgressBars((prevData) => ({
        ...prevData,
        newPasswordAgain: 1,
      }))
    } else {
      passwordAgainStrength = 0
      setProgressBars((prevData) => ({
        ...prevData,
        newPasswordAgain: 0,
      }))
    }

    if (passwordAgainStrength === 1 && passwordStrength === 5) {
      setValidPassword(true)
    } else {
      setValidPassword(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    userService
      .getSingle(id)
      .then((returnedUsed) => {
        setUser(returnedUsed)
      })
      .catch((error) => {
        console.log('Error fetching user', error)
      })
  }, [])

  const updatePassword = async (e) => {
    e.preventDefault()

    try {
      const response = await userService.updatePassword(id, {
        old_password: formData.old_password,
        new_password: formData.new_password,
      })

      if (response.status === 200) {
        showNotification('Salasana päivitetty onnistuneesti', 'message', 2000)
      }
      if (response.data?.error === 'Incorrect old password') {
        showNotification('Nykyinen salasana ei täsmää', 'error', 3000)
      } else if (
        response.data?.error ===
        'New password cannot be the same as the old password'
      ) {
        showNotification(
          'Uusi salasana ei voi olla nykyinen salasana',
          'error',
          3000
        )
      } else {
        showNotification(
          'Tuntematon virhe salasanan päivittämisessä',
          'error',
          3000
        )
      }
      setFormData({
        old_password: '',
        new_password: '',
        new_password_again: '',
      })
      setProgressBars({
        newPassword: 0,
        newPasswordAgain: 0,
      })
    } catch (error) {
      console.log('Error updating password', error)
      if (error.response && error.response.status === 400) {
        if (error.response.data.error === 'Incorrect old password') {
          showNotification('Nykyinen salasana ei täsmää', 'error', 3000)
        } else if (
          error.response.data.error ===
          'New password cannot be the same as the old password'
        ) {
          showNotification(
            'Uusi salasana ei voi olla nykyinen salasana',
            'error',
            3000
          )
        } else {
          showNotification('Something went wrong. Please try again.', 'error')
        }
      } else {
        showNotification('Salasanan päivitys epäonnistui', 'error', 3000)
      }
    }
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
              <li>
                vähintään yksi erikoismerkki: !?.,+-*/=@$#%^&()_ &#123;
                &#125;[];:´"
              </li>
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
            <progress
              className={`password strength-${progressBars.newPassword}`}
              value={progressBars.newPassword}
              max="5"
            ></progress>
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
            <progress
              className={`password strength_again-${progressBars.newPasswordAgain}`}
              value={progressBars.newPasswordAgain}
              max="1"
            ></progress>
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
