import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
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

vi.mock('../services/tags', () => ({
  default: {
    getAll: vi.fn(() => Promise.resolve([])),
  },
}))

vi.mock('../utils/packageValidations', () => ({
  validatePackageUpdate: vi.fn(),
}))

vi.mock('../components/TextEditor', () => ({
  __esModule: true,
  default: vi
    .fn()
    .mockImplementation(({ value, onTextChange }) => (
      <textarea
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        data-testid="text-editor"
      />
    )),
}))

vi.mock('../components/SelectMaterialsList', () => ({
  default: ({ selectedMaterials, setSelectedMaterials }) => (
    <div data-testid="selected-materials">
      {selectedMaterials.map((m) => (
        <div key={m.id} data-testid={`material-${m.id}`}>
          {m.name}
          <button
            data-testid={`reorder-${m.id}`}
            onClick={() =>
              setSelectedMaterials(selectedMaterials.slice().reverse())
            }
          >
            Reorder
          </button>
        </div>
      ))}
    </div>
  ),
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
