import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import Main_page from "./components/Main_page";

const App = () => {
  const [materials, setMaterials] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/materials')
      .then(response => {
        console.log(response)
        setMaterials(response.data)
      })
      .catch(error => {
        console.log('Error fetching data:', error)
      })
  }, [])

  return (
    <div>
      <Header />
      <Main_page materials={materials} />
    </div>
  )
};

export default App;
