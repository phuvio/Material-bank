// Header.test.js
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import { vi, describe, it, expect, fireEvent, waitFor } from 'vitest'

describe('Header', () => {
  const setIsLoggedIn = vi.fn()
  const setLoggedInUser = vi.fn()

  it('renders the logo', () => {
    render(
      <MemoryRouter>
        <Header
          loggedInUser={{ role: 'user' }}
          setIsLoggedIn={setIsLoggedIn}
          setLoggedInUser={setLoggedInUser}
        />
      </MemoryRouter>
    )

    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders Materiaalit link', () => {
    render(
      <MemoryRouter>
        <Header
          loggedInUser={{ role: 'user' }}
          setIsLoggedIn={setIsLoggedIn}
          setLoggedInUser={setLoggedInUser}
        />
      </MemoryRouter>
    )

    const materiaalitLink = screen.getByText('Materiaalit')
    expect(materiaalitLink).toBeInTheDocument()
    expect(materiaalitLink).toHaveAttribute('href', '/')
  })

  it('renders admin links when user is admin', () => {
    render(
      <MemoryRouter>
        <Header
          loggedInUser={{ role: 'admin' }}
          setIsLoggedIn={setIsLoggedIn}
          setLoggedInUser={setLoggedInUser}
        />
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
    render(
      <MemoryRouter>
        <Header
          loggedInUser={{ role: 'user' }}
          setIsLoggedIn={setIsLoggedIn}
          setLoggedInUser={setLoggedInUser}
        />
      </MemoryRouter>
    )

    const usersLink = screen.queryByText('Käyttäjähallinta')
    const tagAdminLink = screen.queryByText('Tagien hallinta')

    expect(usersLink).not.toBeInTheDocument()
    expect(tagAdminLink).not.toBeInTheDocument()
  })
})
