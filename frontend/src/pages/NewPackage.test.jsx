import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import NewPackage from './NewPackage'
import packageService from '../services/packages'
import materialService from '../services/materials'
import { validatePackage } from '../utils/packageValidations'

// Mocks
vi.mock('../services/packages', () => ({
  default: { create: vi.fn().mockResolvedValue({ id: 1 }) },
}))
vi.mock('../services/materials', () => ({
  default: { getAll: vi.fn() },
}))
vi.mock('../utils/packageValidations', () => ({ validatePackage: vi.fn() }))
vi.mock('../components/SelectMaterialsList', () => ({
  default: ({ selectedMaterials, setSelectedMaterials }) => (
    <div data-testid="selected-materials">
      {selectedMaterials.map((m) => (
        <div key={m.id} data-testid={`material-${m.id}`}>
          {m.name}
          <button
            data-testid={`reorder-${m.id}`}
            onClick={() =>
              setSelectedMaterials(
                selectedMaterials.slice().reverse() // mock reorder
              )
            }
          >
            Reorder
          </button>
        </div>
      ))}
    </div>
  ),
}))

describe('NewPackage Component', () => {
  const showNotification = vi.fn()
  const mockMaterials = [
    { id: 1, name: 'Material A' },
    { id: 2, name: 'Material B' },
    { id: 3, name: 'Material C' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    materialService.getAll.mockResolvedValue(mockMaterials)
    validatePackage.mockResolvedValue({})
  })

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <NewPackage showNotification={showNotification} />
      </BrowserRouter>
    )

  it('renders form inputs and materials list', async () => {
    renderComponent()

    expect(screen.getByLabelText('Nimi:')).toBeInTheDocument()
    expect(screen.getByLabelText('Kuvaus:')).toBeInTheDocument()
    await waitFor(() => {
      mockMaterials.forEach((m) =>
        expect(screen.getByText(m.name)).toBeInTheDocument()
      )
    })
  })

  it('selects and deselects materials', async () => {
    renderComponent()
    await waitFor(() => screen.getByText('Material A'))

    fireEvent.click(screen.getByLabelText('Select Material A')) // select
    fireEvent.click(screen.getByLabelText('Select Material A')) // deselect
  })

  it('updates material order via SelectedMaterialsList', async () => {
    renderComponent()
    await waitFor(() => screen.getByText('Material A'))
    fireEvent.click(screen.getByLabelText('Select Material A'))
    fireEvent.click(screen.getByLabelText('Select Material B'))

    const reorderButton = screen.getByTestId('reorder-1')
    fireEvent.click(reorderButton)

    expect(
      screen.getByTestId('selected-materials').children[0].textContent
    ).toContain('Material B')
  })

  it('shows validation error and does not submit', async () => {
    validatePackage.mockResolvedValue({ name: 'Required' })
    renderComponent()
    fireEvent.click(screen.getByText('Tallenna'))

    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        'Paketin luonti epäonnistui.',
        'error',
        3000
      )
    )
    expect(packageService.create).not.toHaveBeenCalled()
  })

  it('submits correct payload', async () => {
    renderComponent()
    await waitFor(() => screen.getByText('Material A'))

    // Select two materials
    fireEvent.click(screen.getByLabelText('Select Material A'))
    fireEvent.click(screen.getByLabelText('Select Material B'))

    fireEvent.change(screen.getByLabelText('Nimi:'), {
      target: { value: 'New Package' },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: 'Some description' },
    })

    fireEvent.click(screen.getByText('Tallenna'))

    await waitFor(() =>
      expect(packageService.create).toHaveBeenCalledWith({
        name: 'New Package',
        description: 'Some description',
        materialIds: [
          { id: 1, position: 0 },
          { id: 2, position: 1 },
        ],
      })
    )
  })

  it('handles submission error', async () => {
    packageService.create.mockRejectedValue(new Error('Fail'))
    renderComponent()
    fireEvent.change(screen.getByLabelText('Nimi:'), {
      target: { value: 'New Package' },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: 'Some description' },
    })

    fireEvent.click(screen.getByText('Tallenna'))

    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        'Virhe paketin luomisessa.',
        'error',
        3000
      )
    )
  })
})
