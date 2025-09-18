import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Users from './Users'
import { vi, describe, test, expect } from 'vitest'
import { BrowserRouter as Router } from 'react-router-dom'
import userService from '../services/users'

vi.mock('../services/users', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

describe('Users Component', () => {
  test('renders users list when data is fetched successfully', async () => {
    const mockUsers = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        role: 'admin',
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        username: 'janedoe',
        role: 'basic',
      },
    ]
    userService.getAll.mockResolvedValueOnce(mockUsers)

    render(
      <Router>
        <Users showNotification={vi.fn()} />
      </Router>
    )

    await waitFor(() => {
      expect(userService.getAll).toHaveBeenCalled()
    })

    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/johndoe/)).toBeInTheDocument()
    expect(screen.getByText(/pääkäyttäjä/)).toBeInTheDocument()

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/janedoe/)).toBeInTheDocument()
    expect(screen.getByText(/peruskäyttäjä/)).toBeInTheDocument()
  })

  test('displays error message when API request fails', async () => {
    userService.getAll.mockRejectedValueOnce(new Error('Error fetching data'))
    const mockShowNotification = vi.fn()

    render(
      <Router>
        <Users showNotification={mockShowNotification} />
      </Router>
    )

    await waitFor(() => {
      expect(userService.getAll).toHaveBeenCalled()
    })

    expect(mockShowNotification).toHaveBeenCalledWith(
      'Virhe haettaessa käyttäjiä.',
      'error',
      3000
    )

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
  })

  test('filters users by selected role (radio button)', async () => {
    const mockUsers = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        role: 'admin',
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        username: 'janedoe',
        role: 'basic',
      },
    ]
    userService.getAll.mockResolvedValueOnce(mockUsers)

    render(
      <Router>
        <Users showNotification={vi.fn()} />
      </Router>
    )

    await waitFor(() => screen.getByText(/John Doe/))

    // Click "peruskäyttäjä" radio button
    const basicRadio = screen.getByLabelText(/peruskäyttäjä/i)
    fireEvent.click(basicRadio)

    expect(screen.queryByText(/John Doe/)).not.toBeInTheDocument()
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
  })

  test('clears filters and role selection when "Tyhjennä valinnat" button is clicked', async () => {
    const mockUsers = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        role: 'admin',
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        username: 'janedoe',
        role: 'basic',
      },
    ]
    userService.getAll.mockResolvedValueOnce(mockUsers)

    render(
      <Router>
        <Users showNotification={vi.fn()} />
      </Router>
    )

    await waitFor(() => screen.getByText(/John Doe/))

    // Apply a role filter
    const adminRadio = screen.getByLabelText(/pääkäyttäjä/i)
    fireEvent.click(adminRadio)

    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.queryByText(/Jane Doe/)).not.toBeInTheDocument()

    // Clear selections
    fireEvent.click(screen.getByText(/Tyhjennä valinnat/i))

    // Both users should reappear
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
  })
})
