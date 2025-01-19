import React from 'react'
import axios from 'axios'
import apiUrl from '../config/config'

const getFileExtensionFromContentType = (contentType) => {
  switch (contentType) {
    // Word document
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return '.docx'
    // Excel spreadsheet
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return '.xlsx'
    // PowerPoint presentation
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return '.pptx'
    // PDF document
    case 'application/pdf':
      return '.pdf'
    // Image formats
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/gif':
      return '.gif'
    case 'image/tiff':
      return '.tiff'
    case 'image/bmp':
      return '.bmp'
    // Default fallback for unknown types
    default:
      return '.bin'
  }
}

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
        const contentType = response.headers['content-type'] || ''

        // Extract filename from content-disposition
        let fileName = `${material.name}`

        // If filename is not found in content-disposition, use content-type to determine extension
        if (!fileName.includes('.')) {
          const fileExtension = getFileExtensionFromContentType(contentType)
          fileName = `${fileName}${fileExtension}`
        }

        const fileBlob = response.data
        const blobUrl = window.URL.createObjectURL(fileBlob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
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
      Tiedosto
    </button>
  )
}

export default LoadMaterialButton
