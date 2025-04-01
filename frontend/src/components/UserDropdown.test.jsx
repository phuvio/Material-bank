import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import UserDropdown from '../components/UserDropdown'
import decodeToken from '../utils/decode'

vi.mock('../utils/decode')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('UserDropdown', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('renders the component with loading text initially', () => {
    render(
      <MemoryRouter>
        <UserDropdown setIsLoggedIn={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Ladataan.../)).toBeInTheDocument()
  })

  it('fetches and sets user data if token is valid', async () => {
    decodeToken.mockResolvedValue({
      user_id: 123,
      fullname: 'Test User',
    })

    render(
      <MemoryRouter>
        <UserDropdown setIsLoggedIn={vi.fn()} />
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.getByText('Test User')).toBeInTheDocument()
    )
    expect(localStorage.getItem('fullname')).toBe('Test User')
  })

  it('redirects to "/" if token is invalid', async () => {
    decodeToken.mockResolvedValue(null)

    render(
      <MemoryRouter>
        <UserDropdown setIsLoggedIn={vi.fn()} />
      </MemoryRouter>
    )

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  it('logs out correctly when "Kirjaudu ulos" is selected', async () => {
    decodeToken.mockResolvedValue({ user_id: 123, fullname: 'Test User' })
    const mockSetIsLoggedIn = vi.fn()

    render(
      <MemoryRouter>
        <UserDropdown setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('Test User'))

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'logout' },
    })

    expect(localStorage.getItem('fullname')).toBeNull()
    expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('navigates to password change page when "Vaihda salasana" is selected', async () => {
    decodeToken.mockResolvedValue({ user_id: 123, fullname: 'Test User' })

    render(
      <MemoryRouter>
        <UserDropdown setIsLoggedIn={vi.fn()} />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('Test User'))

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'changePassword' },
    })

    expect(mockNavigate).toHaveBeenCalledWith('/vaihdasalasana/123')
  })
})
