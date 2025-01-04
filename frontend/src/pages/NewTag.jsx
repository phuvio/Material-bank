import React, { useState } from 'react'
import Notification from '../components/Notification'
import tagService from '../services/tags'
import ColorPicker from '../components/ColorPicker'
import validateTag from '../utils/validations'
import useNotification from '../utils/useNotification'

const NewTag = () => {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
  })
  const [errors, setErrors] = useState({})

  const { message, type, showNotification } = useNotification()

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

  const addTag = async (event) => {
    event.preventDefault()

    const validationErrors = await validateTag(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      tagService
        .create(formData)
        .then(() => {
          showNotification('Tagi luotu onnistuneesti', 'message', 2000)
          setFormData({
            name: '',
            color: '',
          })
          setErrors({})
        })
        .catch((error) => {
          console.log('Error creating tag:', error)
          showNotification('Tagin luonti epäonnistui', 'error', 3000)
        })
    } else {
      showNotification('Tagin luonti epäonnistui', 'error', 3000)
    }
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
        <br></br>
        <button type="submit">Luo tagi</button>
      </form>

      {message && <Notification message={message} type={type} />}
    </div>
  )
}

export default NewTag
