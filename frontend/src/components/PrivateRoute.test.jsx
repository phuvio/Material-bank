import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import PrivateRoute from '../components/PrivateRoute'
import decode from '../utils/decode'

vi.mock('../utils/decode')

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <PrivateRoute
          element={<div>Protected Content</div>}
          requiredRoles={['admin']}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the protected element if user has required role', async () => {
    decode.mockResolvedValue({ role: 'admin' })

    render(
      <MemoryRouter>
        <PrivateRoute
          element={<div>Protected Content</div>}
          requiredRoles={['admin']}
        />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('Protected Content'))
  })

  it('redirects to "/" if no token is present', async () => {
    decode.mockResolvedValue(null)

    render(
      <MemoryRouter>
        <PrivateRoute
          element={<div>Protected Content</div>}
          requiredRoles={['admin']}
        />
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    )
  })

  it('redirects to "/" if user does not have the required role', async () => {
    decode.mockResolvedValue({ role: 'user' })

    render(
      <MemoryRouter>
        <PrivateRoute
          element={<div>Protected Content</div>}
          requiredRoles={['admin']}
        />
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    )
  })
})
