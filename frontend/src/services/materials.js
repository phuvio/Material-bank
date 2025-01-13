import axios from 'axios'
import apiUrl from '../config/config'

const getAll = () => {
  const request = axios.get(`${apiUrl}/api/materials`)
  return request.then(response => response.data)
}

const create = (data) => {
  const request = axios.post(`${apiUrl}/api/materials`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return request.then(response => response.data)
}

const getSingle = id => {
  const request = axios.get(`${apiUrl}/api/materials/${id}`)
  return request.then(response => response.data)
}

const update = (id, data) => {
  const request = axios.put(`${apiUrl}/api/materials/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return request.then(response => response.data)
}

const remove = id => {
  const request = axios.delete(`${apiUrl}/api/materials/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, getSingle, update, remove }

/*
const getSingle = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/materials/${id}`, {
      responseType: 'blob',
    });

    // Create a download link for the file
    const contentDisposition = response.headers['content-disposition']
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/)
    const fileName = fileNameMatch ? fileNameMatch[1] : 'downloadedFile'

    // Create a blob URL and trigger download
    const blob = response.data;
    // eslint-disable-next-line no-undef
    const url = window.URL.createObjectURL(blob)
    // eslint-disable-next-line no-undef
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error('Error downloading file:', error)
  }
}
*/