import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../config/config'
import LoadMaterialButton from '../components/Load_material_button'

const MaterialDetails = () => {
  const { id } = useParams()
  const [material, setMaterial] = useState(null)

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/materials/${id}`)
      .then((res) => {
        console.log('Material details:', res.data)
        setMaterial(res.data)
      })
      .catch((error) => {
        console.log('Error fetching material:', error)
      })
  }, [id])

  if (!material) {
    return <div>Haetaan materiaalia</div>
  }

  return (
    <div>
      <h1>{material.name}</h1>
      <p>{material.description}</p>
      {material.is_url && <LoadMaterialButton url={material.url} />}
      <p>Materiaalin tallentaja: {material.user_id}</p>
    </div>
  )
}

export default MaterialDetails
