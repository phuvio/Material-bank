import tagService from '../services/tags'
import { regexName } from './validationRegex'

const checkDuplicateTagName = async (name) => {
  try {
    const tags = await tagService.getAll()

    const existingTag = tags.find(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    )
    return existingTag ? true : false
  } catch (error) {
    console.error('Error checking duplicate tag name:', error)
    return false
  }
}

export const validateTag = async (data) => {
  const errors = {}

  if (!data.name) {
    errors.name = 'Anna tagille nimi'
  } else if (!regexName.test(data.name)) {
    errors.name =
      'Nimessä voi olla vain kirjaimia, numeroita, välilyöntejä ja merkki /'
  } else if (data.name.length < 3 || data.name.length > 30) {
    errors.name = 'Nimen pituuden tulee olla 3-30 merkkiä'
  }

  const isDuplicate = await checkDuplicateTagName(data.name)
  if (isDuplicate) {
    errors.name = 'Tämän niminen tagi on jo olemassa'
  }

  if (!data.color) {
    errors.color = 'Valitse väri'
  }

  return errors
}

export const validateTagUpdate = async (data) => {
  const errors = {}

  if (!data.name) {
    errors.name = 'Anna tagille nimi'
  } else if (!regexName.test(data.name)) {
    errors.name = 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
  } else if (data.name.length < 3 || data.name.length > 30) {
    errors.name = 'Nimen pituuden tulee olla 3-30 merkkiä'
  }

  if (!data.color) {
    errors.color = 'Valitse väri'
  }

  return errors
}

export default { validateTag, validateTagUpdate }
