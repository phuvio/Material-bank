import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import tagService from '../services/tags'
import ColorPicker from '../components/ColorPicker'
import validateTag from '../utils/tagValidations'

const EditTag = ({ showNotification }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tag, setTag] = useState({ name: '', color: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    tagService
      .getSingle(id)
      .then((returnedTag) => {
        setTag(returnedTag)
      })
      .catch((error) => {
        console.log('Error fetching tag:', error)
      })
  }, [id])

  const handleNameChange = (e) => {
    setTag({ ...tag, [e.target.name]: e.target.value })
  }

  const handleColorChange = (color) => {
    setTag({ ...tag, color: color })
  }

  const handleDeleteTag = (id) => {
    if (window.confirm('Haluatko varmasti poistaa tämän tagin?')) {
      tagService
        .remove(id)
        .then(() => {
          showNotification('Tagi poistettu onnistuneesti', 'message', 2000)
          navigate('/tagadmin')
        })
        .catch((error) => {
          console.log('Error deleting tag:', error)
          showNotification('Tagin poisto epäonnistui', 'error', 3000)
        })
    }
  }

  const addTag = async (e) => {
    e.preventDefault()

    const validationErrors = await validateTag(tag)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      tagService
        .update(id, tag)
        .then(() => {
          showNotification('Tagi päivitetty onnistuneesti', 'message', 2000)
          navigate('/tagadmin')
        })
        .catch((error) => {
          console.log('Error updating tag:', error)
          showNotification('Tagin päivitys epäonnistui', 'error', 3000)
        })
    } else {
      showNotification('Tagin päivitys epäonnistui', 'error', 3000)
    }
  }

  if (tag === null) {
    return <div>Ladataan...</div>
  }

  return (
    <div className="container">
      <h2>Muokkaa tagia</h2>
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
              value={tag.name}
              onChange={handleNameChange}
            />
            {errors.name && <span>{errors.name}</span>}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-25">
            <label htmlFor="color">Valitse tagin väri:</label>
          </div>
          <div className="col-75">
            <ColorPicker
              selectedColor={tag.color}
              onColorChange={handleColorChange}
              className="color-picker"
            />
          </div>
        </div>
        <br></br>
        <div className="row">
          <button type="submit">Tallenna tagi</button>
        </div>
      </form>
      <div className="row">
        <button
          className="deleteButton"
          onClick={() => handleDeleteTag(tag.id)}
        >
          Poista tagi
        </button>
      </div>
    </div>
  )
}

export default EditTag
