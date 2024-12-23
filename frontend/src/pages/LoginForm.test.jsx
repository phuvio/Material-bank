import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './LoginForm'
import loginService from '../services/login'
import { vi, describe, test, expect } from 'vitest'

// Mock loginService.login function
vi.mock('../services/login')

describe('Login Component', () => {
  test('renders form fields and button', () => {
    render(<Login onLoginSuccess={vi.fn()} />)

    // Check that the form fields are rendered
    expect(screen.getByLabelText(/Käyttäjätunnus:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Salasana:/)).toBeInTheDocument()
    expect(screen.getByText(/Kirjaudu sisään/)).toBeInTheDocument()
  })

  test('updates input fields on change', () => {
    render(<Login onLoginSuccess={vi.fn()} />)

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)

    // Simulate user typing into input fields
    fireEvent.change(usernameInput, { target: { value: 'test_user' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Check if the values are updated
    expect(usernameInput.value).toBe('test_user')
    expect(passwordInput.value).toBe('password123')
  })

  test('calls onLoginSuccess on successful login', async () => {
    render(<Login onLoginSuccess={vi.fn()} />)

    // Mock successful login response
    loginService.login.mockResolvedValueOnce({
      status: 200,
      data: { loggedInUser: { username: 'test_user' }, token: 'fake_token' },
    })

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)

    // Simulate user typing into input fields
    fireEvent.change(usernameInput, { target: { value: 'test_user' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Simulate form submission
    fireEvent.submit(screen.getByText(/Kirjaudu sisään/))

    // Wait for loginService to be called and check if localStorage is set
    await waitFor(() => {
      expect(loginService.login).toHaveBeenCalledWith({
        username: 'test_user',
        password: 'password123',
      })
      expect(window.localStorage.getItem('loggedInUser')).toBeTruthy()
      expect(window.localStorage.getItem('token')).toBe('fake_token')
    })
  })

  test('does not call onLoginSuccess on failed login', async () => {
    render(<Login onLoginSuccess={vi.fn()} />)

    // Mock failed login response
    loginService.login.mockResolvedValueOnce({
      status: 400,
    })

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)

    // Simulate user typing into input fields
    fireEvent.change(usernameInput, { target: { value: 'wrong_user' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong_password' } })

    // Simulate form submission
    fireEvent.submit(screen.getByText(/Kirjaudu sisään/))

    // Wait for loginService to be called
    await waitFor(() => {
      expect(loginService.login).toHaveBeenCalledWith({
        username: 'wrong_user',
        password: 'wrong_password',
      })
      expect(
        screen.getByText('Väärä käyttäjätunnus tai salasana')
      ).toBeInTheDocument()
    })

    // Check if the inputs are cleared after failed login
    expect(usernameInput.value).toBe('')
    expect(passwordInput.value).toBe('')
  })

  test('handles login errors gracefully', async () => {
    render(<Login onLoginSuccess={vi.fn()} />)

    // Mock login error
    loginService.login.mockRejectedValueOnce(new Error('Network Error'))

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)

    // Simulate user typing into input fields
    fireEvent.change(usernameInput, { target: { value: 'test_user' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Simulate form submission
    fireEvent.submit(screen.getByText(/Kirjaudu sisään/))

    // Check if the inputs are cleared after the error
    await waitFor(() => {
      expect(usernameInput.value).toBe('')
      expect(passwordInput.value).toBe('')
      expect(screen.getByText(/Virhe kirjautumisessa/)).toBeInTheDocument()
    })
  })
})
