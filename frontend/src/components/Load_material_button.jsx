import axios from 'axios'
import apiUrl from '../config/config'

const LoadMaterialButton = ({ material }) => {
  const handleClick = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/materials/${material.id}/material`,
        {
          responseType: 'blob',
        }
      )

      if (response.data && response.data.size > 0) {
        const contentType =
          response.headers['content-type'] || 'application/octet-stream'
        const fileBlob = response.data
        const blobUrl = window.URL.createObjectURL(fileBlob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `${material.name}.${contentType.split('/')[1] || 'bin'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      } else {
        console.log('No file data returned')
      }
    } catch (error) {
      console.log('Error opening file', error)
    }
  }

  return (
    <button onClick={handleClick} title="Avaa tiedosto">
      Lataa tiedosto
    </button>
  )
}

export default LoadMaterialButton
