import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/users'
import Filter from '../components/Filter'
import userRoles from '../config/userRoles'

const Users = ({ showNotification }) => {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const roles = userRoles.slice(1, 4)

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

  const usersToShow = users.filter((user) => {
    const matchesRole = selectedRole ? user.role === selectedRole : true
    const matchesfilter =
      filter.length === 0
        ? users
        : users.filter((u) =>
            (u.first_name + u.last_name)
              .toLowerCase()
              .includes(filter.toLocaleLowerCase())
          )
    return matchesRole && matchesfilter.includes(user)
  })

  const toggleRole = useCallback((role) => {
    setSelectedRole(role[0])
  }, [])

  return (
    <div className="container">
      <div className="column left">
        <h2>Etsi käyttäjistä</h2>
        <Filter
          value={filter}
          handleChange={({ target }) => setFilter(target.value)}
        />
        <div>
          {roles.map((role) => (
            <div key={role[0]} className="role-info">
              <label>
                <input
                  type="radio"
                  name="role"
                  id={role[0]}
                  checked={selectedRole === role[0]}
                  onChange={() => toggleRole(role)}
                />
                <span className="role-tag" style={{ fontSize: '14px' }}>
                  {role[1]}
                </span>
              </label>
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={() => {
              setSelectedRole(null)
              setFilter('')
            }}
          >
            Tyhjennä valinnat
          </button>
        </div>
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
