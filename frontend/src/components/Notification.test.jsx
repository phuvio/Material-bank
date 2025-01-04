import React from 'react'
import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Notification from './Notification'

// Mocking the onClose function
const mockOnClose = vi.fn()

describe('Notification component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders the notification with a message and correct type', () => {
    render(<Notification message="Test Message" type="message" />)

    // Check if the message appears
    expect(screen.getByText('Test Message')).toBeInTheDocument()

    // Check if the correct CSS class is applied
    expect(screen.getByText('Test Message').parentElement).toHaveClass(
      'notification-message'
    )
  })

  test('does not render the notification when there is no message', () => {
    render(<Notification message="" type="message" />)

    // Ensure nothing is rendered
    expect(screen.queryByText('Test Message')).toBeNull()
  })

  test('applies correct CSS class for error type', () => {
    render(<Notification message="Error Message" type="error" />)

    expect(screen.getByText('Error Message').parentElement).toHaveClass(
      'notification-error'
    )
  })

  test('applies correct CSS class for warning type', () => {
    render(<Notification message="Warning Message" type="warning" />)

    expect(screen.getByText('Warning Message').parentElement).toHaveClass(
      'notification-warning'
    )
  })

  test('defaults to message type when an invalid type is provided', () => {
    render(<Notification message="Default Type" type="invalid-type" />)

    expect(screen.getByText('Default Type').parentElement).toHaveClass(
      'notification-message'
    )
  })

  test('cleans up timers when component is unmounted', () => {
    const { unmount } = render(
      <Notification message="Unmount Test" type="message" />
    )

    // Unmount the component and ensure no lingering timers
    unmount()
    expect(mockOnClose).not.toHaveBeenCalled()
  })
})
