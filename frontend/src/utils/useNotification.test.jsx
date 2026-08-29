import React, { useEffect } from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should initialize with default values', async () => {
    await act(async () => {
      render(<TestComponent />)
    })

    expect(screen.getByTestId('message').textContent).toBe('')
    expect(screen.getByTestId('type').textContent).toBe('message')
  })

  it('should update message and type when showNotification is called', async () => {
    await act(async () => {
      render(
        <TestComponent
          triggerNotification={(showNotification) => {
            showNotification('Test message', 'success', 5000)
          }}
        />
      )
    })

    expect(screen.getByTestId('message').textContent).toBe('Test message')
    expect(screen.getByTestId('type').textContent).toBe('success')
  })

  it('should reset the timer when showNotification is called again', async () => {
    await act(async () => {
      render(
        <TestComponent
          triggerNotification={(showNotification) => {
            showNotification('First message', 'error', 3000)
            showNotification('Second message', 'info', 4000)
          }}
        />
      )
    })

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByTestId('message').textContent).toBe('Second message')

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('message').textContent).toBe('Second message')
  })
})
