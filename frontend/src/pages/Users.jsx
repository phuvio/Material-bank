import NewUser from './NewUser'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import axios from 'axios'
import apiUrl from '../config/config'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/users`)
      .then((response) => {
        console.log('Api response:', response)
        setUsers(response.data)
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
            {user.first_name}
            <br />
            {user.last_name}
            <br />
            {user.username}
            <br />
            {user.role}
          </li>
        ))}
      </ul>
      <p>
        <Link to={`/newuser`}>Luo uusi käyttäjä</Link>
      </p>
    </div>
  )
}

export default Users
