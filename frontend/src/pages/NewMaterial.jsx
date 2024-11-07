import { useState } from 'react'
import axios from 'axios'
import apiUrl from '../config/config'

const NewMaterial = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id: '',
    is_URL: false,
    URL: '',
    material: null,
  })

  const handleFormChange = (event) => {
    console.log(formData)
    const { name, value, type, checked } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const addMaterial = (event) => {
    event.preventDefault()
    axios.post(`${apiUrl}/api/users`, formData).then((res) => {
      setFormData({
        name: '',
        description: '',
        user_id: '',
        is_URL: false,
        URL: '',
        material: null,
      })
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
            name="is_URL"
            checked={formData.is_URL}
            onChange={handleFormChange}
          />
        </label>
        {formData.is_URL && (
          <label>
            Linkki:
            <input
              type="url"
              name="URL"
              value={formData.URL}
              onChange={handleFormChange}
            />
          </label>
        )}
        <button type="submit">Tallenna</button>
      </form>
    </div>
  )
}

export default NewMaterial
