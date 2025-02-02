import React from 'react'
import { Navigate } from 'react-router-dom'
import decodeToken from '../utils/decode'

const PrivateRoute = ({ element, requiredRoles }) => {
  const token = decodeToken()

  if (!token || (requiredRoles && !requiredRoles.includes(token.role))) {
    return <Navigate to="/" />
  }

  return element
}

export default PrivateRoute
