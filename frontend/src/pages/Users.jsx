import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService
      .getAll()
      .then((returnedUsers) => {
        setUsers(returnedUsers)
      })
      .catch((error) => {
        console.log('Error fetching data:', error)
      })
  }, [])

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name}
            <br />
            {user.username}
            <br />
            {user.role === 1 ? 'pääkäyttäjä' : 'peruskäyttäjä'}
          </li>
        ))}
      </ul>
      <p>
        <Link to={'/newuser'}>Luo uusi käyttäjä</Link>
      </p>
    </div>
  )
}

export default Users
