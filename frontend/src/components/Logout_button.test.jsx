import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import { useNavigate } from 'react-router-dom'
import LogoutButton from '../components/Logout_button'
import { logout } from '../services/login'

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

// Mock logout function
vi.mock('../services/login', () => ({
  logout: vi.fn(),
}))

describe('LogoutButton', () => {
  it('clears localStorage, calls logout, updates state, and navigates', async () => {
    const user = userEvent.setup()
    const setIsLoggedIn = vi.fn()
    const navigate = vi.fn()

    // Mock useNavigate return value
    useNavigate.mockReturnValue(navigate)

    // Set something in localStorage before clicking the button
    window.localStorage.setItem('testKey', 'testValue')

    render(<LogoutButton setIsLoggedIn={setIsLoggedIn} />)

    const button = screen.getByRole('button', { name: /kirjaudu ulos/i })
    await user.click(button)

    // Expect localStorage to be cleared
    expect(window.localStorage.getItem('testKey')).toBeNull()

    // Expect logout function to be called
    expect(logout).toHaveBeenCalled()

    // Expect setIsLoggedIn to be set to false
    expect(setIsLoggedIn).toHaveBeenCalledWith(false)

    // Expect navigation to '/'
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
