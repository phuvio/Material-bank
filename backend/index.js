import express from 'express'
import cors from 'cors'

const app = express()

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

app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/materials', (request, response) => {
  response.json(materials)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
