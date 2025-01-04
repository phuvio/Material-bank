import React from 'react'
import '../styles/Notification.css'

const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  const notificationClass = `notification ${
    {
      error: 'notification-error',
      warning: 'notification-warning',
      message: 'notification-message',
    }[type] || 'notification-message'
  }`

  return (
    <div className={notificationClass}>
      <p>{message}</p>
    </div>
  )
}

export default Notification
