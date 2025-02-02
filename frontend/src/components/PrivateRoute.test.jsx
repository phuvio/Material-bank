import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import decodeToken from '../utils/decode'
import { vi, describe, afterEach, test, expect } from 'vitest'

// Mock decodeToken utility
vi.mock('../utils/decode')

// Mock components for rendering
const MockComponent = () => <div>Private Content</div>

describe('PrivateRoute', () => {
  afterEach(() => {
    vi.restoreAllMocks() // Reset mocks after each test
  })

  test('renders the element when token is valid and role matches', () => {
    // Mock decodeToken to return a valid token with the correct role
    decodeToken.mockReturnValue({ role: 'admin' })

    render(
      <MemoryRouter>
        <PrivateRoute element={<MockComponent />} requiredRoles={['admin']} />
      </MemoryRouter>
    )

    // Ensure the Private Content is rendered
    expect(screen.getByText('Private Content')).toBeInTheDocument()
  })

  test('navigates to home when there is no token', () => {
    // Mock decodeToken to return null (no token)
    decodeToken.mockReturnValue(null)

    render(
      <MemoryRouter initialEntries={['/private']}>
        <PrivateRoute element={<MockComponent />} requiredRoles={['admin']} />
      </MemoryRouter>
    )

    // Ensure that it navigates to the home page (this may vary depending on your router setup)
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument()
  })

  test('navigates to home when token role does not match required roles', () => {
    // Mock decodeToken to return a token with a different role
    decodeToken.mockReturnValue({ role: 'user' })

    render(
      <MemoryRouter initialEntries={['/private']}>
        <PrivateRoute element={<MockComponent />} requiredRoles={['admin']} />
      </MemoryRouter>
    )

    // Ensure that it navigates to the home page (this may vary depending on your router setup)
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument()
  })

  test('renders the element when token role matches required roles (multiple roles)', () => {
    // Mock decodeToken to return a token with a valid role
    decodeToken.mockReturnValue({ role: 'admin' })

    render(
      <MemoryRouter>
        <PrivateRoute
          element={<MockComponent />}
          requiredRoles={['admin', 'manager']}
        />
      </MemoryRouter>
    )

    // Ensure the Private Content is rendered
    expect(screen.getByText('Private Content')).toBeInTheDocument()
  })
})
