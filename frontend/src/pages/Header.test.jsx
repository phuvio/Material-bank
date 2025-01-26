import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import { vi, describe, it, expect } from 'vitest'
import decodeToken from '../utils/decode'

// Mock the decodeToken module
vi.mock('../utils/decode', () => ({
  default: vi.fn(() => ({
    role: 'user', // Default role
    user_id: '123',
    fullname: 'John Doe',
  })),
}))

describe('Header', () => {
  const mockSetIsLoggedIn = vi.fn()

  it('renders the logo', () => {
    render(
      <MemoryRouter>
        <Header setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    )

    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders Materiaalit link', () => {
    render(
      <MemoryRouter>
        <Header setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    )

    const materiaalitLink = screen.getByText('Materiaalit')
    expect(materiaalitLink).toBeInTheDocument()
    expect(materiaalitLink).toHaveAttribute('href', '/')
  })

  it('renders admin links when user is admin', () => {
    decodeToken.mockReturnValue({ role: 'admin' }) // Mock admin role
    render(
      <MemoryRouter>
        <Header setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    )

    const usersLink = screen.getByText('Käyttäjähallinta')
    const tagAdminLink = screen.getByText('Tagien hallinta')

    expect(usersLink).toBeInTheDocument()
    expect(usersLink).toHaveAttribute('href', '/users')

    expect(tagAdminLink).toBeInTheDocument()
    expect(tagAdminLink).toHaveAttribute('href', '/tagadmin')
  })

  it('does not render admin links when user is not admin', () => {
    decodeToken.mockReturnValue({ role: 'user' }) // Mock user role
    render(
      <MemoryRouter>
        <Header setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    )

    const usersLink = screen.queryByText('Käyttäjähallinta')
    const tagAdminLink = screen.queryByText('Tagien hallinta')

    expect(usersLink).not.toBeInTheDocument()
    expect(tagAdminLink).not.toBeInTheDocument()
  })
})
