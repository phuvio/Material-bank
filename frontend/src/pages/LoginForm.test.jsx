import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './LoginForm'
import loginService from '../services/login'
import { vi, describe, test, beforeEach, expect } from 'vitest'

// Mock loginService.login function
vi.mock('../services/login')

const showNotificationMock = vi.fn()
const onLoginSuccessMock = vi.fn()

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

  test('successful login stores tokens and calls onLoginSuccess', async () => {
    loginService.login.mockResolvedValue({
      status: 200,
      data: {
        accessToken: 'mockAccessToken',
      },
    })

    render(
      <Login
        onLoginSuccess={onLoginSuccessMock}
        showNotification={showNotificationMock}
      />
    )

    fireEvent.change(screen.getByLabelText(/käyttäjätunnus:/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByLabelText(/salasana:/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('login-button'))

    await waitFor(() => {
      expect(window.localStorage.getItem('accessToken')).toBe('mockAccessToken')
      expect(onLoginSuccessMock).toHaveBeenCalledWith('mockAccessToken')
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
        'Väärä käyttäjätunnus tai salasana',
        'error',
        3000
      )
    })
  })
})
