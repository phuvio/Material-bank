import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import NewPackage from '../pages/NewPackage'
import packageService from '../services/packages'
import materialService from '../services/materials'
import { validatePackage } from '../utils/packageValidations'

// Mock services
vi.mock('../services/packages', () => ({
  default: { create: vi.fn().mockResolvedValue({ id: 1 }) },
}))

vi.mock('../services/materials', () => ({
  default: { getAll: vi.fn() },
}))

// Mock TextEditor as Quill
vi.mock('../components/TextEditor', () => {
  return {
    __esModule: true,
    default: ({ value, onTextChange }) => (
      <div>
        <textarea
          data-testid="text-editor"
          value={value}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </div>
    ),
  }
})

// Mock SelectMaterialsList
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

// Mock selectTags hook
vi.mock('../utils/selectTags', () => ({
  selectTags: () => ({
    tags: [],
    selectedTags: [],
    toggleTags: vi.fn(),
  }),
}))

// Mock validation
vi.mock('../utils/packageValidations', () => ({ validatePackage: vi.fn() }))

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

  it('selects and deselects materials', async () => {
    renderComponent()
    await waitFor(() => screen.getByText('Material A'))

    const selectButton = screen.getByLabelText('Select Material A')
    fireEvent.click(selectButton) // select
    expect(screen.getByTestId('selected-materials')).toHaveTextContent(
      'Material A'
    )

    fireEvent.click(selectButton) // deselect
    expect(screen.getByTestId('selected-materials')).not.toHaveTextContent(
      'Material A'
    )
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

  it('shows validation error and prevents submission', async () => {
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

  it('submits correct payload with sanitized HTML', async () => {
    renderComponent()
    await waitFor(() => screen.getByText('Material A'))

    fireEvent.click(screen.getByLabelText('Select Material A'))
    fireEvent.click(screen.getByLabelText('Select Material B'))

    fireEvent.change(screen.getByLabelText('Nimi:'), {
      target: { value: 'New Package' },
    })

    // Set description with some HTML
    fireEvent.change(screen.getByTestId('text-editor'), {
      target: { value: '<p>Safe <strong>text</strong></p>' },
    })

    fireEvent.click(screen.getByText('Tallenna'))

    await waitFor(() =>
      expect(packageService.create).toHaveBeenCalledWith({
        name: 'New Package',
        description: '<p>Safe <strong>text</strong></p>',
        materialIds: [
          { id: 1, position: 0 },
          { id: 2, position: 1 },
        ],
      })
    )
  })

  it('sanitizes dangerous HTML before submit', async () => {
    renderComponent()
    await waitFor(() => screen.getByText('Material A'))

    fireEvent.change(screen.getByLabelText('Nimi:'), {
      target: { value: 'Malicious Package' },
    })

    // Set malicious HTML
    fireEvent.change(screen.getByTestId('text-editor'), {
      target: { value: '<img src=x onerror=alert(1)><p>Hello</p>' },
    })

    fireEvent.click(screen.getByText('Tallenna'))

    await waitFor(() => {
      const call = packageService.create.mock.calls[0][0]
      expect(call.description).toBe('<p>Hello</p>') // XSS stripped
    })
  })

  it('handles submission error', async () => {
    packageService.create.mockRejectedValue(new Error('Fail'))
    renderComponent()

    fireEvent.change(screen.getByLabelText('Nimi:'), {
      target: { value: 'New Package' },
    })
    fireEvent.change(screen.getByTestId('text-editor'), {
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
