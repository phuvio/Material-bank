import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi, describe, beforeEach, it, expect, afterEach } from 'vitest'
import EditMaterial from './EditMaterial'
import materialService from '../services/materials'
import { validateMaterialUpdate } from '../utils/materialValidations'

// Mock services
vi.mock('../services/materials', () => ({
  default: {
    getSingle: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('../utils/materialValidations', () => ({
  validateMaterialUpdate: vi.fn(),
}))

// Mock for notification
const mockShowNotification = vi.fn()

describe('EditMaterial Component', () => {
  const mockMaterial = {
    id: '1',
    name: 'Test Material',
    description: 'This is a test material.',
    Tags: [{ id: '1', name: 'Tag1', color: 'red' }],
  }

  const mockOnMaterialAdded = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    materialService.getSingle.mockResolvedValue(mockMaterial)
    materialService.update.mockResolvedValue({})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with initial material data', async () => {
    render(
      <MemoryRouter initialEntries={['/editmaterial/1']}>
        <Routes>
          <Route
            path="/editmaterial/:id"
            element={
              <EditMaterial
                onMaterialAdded={mockOnMaterialAdded}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Ensure the form inputs are populated with the initial material data
    await waitFor(() =>
      expect(screen.getByDisplayValue('Test Material')).toBeInTheDocument()
    )
    expect(
      screen.getByDisplayValue('This is a test material.')
    ).toBeInTheDocument()
  })

  it('handles form input changes', async () => {
    render(
      <MemoryRouter initialEntries={['/editmaterial/1']}>
        <Routes>
          <Route
            path="/editmaterial/:id"
            element={
              <EditMaterial
                onMaterialAdded={mockOnMaterialAdded}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Change the name and description
    fireEvent.change(screen.getByLabelText('Materiaalin nimi:'), {
      target: { value: 'Updated Material' },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: 'Updated description' },
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Updated Material')).toBeInTheDocument()
      expect(
        screen.getByDisplayValue('Updated description')
      ).toBeInTheDocument()
    })
  })

  it('shows validation errors when the form is invalid', async () => {
    // Simulate validation error by returning non-empty errors
    const validationErrors = {
      name: 'Name is required',
      description: 'Description is required',
    }
    validateMaterialUpdate.mockResolvedValue(validationErrors)

    render(
      <MemoryRouter initialEntries={['/editmaterial/1']}>
        <Routes>
          <Route
            path="/editmaterial/:id"
            element={
              <EditMaterial
                onMaterialAdded={mockOnMaterialAdded}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Trigger form submission with invalid data
    fireEvent.submit(screen.getByText(/Tallenna/))

    // Wait for validation errors to appear
    await waitFor(() =>
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    )
    expect(screen.getByText('Description is required')).toBeInTheDocument()

    // Ensure notification is triggered for failure
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Materiaalin päivitys epäonnistui',
      'error',
      3000
    )
  })

  it('submits the form successfully and navigates', async () => {
    validateMaterialUpdate.mockResolvedValue({})
    render(
      <MemoryRouter initialEntries={['/editmaterial/1']}>
        <Routes>
          <Route
            path="/editmaterial/:id"
            element={
              <EditMaterial
                onMaterialAdded={mockOnMaterialAdded}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Change form data
    fireEvent.change(screen.getByLabelText('Materiaalin nimi:'), {
      target: { value: 'Updated Material' },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: 'Updated description' },
    })

    // Trigger form submission
    fireEvent.submit(screen.getByText(/Tallenna/))

    // Wait for the success notification and redirection
    await waitFor(() =>
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Materiaali päivitetty onnistuneesti',
        'message',
        2000
      )
    )
    expect(mockOnMaterialAdded).toHaveBeenCalled()
    expect(materialService.update).toHaveBeenCalledWith(
      '1',
      expect.any(FormData)
    )
  })
})
