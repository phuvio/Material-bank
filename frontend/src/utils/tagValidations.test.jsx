import { validateTag } from './tagValidations'
import tagService from '../services/tags'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('validateTag function', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  // Mocking tagService.getAll function
  vi.mock('../services/tags')

  it('should return an error if name is empty', async () => {
    const data = { name: '', color: 'red' }
    const errors = await validateTag(data)

    expect(errors.name).toBe('Anna tagille nimi')
    expect(errors.color).toBeUndefined()
  })

  it('should return an error if name contains invalid characters', async () => {
    const data = { name: 'Tag@123', color: 'blue' }
    const errors = await validateTag(data)

    expect(errors.name).toBe(
      'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
    )
  })

  it('should return an error if name is shorter than 3 characters', async () => {
    const data = { name: 'Ta', color: 'green' }
    const errors = await validateTag(data)

    expect(errors.name).toBe('Nimen pituuden tulee olla 3-30 merkkiä')
  })

  it('should return an error if name is longer than 30 characters', async () => {
    const data = {
      name: 'ThisIsAReallyLongTagNameThatJustKeepsGoing',
      color: 'yellow',
    }
    const errors = await validateTag(data)

    expect(errors.name).toBe('Nimen pituuden tulee olla 3-30 merkkiä')
  })

  it('should return an error if the tag name is a duplicate', async () => {
    // Mocking tagService.getAll to return a list with an existing tag
    tagService.getAll.mockResolvedValueOnce([{ name: 'Existing Tag' }])

    const data = { name: 'Existing Tag', color: 'pink' }
    const errors = await validateTag(data)

    expect(errors.name).toBe('Tämän niminen tagi on jo olemassa')
  })

  it('should return an error if color is not provided', async () => {
    const data = { name: 'Tag 1', color: '' }
    const errors = await validateTag(data)

    expect(errors.color).toBe('Valitse väri')
  })

  it('should not return any errors if the tag is valid', async () => {
    // Mocking tagService.getAll to return an empty list (no existing tags)
    tagService.getAll.mockResolvedValueOnce([])

    const data = { name: 'Valid Tag', color: 'blue' }
    const errors = await validateTag(data)

    expect(errors).toEqual({})
  })

  it('should handle case-insensitive duplicate tag names', async () => {
    // Mocking tagService.getAll to return a list with an existing tag in different case
    tagService.getAll.mockResolvedValueOnce([{ name: 'existing tag' }])

    const data = { name: 'Existing Tag', color: 'green' }
    const errors = await validateTag(data)

    expect(errors.name).toBe('Tämän niminen tagi on jo olemassa')
  })
})
