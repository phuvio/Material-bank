import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import EditTag from './EditTag'
import tagService from '../services/tags'
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from 'react-router-dom'

vi.mock('../services/tags', () => ({
  default: {
    getSingle: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

// Mocking react-router-dom's useNavigate and useParams
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}))

describe('EditTag Component', () => {
  const mockNavigate = vi.fn()
  const mockUseParams = { id: '1' }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mocking react-router-dom's useParams and useNavigate
    vi.mocked(useParams).mockReturnValue(mockUseParams)
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('should render EditTag form and handle loading state', async () => {
    tagService.getSingle.mockResolvedValueOnce({
      id: 1,
      name: 'Tag1',
      color: '#ff0000',
    })

    render(
      <Router>
        <EditTag />
      </Router>
    )

    // Check that the form is rendered
    expect(screen.getByText('Muokkaa tagia')).toBeInTheDocument()
    expect(screen.getByLabelText('Nimi')).toBeInTheDocument()

    // Check the loading state is not shown
    expect(screen.queryByText('Ladataan...')).not.toBeInTheDocument()

    // Wait for the mock data to load and check the input field
    await waitFor(() => {
      expect(screen.getByDisplayValue('Tag1')).toBeInTheDocument()
    })
  })

  it('should update tag and show success notification', async () => {
    tagService.getSingle.mockResolvedValueOnce({
      id: 1,
      name: 'Tag1',
      color: '#ff0000',
    })
    tagService.update.mockResolvedValueOnce({
      id: 1,
      name: 'UpdatedTag',
      color: '#0000ff',
    })

    render(
      <Router>
        <EditTag />
      </Router>
    )

    // Fill in the form with new tag values
    fireEvent.change(screen.getByLabelText('Nimi'), {
      target: { value: 'UpdatedTag' },
    })

    // Mock color change (assuming ColorPicker is a component that receives color as prop)
    const colorButtons = screen.getAllByRole('button')
    expect(colorButtons).toHaveLength(34) // Adjust depending on the actual number of color buttons

    // Interact with the buttons and submit the form
    fireEvent.click(colorButtons[0])

    // Submit the form
    fireEvent.click(screen.getByText('Tallenna tagi'))

    // Wait for the notification to appear
    await waitFor(() => {
      expect(
        screen.getByText('Tagi päivitetty onnistuneesti')
      ).toBeInTheDocument()
    })

    // Check if navigate was called
    expect(mockNavigate).toHaveBeenCalledWith('/tagadmin')
  })

  it('should show validation error if tag name is invalid', async () => {
    tagService.getSingle.mockResolvedValueOnce({
      id: 1,
      name: 'Tag1',
      color: '#ff0000',
    })

    render(
      <Router>
        <EditTag />
      </Router>
    )

    // Invalid name (contains special characters)
    fireEvent.change(screen.getByLabelText('Nimi'), {
      target: { value: 'Tag#1' },
    })

    // Submit the form
    fireEvent.click(screen.getByText('Tallenna tagi'))

    // Check for validation error message
    await waitFor(() => {
      expect(
        screen.getByText(
          'Nimessä voi olla vain kirjaimia, numeroita ja välilyöntejä'
        )
      ).toBeInTheDocument()
    })
  })

  it('should delete a tag and show success notification', async () => {
    tagService.getSingle.mockResolvedValueOnce({
      id: 1,
      name: 'Tag1',
      color: '#ff0000',
    })
    tagService.remove.mockResolvedValueOnce({})

    render(
      <Router>
        <EditTag />
      </Router>
    )

    // Confirm deletion
    window.confirm = vi.fn().mockReturnValue(true)

    // Click the delete button
    fireEvent.click(screen.getByText('Poista tagi'))

    // Wait for the success notification
    await waitFor(() => {
      expect(
        screen.getByText('Tagi poistettu onnistuneesti')
      ).toBeInTheDocument()
    })

    // Check if navigate was called
    expect(mockNavigate).toHaveBeenCalledWith('/tagadmin')
  })

  it('should handle delete tag failure and show error notification', async () => {
    tagService.getSingle.mockResolvedValueOnce({
      id: 1,
      name: 'Tag1',
      color: '#ff0000',
    })
    tagService.remove.mockRejectedValueOnce(new Error('Delete failed'))

    render(
      <Router>
        <EditTag />
      </Router>
    )

    // Confirm deletion
    window.confirm = vi.fn().mockReturnValue(true)

    // Click the delete button
    fireEvent.click(screen.getByText('Poista tagi'))

    // Wait for the error notification
    await waitFor(() => {
      expect(screen.getByText('Tagin poisto epäonnistui')).toBeInTheDocument()
    })
  })
})
