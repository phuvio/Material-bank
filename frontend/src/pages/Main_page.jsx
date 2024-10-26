import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LoadMaterialButton from '../components/Load_material_button'

const Main_page = ({ materials }) => {

  return (
    <div>
      <h3>Valitse materiaali</h3>
      <ul>
        {materials.map(
          (material) =>
            material.visible && (
              <li key={material.id}>
                <Link to={'/materials/${material.id}'} >{material.name}</Link>
                <br />
                {material.description}
                <br />
                {material.URL}
                <br />
                <LoadMaterialButton url={ material.url } />
              </li>
            )
        )}
      </ul>
    </div>
  )
}

export default Main_page
