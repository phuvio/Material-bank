import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import materialService from './services/materials'

// Mock the material service
vi.mock('./services/materials', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

describe('App Component', () => {
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
})
