import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import UserDropdown from './UserDropdown'

const mockNavigate = vi.fn()
// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: vi.fn(() => mockNavigate),
    MemoryRouter: ({ children }) => <div>{children}</div>, // Mock MemoryRouter
  }
})

describe('UserDropdown Component', () => {
  const mockSetIsLoggedIn = vi.fn()
  const mockSetLoggedInUser = vi.fn()

  const loggedInUser = { user_id: '123', role: 'user' }

  beforeEach(() => {
    render(
      <div>
        <UserDropdown
          loggedInUser={loggedInUser}
          setIsLoggedIn={mockSetIsLoggedIn}
          setLoggedInUser={mockSetLoggedInUser}
        />
      </div>
    )
  })

  it('should render the user icon', () => {
    const userIcon = screen.getByAltText('User icon')
    expect(userIcon).toBeInTheDocument()
  })

  it('should toggle the dropdown menu on user icon click', () => {
    const dropdownButton = screen.getByRole('button', { name: /User menu/i })
    fireEvent.click(dropdownButton)
    expect(screen.getByText('Vaihda salasana')).toBeInTheDocument()
    fireEvent.click(dropdownButton)
    expect(screen.queryByText('Vaihda salasana')).toBeNull()
  })

  it('should navigate to change password page when "Vaihda salasana" is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: /User menu/i }))
    fireEvent.click(screen.getByText('Vaihda salasana'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/changepassword/123')
    })
  })

  it('should log out the user when "Kirjaudu ulos" is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: /User menu/i }))
    fireEvent.click(screen.getByText('Kirjaudu ulos'))

    await waitFor(() => {
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false)
      expect(mockSetLoggedInUser).toHaveBeenCalledWith({})
    })
  })
})
