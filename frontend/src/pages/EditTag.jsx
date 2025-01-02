import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import tagService from '../services/tags'
import Notification from '../components/Notification'
import ColorPicker from '../components/ColorPicker'

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

    const isValid = await validate()

    if (isValid) {
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

  const checkDuplicateTagName = async (name) => {
    try {
      const tags = await tagService.getAll()

      const existingTag = tags.find(
        (t) => t.name.toLowerCase() === name.toLowerCase()
      )
      return existingTag ? true : false
    } catch (error) {
      console.error('Error checking duplicate tag name:', error)
      return false
    }
  }

  const validate = async () => {
    const regexTagName = /^[a-zA-ZäöåÄÖÅ0-9\s]+$/
    const errors = {}
    if (!regexTagName.test(tag.name)) {
      errors.name = 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    }

    const isDuplicate = await checkDuplicateTagName(tag.name)
    if (isDuplicate) {
      errors.name = 'Tämän niminen tagi on jo olemassa'
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
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
