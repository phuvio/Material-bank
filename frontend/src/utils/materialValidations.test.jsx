import { describe, it, expect, vi, beforeEach } from 'vitest'
import validateMaterial from './materialValidations'
import materialService from '../services/materials'

describe('validateMaterial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  vi.mock('../services/materials')

  it('should return an error if name is missing', async () => {
    const data = {
      description: 'Test description',
      is_url: true,
      url: 'http://example.com',
    }
    const errors = await validateMaterial(data)
    expect(errors.name).toBe('Anna materiaalille nimi')
  })

  it('should return an error if name is invalid', async () => {
    const data = {
      name: 'Invalid@Name',
      description: 'Test description',
      is_url: true,
      url: 'http://example.com',
    }
    const errors = await validateMaterial(data)
    expect(errors.name).toBe(
      'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    )
  })

  it('should return an error if name length is invalid', async () => {
    const data = {
      name: 'ab',
      description: 'Test description',
      is_url: true,
      url: 'http://example.com',
    }
    const errors = await validateMaterial(data)
    expect(errors.name).toBe('Nimen pituuden tulee olla 3-50 merkkiä')
  })

  it('should return an error if name is a duplicate', async () => {
    materialService.getAll.mockResolvedValue([{ name: 'Duplicate Name' }])
    const data = {
      name: 'Duplicate Name',
      description: 'Test description',
      is_url: true,
      url: 'http://example.com',
    }
    const errors = await validateMaterial(data)
    expect(errors.name).toBe('Tämän niminen materiaali on jo olemassa')
  })

  it('should return an error if description is missing', async () => {
    const data = { name: 'Valid Name', is_url: true, url: 'http://example.com' }
    const errors = await validateMaterial(data)
    expect(errors.description).toBe('Anna kuvaus')
  })

  it('should return an error if description length exceeds 500 characters', async () => {
    const data = {
      name: 'Valid Name',
      description: 'a'.repeat(501),
      is_url: true,
      url: 'http://example.com',
    }
    const errors = await validateMaterial(data)
    expect(errors.description).toBe(
      'Kuvaus saa olla enintään 500 merkkiä pitkä'
    )
  })

  it('should return an error if URL is invalid', async () => {
    const data = {
      name: 'Valid Name',
      description: 'Test description',
      is_url: true,
      url: 'invalid-url',
    }
    const errors = await validateMaterial(data)
    expect(errors.url).toBe('Anna validi URL-osoite')
  })

  it('should return an error if file size exceeds 10 MB', async () => {
    const data = {
      name: 'Valid Name',
      description: 'Test description',
      is_url: false,
      material: { size: 10000001, type: 'application/pdf' },
    }
    const errors = await validateMaterial(data)
    expect(errors.material).toBe('Tiedoston maksimikoko on 10 Mt')
  })

  it('should return an error if file type is not allowed', async () => {
    const data = {
      name: 'Valid Name',
      description: 'Test description',
      is_url: false,
      material: { size: 5000, type: 'application/unknown' },
    }
    const errors = await validateMaterial(data)
    expect(errors.material).toBe(
      'Sallitut tiedostomuodot ovat PDF, Word, Excel, PowerPoint ja kuvatiedostot'
    )
  })

  it('should return no errors for valid material data (URL)', async () => {
    materialService.getAll.mockResolvedValue([])
    const data = {
      name: 'Unique Name',
      description: 'Test description',
      is_url: true,
      url: 'http://example.com',
    }
    const errors = await validateMaterial(data)
    expect(errors).toEqual({})
  })
})
