import { useState } from 'react'

const useNotification = () => {
  const [message, setMessage] = useState('')
  const [type, setType] = useState('message')

  const showNotification = (message, type = 'error', timeout = 3000) => {
    setMessage(message)
    setTimeout(() => setMessage(''), timeout)
    setType(type)
  }

  return { message, type, showNotification }
}

export default useNotification
