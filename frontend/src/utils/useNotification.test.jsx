import React, { useEffect } from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useNotification from './useNotification'

// Helper component for testing the hook
const TestComponent = ({ triggerNotification }) => {
  const { message, type, showNotification } = useNotification()

  useEffect(() => {
    if (triggerNotification) {
      triggerNotification(showNotification)
    }
  }, [triggerNotification, showNotification])

  return (
    <div>
      <div data-testid="message">{message}</div>
      <div data-testid="type">{type}</div>
    </div>
  )
}

describe('useNotification', () => {
  vi.useFakeTimers()

  it('should initialize with default values', () => {
    render(<TestComponent />)

    expect(screen.getByTestId('message').textContent).toBe('')
    expect(screen.getByTestId('type').textContent).toBe('message')
  })

  it('should update message and type when showNotification is called', () => {
    render(
      <TestComponent
        triggerNotification={(showNotification) =>
          act(() => {
            showNotification('Test message', 'success', 5000)
          })
        }
      />
    )

    expect(screen.getByTestId('message').textContent).toBe('Test message')
    expect(screen.getByTestId('type').textContent).toBe('success')
  })

  it('should reset the timer when showNotification is called again', () => {
    render(
      <TestComponent
        triggerNotification={(showNotification) => {
          act(() => {
            showNotification('First message', 'error', 3000)
          })
          act(() => {
            showNotification('Second message', 'info', 4000)
          })
        }}
      />
    )

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // The second message should be displayed
    expect(screen.getByTestId('message').textContent).toBe('Second message')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('message').textContent).toBe('Second message')
  })
})
