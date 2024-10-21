import React, { useState } from 'react'

const Main_page = ({ materials }) => {
  return (
    <div>
      <h3>Valitse materiaali</h3>
      <ul>
        {materials.map(
          (material) =>
            material.visible && (
              <li key={material.id}>
                {material.name}
                <br />
                {material.description}
              </li>
            )
        )}
      </ul>
    </div>
  )
}

export default Main_page
