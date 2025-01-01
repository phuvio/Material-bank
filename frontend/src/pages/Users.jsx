import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import userService from '../services/users'
import Filter from '../components/Filter'

const Users = () => {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')

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

  const usersToShow =
    filter.length === 0
      ? users
      : users.filter((u) =>
          (u.first_name + u.last_name)
            .toLowerCase()
            .includes(filter.toLocaleLowerCase())
        )

  return (
    <div>
      <h2>Etsi käyttäjistä</h2>
      <Filter
        value={filter}
        handleChange={({ target }) => setFilter(target.value)}
      />
      <h1>Käyttäjät</h1>
      <ul>
        {usersToShow.map((user) => (
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
