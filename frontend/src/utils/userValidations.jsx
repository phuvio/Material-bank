import userService from '../services/users'
import {
  regexUsername,
  regexFirstname,
  regexLastname,
  regexPassword,
} from './validationRegex'

export const validateUserUpdate = async (data) => {
  const errors = {}

  if (!data.first_name) {
    errors.first_name = 'Etunimi on pakollinen'
  } else if (!regexFirstname.test(data.first_name)) {
    errors.first_name = 'Etunimi saa sisältää vain kirjaimia ja väliviivan'
  }

  if (!data.last_name) {
    errors.last_name = 'Sukunimi on pakollinen'
  } else if (!regexLastname.test(data.last_name)) {
    errors.last_name = 'Sukunimi saa sisältää vain kirjaimia ja väliviivan'
  }

  if (data.password && !regexPassword.test(data.password)) {
    errors.password =
      'Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältäen pienen ja ison kirjaimen sekä numeron'
  }

  if (!data.role) {
    errors.role = 'Rooli on pakollinen'
  }

  return errors
}

const checkDuplicatUsername = async (username) => {
  try {
    const users = await userService.getAll()

    const existingUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    )
    return existingUser ? true : false
  } catch (error) {
    console.log('Error checking duplicate user name', error)
    return false
  }
}

export const validateUser = async (data) => {
  const errors = {}

  if (!data.username) {
    errors.name = 'Käyttäjätunnus on pakollinen'
  } else if (!regexUsername.test(data.username)) {
    errors.name = 'Käyttäjätunnuksen tulee olla pronen sähköpostiosoite'
  }

  const isDuplicate = await checkDuplicatUsername(data.username)
  if (isDuplicate) {
    errors.username = 'Tämä käyttäjätunnus on jo käytössä'
  }

  if (!data.first_name) {
    errors.first_name = 'Etunimi on pakollinen'
  } else if (!regexFirstname.test(data.first_name)) {
    errors.first_name = 'Etunimi saa sisältää vain kirjaimia ja väliviivan'
  }

  if (!data.last_name) {
    errors.last_name = 'Sukunimi on pakollinen'
  } else if (!regexLastname.test(data.last_name)) {
    errors.last_name = 'Sukunimi saa sisältää vain kirjaimia ja väliviivan'
  }

  if (!data.password) {
    errors.password = 'Salasana on pakollinen'
  } else if (!regexPassword.test(data.password)) {
    errors.password =
      'Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältäen pienen ja ison kirjaimen sekä numeron'
  }

  if (!data.role) {
    errors.role = 'Rooli on pakollinen'
  }

  return errors
}

export default { validateUser, validateUserUpdate }
