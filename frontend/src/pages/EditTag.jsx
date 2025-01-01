import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import tagService from '../services/tags'
import Notification from '../components/Notification'
import ColorPicker from '../components/ColorPicker'

const EditTag = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tag, setTag] = useState(null)
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

  const addTag = (e) => {
    e.preventDefault()

    if (validate()) {
      tagService
        .update(tag)
        .then(() => {
          setNotificationMessage({
            message: 'Tagi päivitetty onnistuneesti',
            type: 'message',
            timeout: 2000,
          })
          navigate('/tags')
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

  const validate = () => {
    const regexTagName = /^[a-zA-ZäöåÄÖÅ0-9\s]+$/
    const errors = {}
    if (!regexTagName.test(tag.name)) {
      errors.name = 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
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
        <button type="submit">Luo tagi</button>
      </form>

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
