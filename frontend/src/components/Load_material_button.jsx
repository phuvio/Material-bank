import axios from 'axios'

const LoadMaterialButton = ({ materialId }) => {
  const handleClick = async () => {
    try {
      const response = await axios.get(`/api/material/${materialId}/material`, {
        responseType: 'Blob',
      })

      const fileBlob = response.data
      const blobUrl = window.URL.createObjectURL(new Blob([fileBlob]))

      window.open(blobUrl, '_blank')
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
