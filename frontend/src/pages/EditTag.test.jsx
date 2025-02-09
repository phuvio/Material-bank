import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import EditTag from './EditTag'
import tagService from '../services/tags'
import validateTag from '../utils/tagValidations'

// Mock tagService
vi.mock('../services/tags')

// Mock validateTag
vi.mock('../utils/tagValidations', () => ({
  default: vi.fn(),
}))

const showNotificationMock = vi.fn()

describe('EditTag Component', () => {
  const mockTag = { id: '1', name: 'Test Tag', color: '#ff0000' }

  beforeEach(() => {
    tagService.getSingle.mockResolvedValue(mockTag)
    validateTag.mockResolvedValue({})
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <EditTag showNotification={showNotificationMock} />
      </BrowserRouter>
    )

  it('renders the component with initial data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByLabelText(/Nimi/i)).toHaveValue('Test Tag')
    })

    expect(screen.getByText(/Tallenna/i)).toBeInTheDocument()
    expect(screen.getByText(/Poista tagi/i)).toBeInTheDocument()
  })

  it('handles name input changes', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByLabelText(/Nimi/i)).toHaveValue('Test Tag')
    })

    const nameInput = screen.getByLabelText(/Nimi/i)
    fireEvent.change(nameInput, { target: { value: 'Updated Tag' } })

    expect(nameInput).toHaveValue('Updated Tag')
  })

  it('validates inputs and shows errors', async () => {
    validateTag.mockResolvedValue({ name: 'Nimi on pakollinen' })

    renderComponent()

    const saveButton = screen.getByText(/Tallenna/i)
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Nimi on pakollinen/i)).toBeInTheDocument()
    })
  })

  it('submits the form and updates the tag', async () => {
    tagService.update.mockResolvedValue()

    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <Routes>
          <Route
            path="/edit/:id"
            element={<EditTag showNotification={showNotificationMock} />}
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/Nimi/i)).toHaveValue('Test Tag')
    })

    const saveButton = screen.getByText(/Tallenna/i)
    fireEvent.click(saveButton)

    await waitFor(() => {
      // Ensure that '1' is passed as the first argument (id) along with the tag object
      expect(tagService.update).toHaveBeenCalledWith('1', {
        id: '1',
        name: 'Test Tag',
        color: '#ff0000',
      })
    })
  })

  it('does not submit if validation fails', async () => {
    validateTag.mockResolvedValue({ name: 'Nimi on pakollinen' })
    tagService.update.mockResolvedValue()

    renderComponent()

    const saveButton = screen.getByText(/Tallenna/i)
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(tagService.update).not.toHaveBeenCalled()
    })
    expect(screen.getByText(/Nimi on pakollinen/i)).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    tagService.getSingle.mockRejectedValue(new Error('API Error'))
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByLabelText(/Nimi/i)).toBeNull() // ensure it doesn't render the input field on error
    })
  })
})
