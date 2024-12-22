import React, { useEffect } from 'react'
import '../styles/notification.css'

const Notification = ({ message, length, type, onClose }) => {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onClose()
    }, length)

    return () => clearTimeout(timer)
  }, [message, length, onClose])

  const notificationClass = `notification ${
    type === 'error'
      ? 'notification-error'
      : type === 'warning'
        ? 'notification-warning'
        : 'notifivation-message'
  }`

  return (
    <div className={notificationClass}>
      <p>{message}</p>
    </div>
  )
}

export default Notification
