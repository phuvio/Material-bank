import axios from 'axios'

const LoadMaterialButton = ({ materialId }) => {
  const handleClick = async () => {
    try {
      const response = await axios.get(`/api/material/${materialId}/material`, {
        responseType: 'blob',
      })
      console.log('Response Data Type:', response.data.constructor.name)
      console.log('MaterialId', materialId)
      console.log('Material response data:', response.data)
      if (response.data && response.data > 0) {
        const contentType =
          response.headers['content-type'] || 'application/octet-stream'
        const fileBlob = response.data
        const blobUrl = window.URL.createObjectURL(fileBlob)

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `${materialId}.${contentType.split('/')[1] || 'bin'}`
        console.log('linkki:', link.download)
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
