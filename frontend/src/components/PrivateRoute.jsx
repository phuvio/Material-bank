import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import decode from '../utils/decode'

const PrivateRoute = ({ element, requiredRoles }) => {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchToken = async () => {
      const token = await decode()
      setToken(token)
      setLoading(false)
    }

    fetchToken()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!token || (requiredRoles && !requiredRoles.includes(token.role))) {
    return <Navigate to="/" />
  }

  return element
}

export default PrivateRoute
