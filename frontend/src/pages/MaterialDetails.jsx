import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import materialService from '../services/materials'
import TagFilter from '../components/TagFilter'
import { selectTags } from '../utils/selectTags'
import '../styles/tag.css'

const MaterialDetails = ({
  loggedInUser,
  onMaterialAdded,
  showNotification,
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [material, setMaterial] = useState(null)

  const { tags, selectedTags, setSelectedTags, toggleTags } = selectTags()

  useEffect(() => {
    materialService
      .getSingle(id)
      .then((returnedMaterial) => {
        const data = returnedMaterial
        const date = new Date(data.updated_at)
        data.id = id
        data.updated_at = date.toLocaleDateString('fi-FI')
        setMaterial(data)
        if (data.Tags && Array.isArray(data.Tags)) {
          const tagIds = data.Tags.map((tag) => tag.id)
          setSelectedTags(tagIds)
        }
      })
      .catch((error) => {
        console.log('Error fetching material:', error)
      })
  }, [id, showNotification])

  if (!material) {
    return <div>Materiaalia ei löytynyt</div>
  }

  const handleDeleteMaterail = async (id) => {
    if (window.confirm('Haluatko varmati poistaa tämän materiaalin?')) {
      try {
        await materialService.remove(id)
        showNotification('Materiaali poistettu onnistuneesti', 'message', 2000)
        onMaterialAdded()
        navigate('/materials')
      } catch (error) {
        console.log('Error deleting material:', error)
        showNotification('Materiaalin poisto epäonnistui', 'error', 3000)
      }
    }
  }

  const handleUpdateTags = async (e) => {
    e.preventDefault()

    const formToSubmit = new FormData()

    formToSubmit.append('tagIds', JSON.stringify(selectedTags))

    try {
      await materialService.update(id, formToSubmit)
      showNotification('Tagit päivitetty onnistuneesti', 'message', 2000)
      onMaterialAdded()
    } catch (error) {
      console.log('Error updating tags', error)
      showNotification('Tagien päivitys epäonnistui', 'error', 3000)
    }
  }

  return (
    <div>
      <div>
        <h1>{material.name}</h1>
        <p>{material.description}</p>
        {material.Tags &&
          material.Tags.slice()
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((tag) => (
              <span
                key={tag.id}
                className="tag"
                style={{ background: tag.color }}
              >
                {tag.name}
              </span>
            ))}
        <br></br>
        {material.is_url && <LoadLinkButton url={material.url} />}
        {!material.is_url && <LoadMaterialButton material={material} />}
      </div>
      <div>
        <h2>Muokkaa tageja</h2>
        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          toggleTags={toggleTags}
        />
        <button onClick={(e) => handleUpdateTags(e)}>Päivitä tagit</button>
      </div>
      <div>
        {(loggedInUser.role === 0 || loggedInUser.id === material.User.id) && (
          <>
            <Link to={`/editmaterial/${id}`}>Muokkaa materiaalia</Link>
            <b></b>
            <button onClick={() => handleDeleteMaterail(id)}>
              Poista materiaali
            </button>
          </>
        )}
      </div>
      <p>
        Materiaalin tallentaja: {material.User.first_name}{' '}
        {material.User.last_name}
      </p>
      <p>Muokattu: {material.updated_at}</p>
    </div>
  )
}

export default MaterialDetails
