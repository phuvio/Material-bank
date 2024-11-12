import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import axios from 'axios'
import Main_page from './pages/Main_page'
import MaterialDetails from './pages/MaterialDetails'
import Users from './pages/Users'
import NewUser from './pages/NewUser'
import apiUrl from './config/config'
import NewMaterial from './pages/NewMaterial'
import LoginForm from './pages/LoginForm'

const App = () => {
  const [materials, setMaterials] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${apiUrl}/api/materials`)
        .then((response) => {
          console.log('Api response:', response.data)
          setMaterials(response.data)
        })
        .catch((error) => {
          console.log('Error fetching data:', error)
        })
    }
  }, [isLoggedIn])

  const handleLoginForm = (loggedInUser) => {
    setIsLoggedIn(true)
    setLoggedInUser(loggedInUser)
    navigate('/')
  }

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginForm} />
  }

  return (
    <div>
      <div>
        <Link to={'/'}>Materiaalit</Link>
        <Link to={'/users'}>Käyttäjähallinta</Link>
      </div>
      <Routes>
        <Route
          path="/materials"
          element={<Main_page materials={materials} />}
        />
        <Route path="/materials/:id" element={<MaterialDetails />} />
        <Route path="/" element={<Navigate to="/materials" replace={true} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/newmaterial" element={<NewMaterial />} />
      </Routes>
    </div>
  )
}

export default App
