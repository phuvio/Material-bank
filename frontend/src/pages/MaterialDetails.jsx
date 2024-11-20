import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../config/config'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'

const MaterialDetails = () => {
  const { id } = useParams()
  const [material, setMaterial] = useState(null)

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/materials/${id}`)
      .then((res) => {
        const data = res.data
        const date = new Date(data.updated_at)
        data.id = id
        data.updated_at = date.toLocaleDateString('fi-FI')
        setMaterial(data)
      })
      .catch((error) => {
        console.log('Error fetching material:', error)
      })
  }, [id])

  if (!material) {
    return <div>Haetaan materiaalia...</div>
  }

  return (
    <div>
      <h1>{material.name}</h1>
      <p>{material.description}</p>
      {material.is_url && <LoadLinkButton url={material.url} />}
      {!material.is_url && <LoadMaterialButton material={material} />}
      <p>
        Materiaalin tallentaja: {material.User.first_name}{' '}
        {material.User.last_name}
      </p>
      <p>Muokattu: {material.updated_at}</p>
    </div>
  )
}

export default MaterialDetails
