import materialService from '../services/materials'
import { regexName, regexURL } from './validationRegex'

const checkDuplicateMaterialName = async (name) => {
  try {
    const materials = await materialService.getAll()

    const existingMaterial = materials.find(
      (m) => m.name.toLowerCase() === name.toLowerCase()
    )
    return existingMaterial ? true : false
  } catch (error) {
    console.error('Error checking duplicate material name:', error)
    return false
  }
}

const validateFile = (file) => {
  const allowedMimeTypes = [
    'application/pdf', // PDF
    'application/msword', // Word 97-2003
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word 2007+
    'application/vnd.ms-excel', // Excel 97-2003
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel 2007+
    'application/vnd.ms-powerpoint', // PowerPoint 97-2003
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint 2007+
    'image/jpeg', // JPEG
    'image/jpg', // JPG
    'image/png', // PNG
    'image/gif', // GIF
    'image/bmp', // BMP
    'image/webp', // WebP
  ]

  return allowedMimeTypes.includes(file.type)
}

export const validateMaterial = async (data) => {
  const errors = {}

  if (!data.name) {
    errors.name = 'Anna materiaalille nimi'
  } else if (!regexName.test(data.name)) {
    errors.name = 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
  } else if (data.name.length < 3 || data.name.length > 50) {
    errors.name = 'Nimen pituuden tulee olla 3-50 merkkiä'
  }

  const isDuplicate = await checkDuplicateMaterialName(data.name)
  if (isDuplicate) {
    errors.name = 'Tämän niminen materiaali on jo olemassa'
  }

  if (!data.description) {
    errors.description = 'Anna kuvaus'
  } else if (data.description.length > 500) {
    errors.description = 'Kuvaus saa olla enintään 500 merkkiä pitkä'
  }

  if (data.is_url) {
    if (!data.url) {
      errors.url = 'Anna URL-osoite'
    } else if (!regexURL.test(data.url)) {
      errors.url = 'Anna validi URL-osoite'
    }
  } else {
    if (!data.material) {
      errors.material = 'Valitse tiedosto'
    } else if (data.material.size > 10000000) {
      errors.material = 'Tiedoston maksimikoko on 10 Mt'
    } else if (!validateFile(data.material)) {
      errors.material =
        'Sallitut tiedostomuodot ovat PDF, Word, Excel, PowerPoint ja kuvatiedostot'
    }
  }

  return errors
}

export const validateMaterialUpdate = async (data) => {
  const errors = {}

  if (!data.name) {
    errors.name = 'Anna materiaalille nimi'
  } else if (!regexName.test(data.name)) {
    errors.name = 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
  } else if (data.name.length < 3 || data.name.length > 50) {
    errors.name = 'Nimen pituuden tulee olla 3-50 merkkiä'
  }

  if (!data.description) {
    errors.description = 'Anna kuvaus'
  } else if (data.description.length > 500) {
    errors.description = 'Kuvaus saa olla enintään 500 merkkiä pitkä'
  }

  return errors
}
