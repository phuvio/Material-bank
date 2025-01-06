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

  const { tags, selectedTags, toggleTags } = selectTags()

  useEffect(() => {
    materialService
      .getSingle(id)
      .then((returnedMaterial) => {
        const data = returnedMaterial
        const date = new Date(data.updated_at)
        data.id = id
        data.updated_at = date.toLocaleDateString('fi-FI')
        setMaterial(data)
      })
      .catch((error) => {
        console.log('Error fetching material:', error)
      })
  }, [id, showNotification])

  if (!material) {
    return <div>Materiaalia ei löytynyt</div>
  }

  const handleDeleteMaterail = (id) => {
    if (window.confirm('Haluatko varmati poistaa tämän materiaalin?')) {
      materialService
        .remove(id)
        .then(() => {
          showNotification(
            'Materiaali poistettu onnistuneesti',
            'message',
            2000
          )
          onMaterialAdded()
          navigate('/materials')
        })
        .catch((error) => {
          console.log('Error deleting material', error)
          showNotification('Materiaalin poisto epäonnistui', 'error', 3000)
        })
    }
  }

  return (
    <div>
      <div>
        <h1>{material.name}</h1>
        <p>{material.description}</p>
        {material.Tags &&
          material.Tags.map((tag) => (
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
