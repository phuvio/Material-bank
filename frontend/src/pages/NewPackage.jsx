import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import packageService from '../services/packages'
import { validatePackage } from '../utils/packageValidations'
import materialService from '../services/materials'
import { selectTags } from '../utils/selectTags'
import GoBackButton from '../components/GoBackButton'
import Filter from '../components/Filter'
import TagFilter from '../components/TagFilter'
import SelectedMaterialsList from '../components/SelectMaterialsList'

const NewPackage = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    materials: [],
  })
  const [errors, setErrors] = useState({})
  const [materials, setMaterials] = useState([])
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [filter, setFilter] = useState('')
  const { tags, selectedTags, toggleTags } = selectTags()
  const navigate = useNavigate()

  const materialsToShow = materials.filter((material) => {
    const tagsIds = material.Tags ? material.Tags.map((tag) => tag.id) : []
    const matchesText =
      filter.length === 0 ||
      material.name.toLowerCase().includes(filter.toLocaleLowerCase())
    const matchesTags =
      selectedTags.length === 0 ||
      (tagsIds && selectedTags.every((tagId) => tagsIds.includes(tagId)))

    return matchesText && matchesTags
  })

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

  const toggleMaterial = (id) => {
    setFormData((prevData) => {
      const alreadySelected = prevData.materials.includes(id)
      return {
        ...prevData,
        materials: alreadySelected
          ? prevData.materials.filter((mId) => mId !== id)
          : [...prevData.materials, id],
      }
    })
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
      const payload = {
        name: formData.name,
        description: formData.description,
        materialIds: formData.materials.map((id, index) => ({
          id,
          position: index,
        })),
      }

      await packageService.create(payload)
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
          <div className="input-top-label">
            <label htmlFor="name">Nimi:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="input-top-label">
            <label htmlFor="description">Kuvaus:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
          <div className="selected-materials-container">
            <SelectedMaterialsList
              selectedMaterials={formData.materials
                .map((id) => materials.find((m) => m.id === id))
                .filter(Boolean)}
              setSelectedMaterials={(newOrder) =>
                setFormData((prev) => ({
                  ...prev,
                  materials: newOrder.map((m) => m.id),
                }))
              }
            />
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
        <h3>Etsi materiaaleista</h3>
        <Filter
          value={filter}
          handleChange={({ target }) => setFilter(target.value)}
        />
        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          toggleTags={toggleTags}
        />
        <h3>Lisää materiaaleja pakettiin</h3>
        {materialsLoading ? (
          <p>Ladataan materiaaleja...</p>
        ) : (
          <ul>
            {materialsToShow.map((material) => (
              <li key={material.id}>
                <button
                  className={`materialSelectButton ${
                    formData.materials.includes(material.id) ? 'selected' : ''
                  }`}
                  aria-label={`Select ${material.name}`}
                  onClick={() => toggleMaterial(material.id)}
                ></button>
                <label>{material.name}</label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default NewPackage
