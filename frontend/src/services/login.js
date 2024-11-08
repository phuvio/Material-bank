import axios from 'axios'
import apiUrl from '../config/config'

const login = async credentials => {
    const response = await axios.post(`${apiUrl}/api/login`, credentials)
    return response
}

export default { login }
