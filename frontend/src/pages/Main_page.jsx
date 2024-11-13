import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'

const Main_page = ({ materials }) => {
  return (
    <div>
      <h1>Valitse materiaali</h1>
      <ul>
        {materials.map(
          (material) =>
            material.visible && (
              <li key={material.id}>
                <Link to={`/materials/${material.id}`}>{material.name}</Link>
                <br />
                {material.description}
                <br />
                {material.is_url && <LoadLinkButton url={material.url} />}
                {!material.is_url && (
                  <LoadMaterialButton materialId={material.id} />
                )}
              </li>
            )
        )}
      </ul>
      <p>
        <Link to={'/newmaterial'}>Luo uusi materiaali</Link>
      </p>
    </div>
  )
}

export default Main_page
