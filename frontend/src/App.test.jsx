import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import * as loginService from './services/login'

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
      <button
        onClick={() => onLoginSuccess('fakeAccessToken', 'fakeRefreshToken')}
      >
        Login
      </button>
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

// Mock login service
vi.mock('./services/login', () => ({
  ...vi.importActual('./services/login'), // Keep other methods
  refreshToken: vi.fn(),
}))

// Mock decodeToken (if needed)
vi.mock('./utils/decodeToken', () => ({
  decodeToken: vi.fn(() => ({
    role: 'admin',
  })),
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

  it('logs out the user when refresh token is invalid or expired', async () => {
    vi.mocked(loginService.refreshToken).mockRejectedValue(
      new Error('Token expired')
    )

    localStorage.setItem('accessToken', 'fakeAccessToken')
    localStorage.setItem('refreshToken', 'fakeRefreshToken')

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
      expect(screen.getByText('Login Form')).toBeInTheDocument()
    })
  })

  it('does not render private routes if not authorized', () => {
    localStorage.removeItem('accessToken')
    render(
      <MemoryRouter initialEntries={['/private-route']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })
})
