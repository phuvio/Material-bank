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

vi.mock('../utils/decode', () => ({
  default: vi.fn(() => ({
    user_id: '123',
    fullname: 'John Doe',
  })),
}))

describe('UserDropdown Component', () => {
  const mockSetIsLoggedIn = vi.fn()

  beforeEach(() => {
    render(
      <div>
        <UserDropdown setIsLoggedIn={mockSetIsLoggedIn} />
      </div>
    )
  })

  it('should display the correct user name in the dropdown', () => {
    const dropdown = screen.getByTitle('Kirjautuneena: John Doe')
    expect(dropdown).toBeInTheDocument()
  })

  it('should navigate to change password page when "Vaihda salasana" is selected', async () => {
    fireEvent.change(screen.getByTitle('Kirjautuneena: John Doe'), {
      target: { value: 'changePassword' },
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/changepassword/123')
    })
  })

  it('should log out the user when "Kirjaudu ulos" is selected', async () => {
    fireEvent.change(screen.getByTitle('Kirjautuneena: John Doe'), {
      target: { value: 'logout' },
    })

    await waitFor(() => {
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
