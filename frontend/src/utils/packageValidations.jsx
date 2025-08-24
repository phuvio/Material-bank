import packageService from '../services/packages'
import { regexName } from './validationRegex'

const checkDuplicatePackageName = async (name) => {
  try {
    const allPackages = await packageService.getAll()

    const existingPackage = allPackages.find(
      (pkg) => pkg.name.toLowerCase() === name.toLowerCase()
    )
    return existingPackage ? true : false
  } catch (error) {
    console.error('Error checking duplicate package name:', error)
    return false
  }
}

export const validatePackage = async (data) => {
  const errors = {}

  if (!data.name) {
    errors.name = 'Anna paketille nimi'
  } else if (!regexName.test(data.name)) {
    errors.name = 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
  } else if (data.name.length < 3 || data.name.length > 50) {
    errors.name = 'Nimen pituuden tulee olla 3-50 merkkiä'
  }

  const isDuplicate = await checkDuplicatePackageName(data.name)
  if (isDuplicate) {
    errors.name = 'Tämän niminen paketti on jo olemassa'
  }

  if (!data.description) {
    errors.description = 'Anna kuvaus'
  } else if (data.description.length > 500) {
    errors.description = 'Kuvaus saa olla enintään 500 merkkiä pitkä'
  }

  return errors
}

export const validatePackageUpdate = async (data) => {
  const errors = {}

  if (!data.name) {
    errors.name = 'Anna paketille nimi'
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
