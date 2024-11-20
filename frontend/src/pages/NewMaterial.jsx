import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../config/config'

const NewMaterial = ({ loggedInUser, onMaterialAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id: '',
    visible: true,
    is_url: false,
    url: '',
    material: null,
    material_type: null,
  })

  const navigate = useNavigate()

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFormData((prevData) => ({
      ...prevData,
      material: file,
      material_type: file.type,
    }))
  }

  const addMaterial = (event) => {
    event.preventDefault()

    const formToSubmit = new FormData()

    formToSubmit.append('name', formData.name)
    formToSubmit.append('description', formData.description)
    formToSubmit.append('user_id', loggedInUser.user_id)
    formToSubmit.append('visible', true)
    formToSubmit.append('is_url', formData.is_url)

    if (formData.is_url) {
      formToSubmit.append('url', formData.url)
    } else {
      formToSubmit.append('material', formData.material)
      formToSubmit.append('material_type', formData.material_type)
    }

    console.log('Lähtee tietokantaan:')
    formToSubmit.forEach((value, key) => {
      console.log(key, value)
    })

    axios
      .post(`${apiUrl}/api/materials`, formToSubmit)
      .then((res) => {
        setFormData({
          name: '',
          description: '',
          user_id: '',
          visible: true,
          is_url: false,
          url: '',
          material: null,
          material_type: null,
        })
        console.log('updatedFormData', res.data)
        onMaterialAdded()
        navigate('/')
      })
      .catch((error) => {
        console.log('Error uploading material', error)
      })
  }

  return (
    <div>
      <h1>Luo uusi materiaali</h1>
      <form onSubmit={addMaterial}>
        <label>
          Materiaalin nimi:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Kuvaus:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Onko materiaali linkki:
          <input
            type="checkbox"
            name="is_url"
            checked={formData.is_url}
            onChange={handleFormChange}
          />
        </label>
        {formData.is_url && (
          <label>
            Linkki:
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleFormChange}
            />
          </label>
        )}
        {!formData.is_url && (
          <label>
            <input
              type="file"
              name="material"
              onChange={(event) => handleFileChange(event)}
            />
          </label>
        )}
        <button type="submit">Tallenna</button>
      </form>
    </div>
  )
}

export default NewMaterial
