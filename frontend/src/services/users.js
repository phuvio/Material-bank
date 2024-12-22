import axios from 'axios'
import apiUrl from '../config/config'

const getAll = () => {
    const request = axios.get(`${apiUrl}/api/users`)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(`${apiUrl}/api/users`, newObject)
    return request.then(response => response.data)
}   

export default { getAll, create }
