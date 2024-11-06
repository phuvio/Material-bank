import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import axios from 'axios'
import Main_page from './pages/Main_page'
import MaterialDetails from './pages/MaterialDetails'
import NewUser from './pages/NewUser'
import apiUrl from './config/config'

const App = () => {
  const [materials, setMaterials] = useState([])

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/materials`)
      .then((response) => {
        console.log('Api response:', response.data)
        setMaterials(response.data)
      })
      .catch((error) => {
        console.log('Error fetching data:', error)
      })
  }, [])

  return (
    <div>
      <div>
        <Link to={'/'}>Materiaalit</Link>
        <Link to={'/newuser'}>Uusi käyttäjä</Link>
      </div>
      <Routes>
        <Route
          path="/materials"
          element={<Main_page materials={materials} />}
        />
        <Route path="/materials/:id" element={<MaterialDetails />} />
        <Route path="/" element={<Navigate to="/materials" replace={true} />} />
        <Route path="/newuser" element={<NewUser />} />
      </Routes>
    </div>
  )
}

export default App
