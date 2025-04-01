import { render, screen, waitFor } from '@testing-library/react'
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
    // Mock API response
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

    // Wait for the component to update after the API call
    await waitFor(() => {
      expect(userService.getAll).toHaveBeenCalled()
    })

    // Check if the user data is rendered
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/johndoe/)).toBeInTheDocument()
    expect(screen.getByText(/pääkäyttäjä/)).toBeInTheDocument()

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/janedoe/)).toBeInTheDocument()
    expect(screen.getByText(/peruskäyttäjä/)).toBeInTheDocument()
  })

  test('displays error message when API request fails', async () => {
    // Mock API error
    userService.getAll.mockRejectedValueOnce(new Error('Error fetching data'))

    // Mock showNotification function
    const mockShowNotification = vi.fn()

    render(
      <Router>
        <Users showNotification={mockShowNotification} />
      </Router>
    )

    // Wait for the component to attempt the API call
    await waitFor(() => {
      expect(userService.getAll).toHaveBeenCalled()
    })

    // Assert that showNotification was called with the correct arguments
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Virhe haettaessa käyttäjiä.',
      'error',
      3000
    )

    // Since the users list is empty, there should be no user data rendered
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
  })
})
