import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Notification from './Notification'

// Mocking the onClose function
const mockOnClose = vi.fn()

describe('Notification component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders the notification with a message', () => {
    render(
      <Notification
        message="Test Message"
        length={100}
        type="message"
        onClose={mockOnClose}
      />
    )

    // Check if the message appears
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  test('does not render the notification when there is no message', () => {
    render(
      <Notification
        message={null}
        length={100}
        type="message"
        onClose={vi.fn()}
      />
    )

    // Check if no message is rendered
    expect(screen.queryByText('Test Message')).toBeNull()
  })

  test('calls onClose after the specified time (length)', async () => {
    render(
      <Notification
        message="Test Message"
        length={100}
        type="message"
        onClose={mockOnClose}
      />
    )

    // Ensure that onClose is not called immediately
    expect(mockOnClose).not.toHaveBeenCalled()

    // Wait for the specified time (2000ms) and check if onClose is called
    await waitFor(
      () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      },
      { timeout: 150 }
    )
  })

  test('applies correct CSS class based on type error', () => {
    // Test for 'error' type
    render(
      <Notification
        message="Test Message"
        length={100}
        type="error"
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Test Message').parentElement).toHaveClass(
      'notification-error'
    )
  })

  test('applies correct CSS class based on type warning', () => {
    // Test for 'warning' type
    render(
      <Notification
        message="Test Message"
        length={100}
        type="warning"
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Test Message').parentElement).toHaveClass(
      'notification-warning'
    )
  })

  test('applies correct CSS class based on type message', () => {
    // Test for default type (assumed to be 'message')
    render(
      <Notification
        message="Test Message"
        length={100}
        type="message"
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Test Message').parentElement).toHaveClass(
      'notification-message'
    )
  })

  test('cleans up timer when component is unmounted', () => {
    const { unmount } = render(
      <Notification
        message="Test Message"
        length={1000}
        type="message"
        onClose={mockOnClose}
      />
    )

    // Unmount the component before the timer finishes
    unmount()

    // Ensure onClose is not called after unmount
    expect(mockOnClose).not.toHaveBeenCalled()
  })
})
