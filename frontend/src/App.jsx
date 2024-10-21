import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useMatch } from 'react-router-dom'
import axios from 'axios'
import Main_page from './components/Main_page'
import MaterialDetails from './components/MaterialDetails'

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
        <Route path='/' element={<Main_page materials={materials} />} />
      </Routes>
    </div>
  )
}

export default App
