import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Main_page from './pages/Main_page'
import MaterialDetails from './pages/MaterialDetails'

const App = () => {
  const [materials, setMaterials] = useState([])

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL 
    
    axios
      .get('http://localhost:3001/api/materials')
      .then((response) => {
        console.log(response)
        setMaterials(response.data)
      })
      .catch((error) => {
        console.log('Error fetching data:', error)
      })
  }, [])

  return (
    <div>
      <Routes>
        <Route path='/materials/:id' element={<MaterialDetails material={materials[0]} />} />
        <Route path='/materials' element={<Main_page materials={materials} />} />
        <Route path='/' element={<Navigate to='/materials' replace={true} />} />
      </Routes>
    </div>
  )
}

export default App
