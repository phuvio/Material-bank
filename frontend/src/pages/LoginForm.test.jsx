import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './LoginForm'
import loginService from '../services/login'
import { vi, describe, test, beforeEach, expect } from 'vitest'
import decodeToken from '../utils/decode'

// Mock loginService.login function
vi.mock('../services/login')
vi.mock('../utils/decode', () => ({
  default: vi.fn(() => ({
    fullname: 'Test User',
    username: 'test_user',
    role: 'admin',
    user_id: 123,
  })),
}))

const showNotificationMock = vi.fn()

beforeEach(() => {
  window.localStorage.clear()
  vi.spyOn(window.localStorage.__proto__, 'setItem')
  vi.spyOn(window.localStorage.__proto__, 'getItem')
})

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

  test('calls onLoginSuccess on successful login', async () => {
    const onLoginSuccess = vi.fn()

    loginService.login.mockResolvedValueOnce({
      status: 200,
      data: { token: 'fake_token' },
    })

    decodeToken.mockReturnValueOnce({
      fullname: 'Test User',
      username: 'test_user',
      role: 'admin',
      user_id: 123,
    })

    render(
      <Login
        onLoginSuccess={onLoginSuccess}
        showNotification={showNotificationMock}
      />
    )

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)

    fireEvent.change(usernameInput, {
      target: { value: 'test.user@proneuron.fi' },
    })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    fireEvent.submit(screen.getByText(/Kirjaudu sisään/))

    await waitFor(() => {
      expect(loginService.login).toHaveBeenCalledWith({
        username: 'test.user@proneuron.fi',
        password: 'password123',
      })
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'token',
        'fake_token'
      )
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'loggedInUser',
        JSON.stringify({
          fullname: 'Test User',
          username: 'test_user',
          role: 'admin',
          user_id: 123,
        })
      )
      expect(onLoginSuccess).toHaveBeenCalledWith({
        fullname: 'Test User',
        username: 'test_user',
        role: 'admin',
        user_id: 123,
      })
    })
  })

  test('shows notification on failed login', async () => {
    loginService.login.mockRejectedValueOnce(new Error('Login failed'))

    render(
      <Login onLoginSuccess={vi.fn()} showNotification={showNotificationMock} />
    )

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)

    fireEvent.change(usernameInput, { target: { value: 'wrong_user' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong_pass' } })

    fireEvent.submit(screen.getByText(/Kirjaudu sisään/))

    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Virhe kirjautumisessa',
        'error',
        3000
      )
    })
  })
})
