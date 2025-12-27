import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div>
      <h2>Sivua ei löydy</h2>
      <p>Tätä sivua ei löydy.</p>
      <Link to="/materiaalit">Palaa materiaalit sivulle</Link>
    </div>
  )
}

export default NotFoundPage
