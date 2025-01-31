import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import materialService from '../services/materials'
import { validateMaterialUpdate } from '../utils/materialValidations'
import GoBackButton from '../components/GoBackButton'

const EditMaterial = ({ onMaterialAdded, showNotification }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [errors, setErrors] = useState({})
  const [material, setMaterial] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    materialService
      .getSingle(id)
      .then((returnedMaterial) => {
        setFormData({
          name: returnedMaterial.name,
          description: returnedMaterial.description,
        })
        setMaterial(returnedMaterial)
      })
      .catch((error) => {
        console.log('Error fetching material:', error)
      })
  }, [id, showNotification])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const updateMaterial = async (e) => {
    e.preventDefault()

    const validationErrors = await validateMaterialUpdate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      showNotification('Materiaalin päivitys epäonnistui', 'error', 3000)
      return
    }

    const formToSubmit = new FormData()

    formToSubmit.append('name', formData.name)
    formToSubmit.append('description', formData.description)

    if (material.Tags) {
      const tagIds = material.Tags.map((tag) => tag.id)
      formToSubmit.append('tagIds', JSON.stringify(tagIds))
    }

    materialService
      .update(id, formToSubmit)
      .then(() => {
        showNotification('Materiaali päivitetty onnistuneesti', 'message', 2000)
        setFormData({
          ...formData,
        })
        onMaterialAdded()
        navigate(`/materiaalit/${id}`)
      })
      .catch((error) => {
        console.log('Error updating material', error)
        showNotification('Materiaalin päivitys epäonnistui', 'error', 3000)
      })
  }

  return (
    <div className="container">
      <h2>Muokkaa materiaalia</h2>
      <form onSubmit={updateMaterial}>
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
            />
            <p>Nimen pituus voi olla 3-50 kirjainta.</p>
            {errors.name && <span>{errors.name}</span>}
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="description">Kuvaus:</label>
          </div>
          <div className="col-75">
            <textarea
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
            <p>Kuvaus voi olla enintään 500 kirjainta.</p>
            {errors.description && <span>{errors.description}</span>}
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

export default EditMaterial
