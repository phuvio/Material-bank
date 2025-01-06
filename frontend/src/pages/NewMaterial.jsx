import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import materialService from '../services/materials'
import { validateMaterial } from '../utils/materialValidations'
import TagFilter from '../components/TagFilter'
import { selectTags } from '../utils/selectTags'

const NewMaterial = ({ loggedInUser, onMaterialAdded, showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id: loggedInUser.user_id,
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
    formToSubmit.append('user_id', loggedInUser.user_id)
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
        user_id: loggedInUser.user_id,
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
    <div>
      <h1>Luo uusi materiaali</h1>
      <form onSubmit={addMaterial}>
        <label htmlFor="name">Materiaalin nimi:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
        />
        {errors.name && <span>{errors.name}</span>}

        <label htmlFor="description">Kuvaus:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
        />
        {errors.description && <span>{errors.description}</span>}

        <label htmlFor="is_url">Onko materiaali linkki:</label>
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
            {errors.url && <span>{errors.url}</span>}
          </>
        )}

        {!formData.is_url && (
          <>
            <label htmlFor="material" aria-label="Material"></label>
            <input
              type="file"
              id="material"
              name="material"
              aria-label="Material"
              onChange={handleFileChange}
            />
            {errors.material && <span>{errors.material}</span>}
          </>
        )}

        <button type="submit">Tallenna</button>
      </form>

      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        toggleTags={toggleTags}
      />
    </div>
  )
}

export default NewMaterial
