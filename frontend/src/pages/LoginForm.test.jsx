import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './LoginForm'
import loginService from '../services/login'
import { vi, describe, test, expect } from 'vitest'

// Mock loginService.login function
vi.mock('../services/login')

const showNotificationMock = vi.fn()

describe('Login Component', () => {
  test('renders form fields and button', () => {
    render(<Login onLoginSuccess={vi.fn()} />)

    // Check that the form fields are rendered
    expect(screen.getByLabelText(/Käyttäjätunnus:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Salasana:/)).toBeInTheDocument()
    expect(screen.getByText(/Kirjaudu sisään/)).toBeInTheDocument()
  })

  test('updates input fields on change', () => {
    render(
      <Login onLoginSuccess={vi.fn()} showNotification={showNotificationMock} />
    )

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
    const onLoginSuccess = vi.fn()

    render(
      <Login
        onLoginSuccess={onLoginSuccess}
        showNotification={showNotificationMock}
      />
    )

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
      expect(onLoginSuccess).toHaveBeenCalledWith({ username: 'test_user' })
    })
  })

  test('handles login errors gracefully', async () => {
    render(
      <Login onLoginSuccess={vi.fn()} showNotification={showNotificationMock} />
    )

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
    })
  })

  test('shows notification on failed login', async () => {
    const showNotification = vi.fn()

    render(
      <Login onLoginSuccess={vi.fn()} showNotification={showNotification} />
    )

    // Mock failed login
    loginService.login.mockResolvedValueOnce({ status: 400 })

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)

    // Simulate user typing into input fields
    fireEvent.change(usernameInput, { target: { value: 'wrong_user' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong_password' } })

    // Simulate form submission
    fireEvent.submit(screen.getByText(/Kirjaudu sisään/))

    // Check if notification is displayed
    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        'Väärä käyttäjätunnus tai salasana',
        'error',
        3000
      )
    })
  })
})
