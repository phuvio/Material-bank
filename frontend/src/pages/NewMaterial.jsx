import { useState } from 'react'
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
  })

  const navigate = useNavigate()

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const addMaterial = (event) => {
    event.preventDefault()
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        user_id: loggedInUser.user_id,
      }
      console.log('Lähtee tietokantaan:', updatedFormData)
      axios.post(`${apiUrl}/api/materials`, updatedFormData).then((res) => {
        setFormData({
          name: '',
          description: '',
          user_id: '',
          visible: true,
          is_url: false,
          url: '',
          material: null,
        })
        console.log('updatedFormData', updatedFormData)
        onMaterialAdded()
        navigate('/')
      })

      return updatedFormData
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
        <button type="submit">Tallenna</button>
      </form>
    </div>
  )
}

export default NewMaterial
