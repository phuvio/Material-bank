import { describe, it, expect, beforeAll } from 'vitest'

let encrypt
let decrypt

beforeAll(async () => {
  process.env.ENCRYPTION_KEY = Buffer.from('12345678901234561234567890123456').toString('hex');

  // Import after setting env variable
  ({ encrypt, decrypt } = await import('./encryptions.js')); 
})

describe('Encryption and Decryption', () => {
  it('should encrypt and decrypt back to original text', () => {
    const original = 'Hello, world!'
    const { iv, encryptedData } = encrypt(original)

    expect(iv).toBeDefined()
    expect(encryptedData).toBeDefined()
    expect(encryptedData).not.toEqual(original)

    const decrypted = decrypt(encryptedData, iv)

    expect(decrypted).toEqual(original)
  })

  it('should produce different ciphertexts for the same plaintext due to different IVs', () => {
    const original = 'Repeatable message'
    const first = encrypt(original)
    const second = encrypt(original)

    expect(first.encryptedData).not.toEqual(second.encryptedData)
    expect(first.iv).not.toEqual(second.iv)

    // But decrypt should revert back to the original
    expect(decrypt(first.encryptedData, first.iv)).toEqual(original)
    expect(decrypt(second.encryptedData, second.iv)).toEqual(original)
  })

  it('should throw if incorrect key is used to decrypt', () => {
    // Save original key
    const originalKey = process.env.ENCRYPTION_KEY

    // Set a different key
    process.env.ENCRYPTION_KEY = Buffer.from('00000000000000000000000000000000').toString('hex')

    // Import decrypt with the new key
    return import("./encryptions.js").then((mod) => {
      expect(() => mod.decrypt(encryptedData, iv)).toThrow()
      // Restore original afterwards
      process.env.ENCRYPTION_KEY = originalKey
    })
  })

  it('should throw if invalid IV is provided', () => {
    const original = 'Another message'
    const { iv, encryptedData } = encrypt(original)

    // Provide invalid IV
    expect(() => decrypt(encryptedData, '00')).toThrow()
  })
})
