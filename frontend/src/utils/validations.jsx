import tagService from '../services/tags'

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

const validateTag = async (data) => {
  const errors = {}
  const regexTagName = /^[a-zA-ZäöåÄÖÅ0-9\s]+$/

  if (!data.name) {
    errors.name = 'Anna tagille nimi'
  } else if (!regexTagName.test(data.name)) {
    errors.name = 'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
  } else if (data.name.length < 3 || data.name.length > 20) {
    errors.name = 'Nimen pituuden tulee olla 3-20 merkkiä'
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

export default validateTag
