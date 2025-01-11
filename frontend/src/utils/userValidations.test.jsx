import { describe, it, expect, vi } from 'vitest'
import userService from '../services/users'
import { validateUser, validateUserUpdate } from './userValidations'

// Mock the userService.getAll method for testing purposes
vi.mock('../services/users', () => {
  return {
    default: {
      getAll: vi.fn(),
    },
  }
})

describe('validateUser', () => {
  it('should return an error if username is missing', async () => {
    const data = {
      username: '',
      first_name: 'John',
      last_name: 'Doe',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.username).toBe('Käyttäjätunnus on pakollinen')
  })

  it('should return an error if username is not a valid email', async () => {
    const data = {
      username: 'invalidusername',
      first_name: 'John',
      last_name: 'Doe',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.username).toBe(
      'Käyttäjätunnuksen tulee olla pronen sähköpostiosoite'
    )
  })

  it('should return an error if username is a duplicate', async () => {
    vi.mocked(userService.getAll).mockResolvedValue([
      { username: 'existing@proneuron.fi' },
    ])
    const data = {
      username: 'existing@proneuron.fi',
      first_name: 'John',
      last_name: 'Doe',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.username).toBe('Tämä käyttäjätunnus on jo käytössä')
  })

  it('should return an error if first name is missing', async () => {
    const data = {
      username: 'new@proneuron.fi',
      first_name: '',
      last_name: 'Doe',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.first_name).toBe('Etunimi on pakollinen')
  })

  it('should return an error if first name is invalid', async () => {
    const data = {
      username: 'new@proneuron.fi',
      first_name: 'John123',
      last_name: 'Doe',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.first_name).toBe(
      'Etunimi saa sisältää vain kirjaimia ja väliviivan'
    )
  })

  it('should return an error if last name is missing', async () => {
    const data = {
      username: 'new@proneuron.fi',
      first_name: 'John',
      last_name: '',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.last_name).toBe('Sukunimi on pakollinen')
  })

  it('should return an error if last name is invalid', async () => {
    const data = {
      username: 'new@proneuron.fi',
      first_name: 'John',
      last_name: 'Doe123',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.last_name).toBe(
      'Sukunimi saa sisältää vain kirjaimia ja väliviivan'
    )
  })

  it('should return an error if password is missing', async () => {
    const data = {
      username: 'new@proneuron.fi',
      first_name: 'John',
      last_name: 'Doe',
      password: '',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.password).toBe('Salasana on pakollinen')
  })

  it('should return an error if password is invalid', async () => {
    const data = {
      username: 'new@proneuron.fi',
      first_name: 'John',
      last_name: 'Doe',
      password: 'short',
      role: 'admin',
    }
    const errors = await validateUser(data)
    expect(errors.password).toBe(
      'Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää: pieni ja iso kirjain, numero ja erikoismerkki: @$!#%*?&'
    )
  })

  it('should return an error if role is missing', async () => {
    const data = {
      username: 'new@proneuron.fi',
      first_name: 'John',
      last_name: 'Doe',
      password: 'Password123!',
      role: '',
    }
    const errors = await validateUser(data)
    expect(errors.role).toBe('Rooli on pakollinen')
  })
})

describe('validateUserUpdate', () => {
  it('should return an error if first name is missing', async () => {
    const data = {
      first_name: '',
      last_name: 'Doe',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUserUpdate(data)
    expect(errors.first_name).toBe('Etunimi on pakollinen')
  })

  it('should return an error if last name is missing', async () => {
    const data = {
      first_name: 'John',
      last_name: '',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUserUpdate(data)
    expect(errors.last_name).toBe('Sukunimi on pakollinen')
  })

  it('should return an error if password is invalid', async () => {
    const data = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'short',
      role: 'admin',
    }
    const errors = await validateUserUpdate(data)
    expect(errors.password).toBe(
      'Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältäen pienen ja ison kirjaimen sekä numeron'
    )
  })

  it('should return an error if role is missing', async () => {
    const data = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'Password123!',
      role: '',
    }
    const errors = await validateUserUpdate(data)
    expect(errors.role).toBe('Rooli on pakollinen')
  })

  it('should not return an error if all fields are valid', async () => {
    const data = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'Password123!',
      role: 'admin',
    }
    const errors = await validateUserUpdate(data)
    expect(Object.keys(errors)).toHaveLength(0)
  })
})
