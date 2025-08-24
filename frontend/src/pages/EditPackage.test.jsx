import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi, it, expect, beforeEach, describe } from 'vitest'
import EditPackage from './EditPackage'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('../services/packages', () => ({
  default: {
    getSingle: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('../services/materials', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

vi.mock('../utils/packageValidations', () => ({
  validatePackageUpdate: vi.fn(),
}))

import packageService from '../services/packages'
import materialService from '../services/materials'
import { validatePackageUpdate } from '../utils/packageValidations'

describe('EditPackage', () => {
  const showNotification = vi.fn()

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route
            path="/edit/:id"
            element={<EditPackage showNotification={showNotification} />}
          />
        </Routes>
      </MemoryRouter>
    )

  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
  })

  it('renders form with fetched package data', async () => {
    packageService.getSingle.mockResolvedValueOnce({
      id: 123,
      name: 'Test Package',
      description: 'Test Description',
      Materials: [{ id: 1, name: 'Material A' }],
    })
    materialService.getAll.mockResolvedValueOnce([
      { id: 1, name: 'Material A' },
      { id: 2, name: 'Material B' },
    ])

    renderComponent()

    expect(await screen.findByDisplayValue('Test Package')).toBeInTheDocument()
    expect(
      await screen.findByDisplayValue('Test Description')
    ).toBeInTheDocument()
  })

  it('submits the correct payload', async () => {
    packageService.getSingle.mockResolvedValueOnce({
      id: 123,
      name: 'Old Name',
      description: 'Old Desc',
      Materials: [],
    })
    materialService.getAll.mockResolvedValueOnce([
      { id: 1, name: 'Material A' },
    ])
    validatePackageUpdate.mockResolvedValueOnce({})

    renderComponent()

    const descriptionInput = await screen.findByDisplayValue('Old Desc')

    // Change name
    fireEvent.change(screen.getByLabelText(/Nimi/i), {
      target: { value: 'New Name' },
    })

    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: /Tallenna/i }))

    await waitFor(() => {
      expect(packageService.update).toHaveBeenCalledWith('123', {
        name: 'New Name',
        description: 'Old Desc',
        materialIds: [],
      })
    })
  })

  it('shows validation errors', async () => {
    packageService.getSingle.mockResolvedValueOnce({
      id: 123,
      name: '',
      description: '',
      Materials: [],
    })
    materialService.getAll.mockResolvedValueOnce([])
    validatePackageUpdate.mockResolvedValueOnce({
      name: 'Name is required',
    })

    renderComponent()

    fireEvent.submit(screen.getByRole('button', { name: /Tallenna/i }))

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(packageService.update).not.toHaveBeenCalled()
  })

  it('handles API update error', async () => {
    packageService.getSingle.mockResolvedValueOnce({
      id: 123,
      name: 'Test',
      description: 'Desc',
      Materials: [],
    })
    materialService.getAll.mockResolvedValueOnce([])
    validatePackageUpdate.mockResolvedValueOnce({})
    packageService.update.mockRejectedValueOnce(new Error('Update failed'))

    renderComponent()

    fireEvent.submit(screen.getByRole('button', { name: /Tallenna/i }))

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        'Paketin päivitys epäonnistui',
        'error',
        3000
      )
    })
  })
})
