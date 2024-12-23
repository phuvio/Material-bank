import React, { useEffect } from 'react'
import '../styles/Notification.css'

const Notification = ({ message, timeout, type, onClose }) => {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onClose()
    }, timeout)

    return () => clearTimeout(timer)
  }, [message, timeout, onClose])

  const notificationClass = `notification ${
    type === 'error'
      ? 'notification-error'
      : type === 'warning'
        ? 'notification-warning'
        : 'notification-message'
  }`

  return (
    <div className={notificationClass}>
      <p>{message}</p>
    </div>
  )
}

export default Notification
