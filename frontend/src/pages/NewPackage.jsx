import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import packageService from '../services/packages'
import { validatePackage } from '../utils/packageValidations'
import materialService from '../services/materials'
import GoBackButton from '../components/GoBackButton'

const NewPackage = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    materials: [],
  })
  const [errors, setErrors] = useState({})
  const [materials, setMaterials] = useState([])
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const initialMaterials = await materialService.getAll()
        const sortedMaterials = initialMaterials.sort((a, b) =>
          a.name > b.name ? 1 : -1
        )
        setMaterials(sortedMaterials)
      } catch (error) {
        console.error('Error fetching materials:', error)
        showNotification('Virhe haettaessa materiaaleja.', 'error', 3000)
      } finally {
        setMaterialsLoading(false)
      }
    }
    fetchMaterials()
  }, [])

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = await validatePackage(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      showNotification('Paketin luonti epäonnistui.', 'error', 3000)
      return
    }

    try {
      await packageService.create(formData)
      showNotification('Paketti luotu onnistuneesti.', 'success', 3000)
      navigate('/paketit')
    } catch (error) {
      console.error('Error creating package:', error)
      showNotification('Virhe paketin luomisessa.', 'error', 3000)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="container">
      <div className="col-50">
        <h1>Uusi paketti</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Nimi:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="description">Kuvaus:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
            {errors.description && (
              <p className="error">{errors.description}</p>
            )}
          </div>
          <div className="row">
            <div className="buttongroup">
              <button type="submit">Tallenna</button>
              <GoBackButton onGoBack={handleGoBack} />
            </div>
          </div>
        </form>
      </div>
      <div className="col-50">
        <h3>Lisää materiaaleja pakettiin</h3>
        {materialsLoading ? (
          <p>Ladataan materiaaleja...</p>
        ) : (
          <ul>
            {materials.map((material) => (
              <li key={material.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.materials.includes(material.id)}
                    onChange={() => {
                      setFormData((prevData) => {
                        const newMaterials = prevData.materials.includes(
                          material.id
                        )
                          ? prevData.materials.filter(
                              (id) => id !== material.id
                            )
                          : [...prevData.materials, material.id]
                        return { ...prevData, materials: newMaterials }
                      })
                    }}
                  />
                  {material.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default NewPackage
