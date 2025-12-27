import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, it, expect, beforeEach, describe } from 'vitest'
import PackageDetails from '../pages/PackageDetails'
import packageService from '../services/packages'
import decodeToken from '../utils/decode'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock services and hooks
vi.mock('../services/packages', () => ({
  default: {
    getSingle: vi.fn(),
    remove: vi.fn(),
  },
}))
vi.mock('../utils/decode', () => ({
  default: vi.fn(),
}))

const navigate = vi.fn()
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useNavigate: () => navigate,
    useParams: () => ({ id: '123' }),
  }
})

const mockShowNotification = vi.fn()

// Helper for rendering component with router
const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={['/paketit/123']}>
      <Routes>
        <Route
          path="/paketit/:id"
          element={<PackageDetails showNotification={mockShowNotification} />}
        />
      </Routes>
    </MemoryRouter>
  )

describe('PackageDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders package details after fetching', async () => {
    decodeToken.mockResolvedValue({ user_id: 1, role: 'user' })
    packageService.getSingle.mockResolvedValue({
      id: '123',
      name: 'Test Package',
      description: '<p>Some <strong>description</strong></p>',
      Materials: [],
    })

    renderComponent()

    expect(await screen.findByText('Test Package')).toBeInTheDocument()
    // Verify sanitized HTML content
    expect(screen.getByText('Some', { exact: false })).toBeInTheDocument()
    expect(
      screen.getByText('description', { exact: false })
    ).toBeInTheDocument()
  })

  it('renders materials when they exist', async () => {
    decodeToken.mockResolvedValue({ user_id: 1, role: 'user' })
    packageService.getSingle.mockResolvedValue({
      id: '123',
      name: 'Package with materials',
      description: 'desc',
      Materials: [
        { id: 1, name: 'Material 1', is_url: true, url: 'http://test.com' },
        { id: 2, name: 'Material 2', is_url: false },
      ],
    })

    renderComponent()

    expect(
      await screen.findByText('Package with materials')
    ).toBeInTheDocument()
    expect(screen.getByText('Material 1')).toBeInTheDocument()
    expect(screen.getByText('Material 2')).toBeInTheDocument()
  })

  it('renders message when no materials', async () => {
    decodeToken.mockResolvedValue({ user_id: 1, role: 'user' })
    packageService.getSingle.mockResolvedValue({
      id: '123',
      name: 'Empty Package',
      description: 'no mats',
      Materials: [],
    })

    renderComponent()

    expect(await screen.findByText('Empty Package')).toBeInTheDocument()
    expect(
      screen.getByText('Paketissa ei ole materiaaleja.')
    ).toBeInTheDocument()
  })

  it('shows error notification if fetching fails', async () => {
    decodeToken.mockResolvedValue({ user_id: 1, role: 'user' })
    packageService.getSingle.mockRejectedValue(new Error('fetch failed'))

    renderComponent()

    await waitFor(() =>
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Virhe haettaessa pakettia.',
        'error',
        3000
      )
    )
  })

  it('renders edit and delete buttons for admin', async () => {
    decodeToken.mockResolvedValue({ user_id: 1, role: 'admin' })
    packageService.getSingle.mockResolvedValue({
      id: '123',
      name: 'Admin Package',
      description: 'desc',
      Materials: [],
    })

    renderComponent()

    expect(await screen.findByText('Admin Package')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Muokkaa pakettia/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Poista paketti/i })
    ).toBeInTheDocument()
  })

  it('deletes package when confirmed', async () => {
    decodeToken.mockResolvedValue({ user_id: 1, role: 'admin' })
    packageService.getSingle.mockResolvedValue({
      id: '123',
      name: 'Delete Package',
      description: 'desc',
      Materials: [],
    })
    packageService.remove.mockResolvedValue({})
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderComponent()

    const deleteButton = await screen.findByRole('button', {
      name: /Poista paketti/i,
    })
    fireEvent.click(deleteButton)

    await waitFor(() =>
      expect(packageService.remove).toHaveBeenCalledWith('123')
    )
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Paketti poistettu onnistuneesti',
      'message',
      2000
    )
    expect(navigate).toHaveBeenCalledWith('/paketit')
  })

  it('shows error when deleting fails', async () => {
    decodeToken.mockResolvedValue({ user_id: 1, role: 'admin' })
    packageService.getSingle.mockResolvedValue({
      id: '123',
      name: 'Fail Package',
      description: 'desc',
      Materials: [],
    })
    packageService.remove.mockRejectedValue(new Error('delete failed'))
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderComponent()

    const deleteButton = await screen.findByRole('button', {
      name: /Poista paketti/i,
    })
    fireEvent.click(deleteButton)

    await waitFor(() =>
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Paketin poisto epäonnistui',
        'error',
        3000
      )
    )
  })

  it('navigates to / when token is invalid', async () => {
    decodeToken.mockResolvedValue(null)
    packageService.getSingle.mockResolvedValue({
      id: '123',
      name: 'Redirect Package',
      description: 'desc',
      Materials: [],
    })

    renderComponent()

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/'))
  })
})
