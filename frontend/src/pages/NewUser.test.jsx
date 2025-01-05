import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewUser from './NewUser'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import * as userService from '../services/users'

beforeEach(() => {
  vi.clearAllMocks()
})

vi.mock('../services/users', () => ({
  create: vi.fn(() => Promise.resolve()),
}))

const showNotificationMock = vi.fn()

describe('NewUser Component', () => {
  test('renders form inputs and submit button', () => {
    render(<NewUser showNotification={showNotificationMock} />)

    // Check that the form fields are rendered
    expect(screen.getByLabelText(/Käyttäjätunnus:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Etunimi:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Sukunimi:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Salasana:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Rooli:/)).toBeInTheDocument()

    // Check that the submit button is rendered
    expect(screen.getByText(/Tallenna/)).toBeInTheDocument()
  })

  test('updates form state on input change', () => {
    render(<NewUser showNotification={showNotificationMock} />)

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    fireEvent.change(usernameInput, {
      target: { value: 'john.doe@proneuron.fi' },
    })

    // Check if the form state is updated
    expect(usernameInput.value).toBe('john.doe@proneuron.fi')
  })

  test('shows validation errors when form is submitted with missing or invalid data', async () => {
    render(<NewUser showNotification={showNotificationMock} />)

    const submitButton = screen.getByText(/Tallenna/)

    // Submit the form with invalid data
    fireEvent.click(submitButton)

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Käyttäjätunnuksen tulee olla pronen sähköpostiosoite/)
      ).toBeInTheDocument()
      expect(screen.getByText(/Etunimi on pakollinen/)).toBeInTheDocument()
      expect(screen.getByText(/Sukunimi on pakollinen/)).toBeInTheDocument()
      expect(screen.getByText(/Salasana on pakollinen/)).toBeInTheDocument()
      expect(screen.getByText(/Rooli on pakollinen/)).toBeInTheDocument()
    })
  })

  test('displays failure notification after failed user creation', async () => {
    userService.create.mockResolvedValue({
      id: 1,
      username: 'john.doe@proneuron.fi',
    })

    render(<NewUser showNotification={showNotificationMock} />)

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    const firstNameInput = screen.getByLabelText(/Etunimi:/)
    const lastNameInput = screen.getByLabelText(/Sukunimi:/)
    const passwordInput = screen.getByLabelText(/Salasana:/)
    const roleSelect = screen.getByLabelText(/Rooli:/)

    // Fill in the form with valid data
    fireEvent.change(usernameInput, {
      target: { value: 'doe@proneuron.fi' },
    })
    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(roleSelect, { target: { value: '1' } })

    const submitButton = screen.getByText(/Tallenna/)

    // Submit the form
    fireEvent.click(submitButton)

    // Wait for the notification to appear
    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Käyttäjän luonti epäonnistui',
        'error',
        3000
      )
    })
  })
})
