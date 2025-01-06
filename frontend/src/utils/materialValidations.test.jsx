import { describe, it, expect, vi, beforeEach } from 'vitest'
import materialService from '../services/materials'
import { validateMaterial, validateMaterialUpdate } from './materialValidations'

vi.mock('../services/materials', () => {
  return {
    default: {
      getAll: vi.fn(),
    },
  }
})

describe('validateMaterial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return an error if name is missing', async () => {
    const data = { description: 'Test description', material: {} }
    const result = await validateMaterial(data)
    expect(result.name).toBe('Anna materiaalille nimi')
  })

  it('should return an error for invalid name format', async () => {
    const data = {
      name: 'Invalid@Name!',
      description: 'Test description',
      material: {},
    }
    const result = await validateMaterial(data)
    expect(result.name).toBe(
      'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    )
  })

  it('should return an error if the name is a duplicate', async () => {
    materialService.getAll.mockResolvedValueOnce([{ name: 'Duplicate' }])
    const data = {
      name: 'Duplicate',
      description: 'Test description',
      material: {},
    }
    const result = await validateMaterial(data)
    expect(result.name).toBe('Tämän niminen materiaali on jo olemassa')
  })

  it('should return an error if description is missing', async () => {
    const data = { name: 'Valid Name', material: {} }
    const result = await validateMaterial(data)
    expect(result.description).toBe('Anna kuvaus')
  })

  it('should return an error if description exceeds 500 characters', async () => {
    const longDescription = 'a'.repeat(501)
    const data = {
      name: 'Valid Name',
      description: longDescription,
      material: {},
    }
    const result = await validateMaterial(data)
    expect(result.description).toBe(
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
    const result = await validateMaterial(data)
    expect(result.url).toBe('Anna validi URL-osoite')
  })

  it('should return an error for missing file if not a URL', async () => {
    const data = {
      name: 'Valid Name',
      description: 'Test description',
      is_url: false,
    }
    const result = await validateMaterial(data)
    expect(result.material).toBe('Valitse tiedosto')
  })

  it('should return an error if file size exceeds 10MB', async () => {
    const data = {
      name: 'Valid Name',
      description: 'Test description',
      is_url: false,
      material: { size: 10000001, type: 'application/pdf' },
    }
    const result = await validateMaterial(data)
    expect(result.material).toBe('Tiedoston maksimikoko on 10 Mt')
  })

  it('should return an error for unsupported file type', async () => {
    const data = {
      name: 'Valid Name',
      description: 'Test description',
      is_url: false,
      material: { size: 5000, type: 'application/unsupported' },
    }
    const result = await validateMaterial(data)
    expect(result.material).toBe(
      'Sallitut tiedostomuodot ovat PDF, Word, Excel, PowerPoint ja kuvatiedostot'
    )
  })

  it('should pass validation for valid data', async () => {
    materialService.getAll.mockResolvedValueOnce([])
    const data = {
      name: 'Valid Name',
      description: 'Valid description',
      is_url: false,
      material: { size: 5000, type: 'application/pdf' },
    }
    const result = await validateMaterial(data)
    expect(result).toEqual({})
  })
})

describe('validateMaterialUpdate', () => {
  it('should return an error if name is missing', async () => {
    const data = { description: 'Test description' }
    const result = await validateMaterialUpdate(data)
    expect(result.name).toBe('Anna materiaalille nimi')
  })

  it('should return an error for invalid name format', async () => {
    const data = { name: 'Invalid@Name!', description: 'Test description' }
    const result = await validateMaterialUpdate(data)
    expect(result.name).toBe(
      'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    )
  })

  it('should return an error if description exceeds 500 characters', async () => {
    const longDescription = 'a'.repeat(501)
    const data = { name: 'Valid Name', description: longDescription }
    const result = await validateMaterialUpdate(data)
    expect(result.description).toBe(
      'Kuvaus saa olla enintään 500 merkkiä pitkä'
    )
  })

  it('should pass validation for valid update data', async () => {
    const data = { name: 'Valid Name', description: 'Valid description' }
    const result = await validateMaterialUpdate(data)
    expect(result).toEqual({})
  })
})
