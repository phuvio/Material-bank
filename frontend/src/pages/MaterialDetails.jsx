import React, { useState } from 'react'

const MaterialDetails = ({ material }) => {
  return (
    <div>
      <h3>Valitse materiaalin tiedot</h3>
      {material.name} <br/>
      {material.description} <br/>
    </div>
  )
}

export default MaterialDetails
