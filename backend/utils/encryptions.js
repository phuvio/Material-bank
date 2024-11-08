// eslint-disable-next-line no-redeclare
const crypto = require('crypto')

// Load encryption key from environment variables
const encryptionKey = process.env.ENCRYPTION_KEY // Should be 32 bytes for AES-256
const algorithm = 'aes-256-cbc'
const ivLength = 16 // iv length

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey, 'hex'),
    iv
  )
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  console.log(encrypted)
  return { iv: iv.toString('hex'), encryptedData: encrypted } // Store IV with encrypted data
}

function decrypt(encryptedData, iv) {
  const key = Buffer.from(encryptionKey, 'hex')
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  )
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = { encrypt, decrypt }
