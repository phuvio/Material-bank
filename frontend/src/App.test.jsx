import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, test, expect } from 'vitest'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import axios from 'axios'

// Mock the necessary modules
vi.mock('axios')
vi.mock('./config/config', () => ({
  default: 'http://localhost:3001',
}))

describe('App Component', () => {
  const mockUser = {
    role: 1,
    name: 'Test User',
  }

  const mockMaterials = [
    { id: 1, name: 'Material 1' },
    { id: 2, name: 'Material 2' },
  ]

  test('renders LoginForm when the user is not logged in', () => {
    render(
      <Router>
        <App />
      </Router>
    )

    // Check if LoginForm is rendered
    expect(screen.getByText(/Sisäänkirjautuminen/i)).toBeInTheDocument()
  })

  test('renders the correct links based on user role', async () => {
    window.localStorage.setItem('loggedInUser', JSON.stringify(mockUser))
    axios.get.mockResolvedValueOnce({ data: mockMaterials })

    render(
      <Router>
        <App />
      </Router>
    )

    // Check if the "Käyttäjähallinta" link is visible for users with role 1
    expect(screen.getByText('Käyttäjähallinta')).toBeInTheDocument()
  })

  test('logs out the user and redirects to login page', () => {
    window.localStorage.setItem('loggedInUser', JSON.stringify(mockUser))
    axios.get.mockResolvedValueOnce({ data: mockMaterials })

    render(
      <Router>
        <App />
      </Router>
    )

    // Mock the Logout Button click event
    const logoutButton = screen.getByText('Kirjaudu ulos')
    fireEvent.click(logoutButton)

    // Check if the user is redirected to the login page
    expect(screen.getByText(/Sisäänkirjautuminen/i)).toBeInTheDocument()
  })
})
