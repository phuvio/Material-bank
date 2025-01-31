import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import materialService from '../services/materials'
import { validateMaterial } from '../utils/materialValidations'
import TagFilter from '../components/TagFilter'
import { selectTags } from '../utils/selectTags'
import decodeToken from '../utils/decode'
import GoBackButton from '../components/GoBackButton'

const NewMaterial = ({ onMaterialAdded, showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id: decodeToken().user_id,
    visible: true,
    is_url: false,
    url: '',
    material: null,
    material_type: null,
  })
  const [errors, setErrors] = useState({})

  const { tags, selectedTags, toggleTags } = selectTags()

  const navigate = useNavigate()

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFormData((prevData) => ({
      ...prevData,
      material: file,
      material_type: file.type,
    }))
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const addMaterial = async (event) => {
    event.preventDefault()

    const validationErrors = await validateMaterial(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      showNotification('Materiaalin luonti epäonnistui', 'error', 3000)
      return
    }

    const formToSubmit = new FormData()

    formToSubmit.append('name', formData.name)
    formToSubmit.append('description', formData.description)
    formToSubmit.append('user_id', decodeToken().user_id)
    formToSubmit.append('visible', true)
    formToSubmit.append('is_url', formData.is_url)

    if (formData.is_url) {
      formToSubmit.append('url', formData.url)
    } else {
      formToSubmit.append('material', formData.material)
      formToSubmit.append('material_type', formData.material_type)
    }

    formToSubmit.append('tagIds', JSON.stringify(selectedTags))

    try {
      await materialService.create(formToSubmit)
      showNotification('Materiaali lisätty', 'message', 2000)
      setFormData({
        name: '',
        description: '',
        user_id: decodeToken().user_id,
        visible: true,
        is_url: false,
        url: '',
        material: null,
        material_type: null,
      })
      onMaterialAdded()
      navigate('/')
    } catch (error) {
      showNotification('Materiaalin luonti epäonnistui', 'error', 3000)
      console.log('Error uploading material', error)
    }
  }

  return (
    <div className="container">
      <h1>Luo uusi materiaali</h1>
      <form onSubmit={addMaterial}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="name">Materiaalin nimi:</label>
          </div>
          <div className="col-75">
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              autoComplete="off"
            />
            <p>Nimen pituus voi olla 3-50 kirjainta.</p>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="description">Kuvaus:</label>
          </div>
          <div className="col-75">
            <textarea
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
            <p>Kuvaus voi olla enintään 500 kirjainta.</p>
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-25">
            <label htmlFor="is_url">Onko materiaali linkki:</label>
          </div>
          <div className="col-75">
            <input
              type="checkbox"
              id="is_url"
              name="is_url"
              checked={formData.is_url}
              onChange={handleFormChange}
            />
            {formData.is_url && (
              <>
                <label htmlFor="url">Linkki:</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleFormChange}
                />
                {errors.url && <span className="error-text">{errors.url}</span>}
              </>
            )}

            {!formData.is_url && (
              <>
                <label htmlFor="material"></label>
                <input
                  type="file"
                  id="material"
                  name="material"
                  aria-label="Material"
                  onChange={handleFileChange}
                />
                <p>
                  Mahdolliset tiedostomuodot ovat: pdf, word, excel, powerpoint,
                  jpg, png, gif, tiff ja bmp.
                </p>
                {errors.material && (
                  <span className="error-text">{errors.material}</span>
                )}
              </>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <legend>Valitse tagit:</legend>
          </div>
          <div className="col-75" aria-labelledby="tags-label">
            <TagFilter
              tags={tags}
              selectedTags={selectedTags}
              toggleTags={toggleTags}
            />
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

export default NewMaterial
