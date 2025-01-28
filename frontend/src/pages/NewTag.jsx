import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import tagService from '../services/tags'
import ColorPicker from '../components/ColorPicker'
import validateTag from '../utils/tagValidations'
import GoBackButton from '../components/GoBackButton'

const NewTag = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
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

  const handleColorChange = (color) => {
    setFormData((prevData) => ({
      ...prevData,
      color: color,
    }))
  }

  const handleGoBack = () => {
    navigate(-1)
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
    <div className="container">
      <h1>Luo uusi tagi</h1>
      <form onSubmit={addTag}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="name">Nimi:</label>
          </div>
          <div className="col-75">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <p>Nimen pituus voi olla 3-30 kirjainta.</p>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-25">
            <label htmlFor="color">Valitse tagin väri:</label>
          </div>
          <div className="col-75">
            <ColorPicker
              selectedColor={formData.color}
              onColorChange={handleColorChange}
              className="color-picker"
            />
            {errors.color && <span className="error-text">{errors.color}</span>}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="buttongroup">
            <button type="submit">Luo tagi</button>
            <GoBackButton onGoBack={handleGoBack} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewTag
