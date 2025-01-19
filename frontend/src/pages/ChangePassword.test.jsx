import { describe, it, vi, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChangePassword from './ChangePassword'
import userService from '../services/users'

vi.mock('../services/users', () => ({
  default: {
    getSingle: vi.fn(),
    updatePassword: vi.fn(),
  },
}))

describe('ChangePassword Component', () => {
  const mockShowNotification = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    userService.getSingle.mockResolvedValue({ id: '1', name: 'John Doe' })
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ChangePassword showNotification={mockShowNotification} />}
          />
        </Routes>
      </BrowserRouter>
    )
  }

  it('renders the form correctly', () => {
    renderComponent()
    expect(screen.getByLabelText(/Nykyinen salasana:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Uusi salasana:/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Uusi salasana uudelleen:/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Vaatimukset salasanalle:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tallenna/i })).toBeDisabled()
  })

  it('updates progress bars and enables save button when valid passwords are entered', () => {
    renderComponent()

    const newPasswordInput = screen.getByLabelText(/Uusi salasana:/i)
    const newPasswordAgainInput = screen.getByLabelText(
      /Uusi salasana uudelleen:/i
    )

    fireEvent.change(newPasswordInput, { target: { value: 'Valid1Password!' } })
    fireEvent.change(newPasswordAgainInput, {
      target: { value: 'Valid1Password!' },
    })

    expect(screen.getByTestId('password-strength')).toHaveAttribute(
      'value',
      '5'
    )
    expect(
      screen.getByTestId('password-confirmation-strength')
    ).toHaveAttribute('value', '1')
    expect(screen.getByRole('button', { name: /Tallenna/i })).toBeEnabled()
  })

  it('disables save button if passwords do not match', () => {
    renderComponent()

    const newPasswordInput = screen.getByLabelText(/Uusi salasana:/i)
    const newPasswordAgainInput = screen.getByLabelText(
      /Uusi salasana uudelleen:/i
    )

    fireEvent.change(newPasswordInput, { target: { value: 'Valid1Password!' } })
    fireEvent.change(newPasswordAgainInput, {
      target: { value: 'DifferentPassword!' },
    })

    expect(screen.getByTestId('password-strength')).toHaveAttribute(
      'value',
      '5'
    )
    expect(
      screen.getByTestId('password-confirmation-strength')
    ).toHaveAttribute('value', '0')
    expect(screen.getByRole('button', { name: /Tallenna/i })).toBeDisabled()
  })

  it('handles successful password update', async () => {
    userService.updatePassword.mockResolvedValue({ status: 200 })

    renderComponent()

    fireEvent.change(screen.getByLabelText(/Nykyinen salasana:/i), {
      target: { value: 'OldPassword123!' },
    })
    fireEvent.change(screen.getByLabelText(/Uusi salasana:/i), {
      target: { value: 'NewPassword123!' },
    })
    fireEvent.change(screen.getByLabelText(/Uusi salasana uudelleen:/i), {
      target: { value: 'NewPassword123!' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Tallenna/i }))

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Salasana päivitetty onnistuneesti',
        'message',
        2000
      )
    })
  })

  it('handles incorrect old password error', async () => {
    userService.updatePassword.mockRejectedValue({
      response: { status: 400, data: { error: 'Incorrect old password' } },
    })

    renderComponent()

    fireEvent.change(screen.getByLabelText(/Nykyinen salasana:/i), {
      target: { value: 'WrongOldPassword!' },
    })
    fireEvent.change(screen.getByLabelText(/Uusi salasana:/i), {
      target: { value: 'NewPassword123!' },
    })
    fireEvent.change(screen.getByLabelText(/Uusi salasana uudelleen:/i), {
      target: { value: 'NewPassword123!' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Tallenna/i }))

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Nykyinen salasana ei täsmää',
        'error',
        3000
      )
    })
  })

  it('handles server errors gracefully', async () => {
    userService.updatePassword.mockRejectedValue({
      response: { status: 500 },
    })

    renderComponent()

    fireEvent.change(screen.getByLabelText(/Nykyinen salasana:/i), {
      target: { value: 'OldPassword123!' },
    })
    fireEvent.change(screen.getByLabelText(/Uusi salasana:/i), {
      target: { value: 'NewPassword123!' },
    })
    fireEvent.change(screen.getByLabelText(/Uusi salasana uudelleen:/i), {
      target: { value: 'NewPassword123!' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Tallenna/i }))

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Salasanan päivitys epäonnistui',
        'error',
        3000
      )
    })
  })
})
