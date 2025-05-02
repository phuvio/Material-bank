import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/users'
import Filter from '../components/Filter'

const Users = ({ showNotification }) => {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    userService
      .getAll()
      .then((returnedUsers) => {
        setUsers(returnedUsers)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        showNotification('Virhe haettaessa käyttäjiä.', 'error', 3000)
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
    <div className="container">
      <div className="column left">
        <h2>Etsi käyttäjistä</h2>
        <Filter
          value={filter}
          handleChange={({ target }) => setFilter(target.value)}
        />
        <p>
          <Link to={'/uusikayttaja'}>Luo uusi käyttäjä</Link>
        </p>
      </div>
      <div className="column right">
        <h1>Käyttäjät</h1>
        <ul>
          {usersToShow
            .slice()
            .sort((a, b) => (a.first_name > b.first_name ? 1 : -1))
            .map((user) => (
              <li key={user.id}>
                <div className="user-details">
                  <span>
                    <Link to={`/muokkaakayttajaa/${user.id}`}>
                      {user.first_name} {user.last_name}
                    </Link>
                  </span>
                  <span>{user.username}</span>
                  <span>
                    {user.role === 'admin'
                      ? 'pääkäyttäjä'
                      : user.role === 'basic'
                        ? 'peruskäyttäjä'
                        : 'moderaattori'}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Users
