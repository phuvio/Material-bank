import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import packageService from '../services/packages'
import { validatePackageUpdate } from '../utils/packageValidations'
import materialService from '../services/materials'
import { selectTags } from '../utils/selectTags'
import GoBackButton from '../components/GoBackButton'
import Filter from '../components/Filter'
import TagFilter from '../components/TagFilter'
import SelectedMaterialsList from '../components/SelectMaterialsList'

const EditPackage = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    materials: [],
  })
  const { id } = useParams()
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
      material.name.toLowerCase().includes(filter.toLowerCase())
    const matchesTags =
      selectedTags.length === 0 ||
      (tagsIds && selectedTags.every((tagId) => tagsIds.includes(tagId)))

    return matchesText && matchesTags
  })

  useEffect(() => {
    packageService
      .getSingle(id)
      .then((returnedPackage) => {
        setFormData({
          name: returnedPackage.name,
          description: returnedPackage.description,
          materials: returnedPackage.Materials,
        })
      })
      .catch((error) => {
        console.error('Error fetching package:', error)
        showNotification('Virhe haettaessa pakettia.', 'error', 3000)
      })
  }, [id, showNotification])

  useEffect(() => {
    const fetchMaterials = async () => {
      setMaterialsLoading(true)
      try {
        const initialMaterials = await materialService.getAll()
        const sortedMaterials = initialMaterials.sort((a, b) =>
          a.name.localeCompare(b.name, 'fi', { sensitivity: 'base' })
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

  const toggleMaterial = (material) => {
    setFormData((prevData) => {
      const alreadySelected = prevData.materials.some(
        (m) => m.id === material.id
      )
      return {
        ...prevData,
        materials: alreadySelected
          ? prevData.materials.filter((m) => m.id !== material.id)
          : [...prevData.materials, material],
      }
    })
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleToggleMaterial = (material) => () => toggleMaterial(material)

  const updatePackage = async (e) => {
    e.preventDefault()

    const validationErrors = await validatePackageUpdate(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      showNotification('Paketin päivitys epäonnistui', 'error', 3000)
      return
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        materialIds: formData.materials.map((m, index) => ({
          id: m.id,
          position: index,
        })),
      }

      await packageService.update(id, payload)
      showNotification('Paketti päivitetty onnistuneesti', 'message', 2000)
      navigate(`/paketti/${id}`)
    } catch (error) {
      console.error('Error updating package:', error)
      showNotification('Paketin päivitys epäonnistui', 'error', 3000)
    }
  }

  return (
    <div className="container">
      <div className="col-50">
        <h1>Muokkaa pakettia</h1>
        <form onSubmit={updatePackage}>
          <div className="input-top-label">
            <label htmlFor="name">Nimi</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="input-top-label">
            <label htmlFor="description">Kuvaus</label>
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
          <div className="selected-materials-container">
            <SelectedMaterialsList
              selectedMaterials={formData.materials}
              setSelectedMaterials={(newSelected) =>
                setFormData((prev) => ({
                  ...prev,
                  materials: newSelected,
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
      <div className="row">
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
                    formData.materials.some((m) => m.id === material.id)
                      ? 'selected'
                      : ''
                  }`}
                  aria-label={`Select ${material.name}`}
                  onClick={handleToggleMaterial(material)}
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

export default EditPackage
