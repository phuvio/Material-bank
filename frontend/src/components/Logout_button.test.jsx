import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, test, expect } from 'vitest'
import LogoutButton from './Logout_button'
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'

// Mock useNavigate directly from react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: vi.fn(),
}))

describe('LogoutButton Component', () => {
  test('clears localStorage, updates state and navigates on click', () => {
    // Mock functions for setIsLoggedIn and setLoggedInUser
    const setIsLoggedIn = vi.fn()
    const setLoggedInUser = vi.fn()

    // Create a mock navigate function
    const navigate = vi.fn()

    // Mock the useNavigate hook to return the mock function
    useNavigate.mockReturnValue(navigate)

    // Mock localStorage.clear() function
    const clearSpy = vi.fn()
    window.localStorage = { clear: clearSpy }

    // Render the LogoutButton component
    render(
      <Router>
        <LogoutButton
          setIsLoggedIn={setIsLoggedIn}
          setLoggedInUser={setLoggedInUser}
        />
      </Router>
    )

    // Click the logout button
    fireEvent.click(screen.getByText(/Kirjaudu ulos/))

    // Check that localStorage.clear was called
    expect(window.localStorage.clear).toHaveBeenCalled()

    // Verify that setIsLoggedIn and setLoggedInUser were called
    expect(setIsLoggedIn).toHaveBeenCalledWith(false)
    expect(setLoggedInUser).toHaveBeenCalledWith({})

    // Verify navigation to the home page
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
