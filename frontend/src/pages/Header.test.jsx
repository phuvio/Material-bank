import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Header from './Header'
import decodeToken from '../utils/decode'

vi.mock('../utils/decode')

describe('Header', () => {
  const mockSetIsLoggedIn = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
  })

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

  it('renders admin links when user is admin', async () => {
    decodeToken.mockResolvedValue({ role: 'admin' }) // Simulate async response

    render(
      <MemoryRouter>
        <Header setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.getByText('Käyttäjähallinta')).toBeInTheDocument()
    )
    await waitFor(() =>
      expect(screen.getByText('Tagien hallinta')).toBeInTheDocument()
    )

    expect(screen.getByText('Käyttäjähallinta')).toHaveAttribute(
      'href',
      '/kayttajat'
    )
    expect(screen.getByText('Tagien hallinta')).toHaveAttribute(
      'href',
      '/tagit'
    )
  })

  it('does not render admin links when user is not admin', async () => {
    decodeToken.mockResolvedValue({ role: 'user' }) // Simulate user role

    render(
      <MemoryRouter>
        <Header setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Käyttäjähallinta')).not.toBeInTheDocument()
      expect(screen.queryByText('Tagien hallinta')).not.toBeInTheDocument()
    })
  })
})
