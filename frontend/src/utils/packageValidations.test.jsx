import { describe, it, expect, vi, beforeEach } from 'vitest'
import packageService from '../services/packages'
import { validatePackage, validatePackageUpdate } from './packageValidations'

// Mock packageService
vi.mock('../services/packages', () => ({
  default: { getAll: vi.fn() },
}))

describe('validatePackage', () => {
  const mockPackages = [
    { id: 1, name: 'Existing Package' },
    { id: 2, name: 'Another Package' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    packageService.getAll.mockResolvedValue(mockPackages)
  })

  it('returns error if name is missing', async () => {
    const errors = await validatePackage({ name: '', description: 'desc' })
    expect(errors.name).toBe('Anna paketille nimi')
  })

  it('returns error if name has invalid characters', async () => {
    const errors = await validatePackage({
      name: 'Invalid@Name!',
      description: 'desc',
    })
    expect(errors.name).toBe(
      'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    )
  })

  it('returns error if name is too short', async () => {
    const errors = await validatePackage({ name: 'ab', description: 'desc' })
    expect(errors.name).toBe('Nimen pituuden tulee olla 3-50 merkkiä')
  })

  it('returns error if name is too long', async () => {
    const longName = 'a'.repeat(51)
    const errors = await validatePackage({
      name: longName,
      description: 'desc',
    })
    expect(errors.name).toBe('Nimen pituuden tulee olla 3-50 merkkiä')
  })

  it('returns error if package name already exists (case-insensitive)', async () => {
    const errors = await validatePackage({
      name: 'existing package',
      description: 'desc',
    })
    expect(errors.name).toBe('Tämän niminen paketti on jo olemassa')
  })

  it('returns error if description is missing', async () => {
    const errors = await validatePackage({
      name: 'Valid Name',
      description: '',
    })
    expect(errors.description).toBe('Anna kuvaus')
  })

  it('returns empty object if all fields are valid and name is unique', async () => {
    const errors = await validatePackage({
      name: 'Unique Name',
      description: 'Valid description',
    })
    expect(errors).toEqual({})
  })

  it('handles errors in checkDuplicatePackageName gracefully', async () => {
    packageService.getAll.mockRejectedValue(new Error('DB error'))
    const errors = await validatePackage({
      name: 'Any Name',
      description: 'desc',
    })
    // Should not throw, just skip duplicate check
    expect(errors.name).toBeUndefined()
  })
})

describe('validatePackageUpdate', () => {
  it('returns error if name is missing', async () => {
    const errors = await validatePackageUpdate({
      name: '',
      description: 'desc',
    })
    expect(errors.name).toBe('Anna paketille nimi')
  })

  it('returns error if name has invalid characters', async () => {
    const errors = await validatePackageUpdate({
      name: 'Invalid@@',
      description: 'desc',
    })
    expect(errors.name).toBe(
      'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    )
  })

  it('returns error if name is too short', async () => {
    const errors = await validatePackageUpdate({
      name: 'aa',
      description: 'desc',
    })
    expect(errors.name).toBe('Nimen pituuden tulee olla 3-50 merkkiä')
  })

  it('returns error if name is too long', async () => {
    const longName = 'a'.repeat(51)
    const errors = await validatePackageUpdate({
      name: longName,
      description: 'desc',
    })
    expect(errors.name).toBe('Nimen pituuden tulee olla 3-50 merkkiä')
  })

  it('returns error if description is missing', async () => {
    const errors = await validatePackageUpdate({
      name: 'Valid Name',
      description: '',
    })
    expect(errors.description).toBe('Anna kuvaus')
  })

  it('returns empty object if all fields are valid', async () => {
    const errors = await validatePackageUpdate({
      name: 'Valid Name',
      description: 'Valid description',
    })
    expect(errors).toEqual({})
  })
})
