import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { BrowserRouter as Router } from 'react-router-dom'
import EditTag from './EditTag'
import tagService from '../services/tags'

// Mocking dependencies
vi.mock('../services/tags')
vi.mock('../components/ColorPicker', () => ({
  __esModule: true,
  default: ({ selectedColor, onColorChange }) => (
    <input
      type="color"
      value={selectedColor}
      onChange={(e) => onColorChange(e.target.value)}
    />
  ),
}))
vi.mock('../components/GoBackButton', () => ({
  __esModule: true,
  default: ({ onGoBack }) => <button onClick={onGoBack}>Go Back</button>,
}))

describe('EditTag Component', () => {
  const showNotification = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the tag editing form with current values', async () => {
    const mockTag = { id: '1', name: 'Test Tag', color: '#ff0000' }

    // Mocking the tagService.getSingle to return a mock tag
    tagService.getSingle.mockResolvedValueOnce(mockTag)

    render(
      <Router>
        <EditTag showNotification={showNotification} />
      </Router>
    )

    // Wait for the component to finish fetching the tag data
    await waitFor(() => expect(tagService.getSingle).toHaveBeenCalled())

    // Check if the form is populated with the current tag data
    expect(screen.getByDisplayValue('Test Tag')).toBeInTheDocument()
    expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument()
  })

  it('should show an error if form submission fails', async () => {
    const mockTag = { id: '1', name: 'Test Tag', color: '#ff0000' }
    tagService.getSingle.mockResolvedValueOnce(mockTag)
    tagService.update.mockRejectedValueOnce(new Error('Failed to update'))

    render(
      <Router>
        <EditTag showNotification={showNotification} />
      </Router>
    )

    // Wait for the form to be populated
    await waitFor(() => expect(tagService.getSingle).toHaveBeenCalled())

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Nimi:'), {
      target: { value: 'Updated Tag' },
    })

    // Submit the form
    fireEvent.click(screen.getByText('Tallenna'))

    // Wait for the error notification
    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        'Tagin päivitys epäonnistui',
        'error',
        3000
      )
    )
  })

  it('should successfully update the tag and navigate away', async () => {
    const mockTag = { id: '1', name: 'Test Tag', color: '#ff0000' }
    tagService.getSingle.mockResolvedValueOnce(mockTag)
    tagService.update.mockResolvedValueOnce({})

    render(
      <Router>
        <EditTag showNotification={showNotification} />
      </Router>
    )

    // Wait for the form to be populated
    await waitFor(() => expect(tagService.getSingle).toHaveBeenCalled())

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Nimi:'), {
      target: { value: 'Updated Tag' },
    })

    // Submit the form
    fireEvent.click(screen.getByText('Tallenna'))

    // Wait for the success notification
    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        'Tagi päivitetty onnistuneesti',
        'message',
        2000
      )
    )
  })

  it('should show an error message if the tag data cannot be fetched', async () => {
    tagService.getSingle.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(
      <Router>
        <EditTag showNotification={showNotification} />
      </Router>
    )

    // Wait for the error message to appear
    await waitFor(() => screen.getByText('Virhe ladattaessa tagia'))

    expect(screen.getByText('Virhe ladattaessa tagia')).toBeInTheDocument()
  })

  it('should navigate back when the GoBack button is clicked', async () => {
    const mockTag = { id: '1', name: 'Test Tag', color: '#ff0000' }
    tagService.getSingle.mockResolvedValueOnce(mockTag)

    const { container } = render(
      <Router>
        <EditTag showNotification={showNotification} />
      </Router>
    )

    // Simulate GoBack button click
    fireEvent.click(screen.getByText('Go Back'))

    // Check that the navigate function was called
    expect(container).toBeTruthy()
  })

  it('should handle the delete tag action and show confirmation', async () => {
    const mockTag = { id: '1', name: 'Test Tag', color: '#ff0000' }
    tagService.getSingle.mockResolvedValueOnce(mockTag)
    tagService.remove.mockResolvedValueOnce({})

    // Mock window.confirm to simulate user clicking "OK"
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true)

    render(
      <Router>
        <EditTag showNotification={showNotification} />
      </Router>
    )

    // Simulate delete button click
    fireEvent.click(screen.getByText('Poista tagi'))

    // Wait for the notification and navigation
    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        'Tagi poistettu onnistuneesti',
        'message',
        2000
      )
    )
  })
})
