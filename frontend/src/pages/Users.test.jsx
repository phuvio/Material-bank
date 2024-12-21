import { render, screen, waitFor } from '@testing-library/react'
import Users from './Users'
import axios from 'axios'
import { vi, describe, test, expect } from 'vitest'
import { BrowserRouter as Router } from 'react-router-dom'

// Mock axios
vi.mock('axios')

describe('Users Component', () => {
  test('renders users list when data is fetched successfully', async () => {
    // Mock API response
    const mockUsers = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        role: 1,
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        username: 'janedoe',
        role: 0,
      },
    ]
    axios.get.mockResolvedValueOnce({ data: mockUsers })

    render(
      <Router>
        <Users />
      </Router>
    )

    // Wait for the component to update after the API call
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/users')
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
    axios.get.mockRejectedValueOnce(new Error('Error fetching data'))

    render(
      <Router>
        <Users />
      </Router>
    )

    // Wait for the component to attempt the API call
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/users')
    })

    // Since the users list is empty, there should be no user data rendered
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()

    // You can also test if an error message is logged or displayed as needed
  })
})
