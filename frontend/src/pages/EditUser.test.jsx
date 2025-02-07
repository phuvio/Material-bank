import { describe, it, vi, beforeEach, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EditUser from './EditUser'
import userService from '../services/users'

vi.mock('../services/users', () => ({
  default: {
    getSingle: vi.fn(),
    update: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  }
})

describe('EditUser Component', () => {
  const mockUser = {
    first_name: 'Test',
    last_name: 'User',
    role: 'admin',
  }

  const showNotification = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    userService.getSingle.mockResolvedValue(mockUser)
    userService.update.mockResolvedValue()
  })

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route
            path="/edit/:id"
            element={<EditUser showNotification={showNotification} />}
          />
        </Routes>
      </MemoryRouter>
    )

  it('renders the edit user form with user data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByLabelText(/Etunimi/i)).toHaveValue('Test')
      expect(screen.getByLabelText(/Sukunimi/i)).toHaveValue('User')
    })
  })

  it.skip('updates form fields on user input', async () => {
    renderComponent()

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Etunimi:/i), {
        target: { value: 'Updated' },
      })
    })

    expect(screen.getByLabelText(/Etunimi/i)).toHaveValue('Updated')
  })

  it.skip('submits the form and calls updateUser', async () => {
    renderComponent()

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Etunimi:/i), {
        target: { value: 'Updated' },
      })
    })

    const button = screen.getByRole('button', { name: /Tallenna/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(userService.update).toHaveBeenCalledWith('123', {
        first_name: 'Updated',
        last_name: 'User',
        role: 'admin',
      })
      expect(showNotification).toHaveBeenCalledWith(
        'Käyttäjän tiedot päivitetty onnistuneesti',
        'message',
        2000
      )
      expect(mockNavigate).toHaveBeenCalledWith('/kayttajat')
    })
  })

  it('shows an error notification on failed update', async () => {
    userService.update.mockRejectedValue(new Error('Update failed'))
    renderComponent()

    const button = screen.getByRole('button', { name: /Tallenna/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        'Käyttäjän päivitys epäonnistui',
        'error',
        3000
      )
    })
  })
})
