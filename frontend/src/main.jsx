import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'

const materials = [
  {
    id: 1,
    name: 'materiaali 1',
    description: 'tämä on testi aineisto',
    visible: true,
    user_id: 1,
    is_URL: false,
    URL: '',
    material: '',
  },
  {
    id: 2,
    name: 'muistipeli',
    description: 'tämä on testi aineisto',
    visible: true,
    user_id: 1,
    is_URL: false,
    URL: '',
    material: '',
  },
  {
    id: 3,
    name: 'pomppivat pallot',
    description: 'tämä on testi aineisto',
    visible: false,
    user_id: 1,
    is_URL: false,
    URL: '',
    material: '',
  },
]

ReactDOM.createRoot(document.getElementById('root')).render(<App materials={materials} />)
