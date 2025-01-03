import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import tagService from '../services/tags'
import Notification from '../components/Notification'
import ColorPicker from '../components/ColorPicker'
import validateTag from '../utils/validations'

const EditTag = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tag, setTag] = useState({ name: '', color: '' })
  const [errors, setErrors] = useState({})
  const [notificationMessage, setNotificationMessage] = useState({})

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
          setNotificationMessage({
            message: 'Tagi poistettu onnistuneesti',
            type: 'message',
            timeout: 2000,
          })
          navigate('/tagadmin')
        })
        .catch((error) => {
          console.log('Error deleting tag:', error)
          setNotificationMessage({
            message: 'Tagin poisto epäonnistui',
            type: 'error',
            timeout: 3000,
          })
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
          setNotificationMessage({
            message: 'Tagi päivitetty onnistuneesti',
            type: 'message',
            timeout: 2000,
          })
          navigate('/tagadmin')
        })
        .catch((error) => {
          console.log('Error updating tag:', error)
          setNotificationMessage({
            message: 'Tagin päivitys epäonnistui',
            type: 'error',
            timeout: 3000,
          })
        })
    } else {
      setNotificationMessage({
        message: 'Tagin päivitys epäonnistui',
        type: 'error',
        timeout: 3000,
      })
    }
  }

  if (tag === null) {
    return <div>Ladataan...</div>
  }

  return (
    <div>
      <h2>Muokkaa tagia</h2>
      <form onSubmit={addTag}>
        <div>
          <label htmlFor="name">Nimi</label>
          <input
            type="text"
            id="name"
            name="name"
            value={tag.name}
            onChange={handleNameChange}
          />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <br></br>
        <div>
          <ColorPicker
            selectedColor={tag.color}
            onColorChange={handleColorChange}
          />
        </div>
        <br></br>
        <button type="submit">Tallenna tagi</button>
      </form>
      <button onClick={() => handleDeleteTag(tag.id)}>Poista tagi</button>

      {notificationMessage.message && (
        <Notification
          message={notificationMessage.message}
          type={notificationMessage.type}
          timeout={notificationMessage.timeout}
          onClose={() => setNotificationMessage({})}
        />
      )}
    </div>
  )
}

export default EditTag
