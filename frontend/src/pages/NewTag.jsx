import React, { useState } from 'react'
import tagService from '../services/tags'
import Notification from '../components/Notification'
import ColorPicker from '../components/ColorPicker'

const NewTag = () => {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
  })
  const [errors, setErrors] = useState({})
  const [notificationMessage, setNotificationMessage] = useState({})

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleColorChange = (color) => {
    setFormData((prevData) => ({
      ...prevData,
      color: color,
    }))
  }

  const addTag = (event) => {
    event.preventDefault()

    if (validate()) {
      tagService
        .create(formData)
        .then(() => {
          setNotificationMessage({
            message: 'Tagi luotu onnistuneesti',
            type: 'message',
            timeout: 2000,
          })
          setFormData({
            name: '',
            color: '',
          })
          setErrors({})
        })
        .catch((error) => {
          console.log('Error creating tag:', error)
          setNotificationMessage({
            message: 'Tagin luonti epäonnistui',
            type: 'error',
            timeout: 3000,
          })
        })
    } else {
      setNotificationMessage({
        message: 'Tagin luonti epäonnistui',
        type: 'error',
        timeout: 3000,
      })
    }
  }

  const validate = () => {
    const regexTagName = /^[a-zA-ZäöåÄÖÅ0-9\s]+$/
    const errors = {}
    if (!formData.name || !regexTagName.test(formData.name)) {
      errors.name = !formData.name
        ? 'Anna tagille nimi'
        : 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    }
    if (!formData.color) {
      errors.color = 'Valitse väri'
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  return (
    <div>
      <h1>Luo uusi tagi</h1>
      <form onSubmit={addTag}>
        <div>
          <label htmlFor="name">Nimi</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <br></br>
        <div>
          <ColorPicker
            selectedColor={formData.color}
            onColorChange={handleColorChange}
          />
          {errors.color && <span>{errors.color}</span>}
        </div>
        <button type="submit">Luo tagi</button>
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

export default NewTag
