import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// Mock components and utilities
vi.mock('./pages/Main_page', () => ({
  default: () => <div>Main Page</div>,
}))
vi.mock('./pages/MaterialDetails', () => ({
  default: () => <div>Material Details</div>,
}))
vi.mock('./pages/LoginForm', () => ({
  default: ({ onLoginSuccess }) => (
    <div>
      Login Form
      <button onClick={onLoginSuccess}>Login</button>
    </div>
  ),
}))
vi.mock('./components/Notification', () => ({
  default: ({ message, type }) => (
    <div className={`notification notification-${type || 'message'}`}>
      {message && <p>{message}</p>}
    </div>
  ),
}))
vi.mock('./pages/Header', () => ({
  default: () => <div>Header</div>,
}))
vi.mock('./utils/useNotification', () => ({
  default: () => ({
    message: 'Test Notification',
    type: 'message',
    showNotification: vi.fn(),
  }),
}))

describe('App Component', () => {
  it('renders the login form when not logged in', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })

  it('shows notification when a message is passed', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Test Notification')).toBeInTheDocument()
  })

  it('redirects to login when trying to access protected routes while logged out', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })
})
