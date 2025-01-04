import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import materialService from './services/materials'

// Mock the material service
vi.mock('./services/materials', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

// Mock useNotification
vi.mock('./utils/UseNotification', () => ({
  default: () => ({
    showNotification: vi.fn(),
  }),
}))

describe('App Component', () => {
  const mockMaterials = [
    { id: 1, name: 'Material 1' },
    { id: 2, name: 'Material 2' },
  ]

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })

    materialService.getAll.mockResolvedValue(mockMaterials)
  })

  it('renders login form when not logged in', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('button', { name: /kirjaudu sisään/i })
    ).toBeInTheDocument()
  })

  it('navigates to users page for admin', async () => {
    window.localStorage.getItem.mockReturnValue(
      JSON.stringify({ username: 'admin', role: 1 })
    )
    render(
      <MemoryRouter initialEntries={['/users']}>
        <App />
      </MemoryRouter>
    )
    await waitFor(() =>
      expect(screen.getByText(/Käyttäjähallinta/i)).toBeInTheDocument()
    )
  })
})
