import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewTag from './NewTag'
import tagService from '../services/tags'
import { vi, describe, beforeEach, it, expect } from 'vitest'

// Mock the tagService to simulate the create function
vi.mock('../services/tags')

describe('NewTag Component', () => {
  beforeEach(() => {
    tagService.create.mockResolvedValue()
  })

  it('renders the form correctly', () => {
    render(<NewTag />)

    // Check if the form elements are rendered
    expect(screen.getByLabelText('Nimi')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /nimi/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /luo tagi/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Luo uusi tagi')).toBeInTheDocument()
  })

  it('displays an error message when the name is invalid', async () => {
    render(<NewTag />)

    const inputName = screen.getByRole('textbox', { name: /nimi/i })
    fireEvent.change(inputName, { target: { value: '' } })

    const button = screen.getByRole('button', { name: /luo tagi/i })
    fireEvent.click(button)

    // Wait for validation errors
    await waitFor(() =>
      expect(screen.getByText('Anna tagille nimi')).toBeInTheDocument()
    )
  })

  it('displays an error message when no color is selected', async () => {
    render(<NewTag />)

    const inputName = screen.getByRole('textbox', { name: /nimi/i })
    fireEvent.change(inputName, { target: { value: 'Valid Name' } })

    const button = screen.getByRole('button', { name: /luo tagi/i })
    fireEvent.click(button)

    // Wait for color validation
    await waitFor(() =>
      expect(screen.getByText('Valitse väri')).toBeInTheDocument()
    )
  })

  it('calls tagService.create when the form is valid', async () => {
    render(<NewTag />)

    const inputName = screen.getByRole('textbox', { name: /nimi/i })
    fireEvent.change(inputName, { target: { value: 'Valid Name' } })

    // Select a color by clicking the color square
    const colorSquare = screen.getAllByRole('button')[0]
    fireEvent.click(colorSquare)

    const button = screen.getByRole('button', { name: /luo tagi/i })
    fireEvent.click(button)

    // Wait for the mock function to be called
    await waitFor(() =>
      expect(tagService.create).toHaveBeenCalledWith({
        name: 'Valid Name',
        color: '#FF5C5C', // Assuming color selected is the first square
      })
    )
  })

  it('displays a success notification when tag is created successfully', async () => {
    render(<NewTag />)

    const inputName = screen.getByRole('textbox', { name: /nimi/i })
    fireEvent.change(inputName, { target: { value: 'Valid Name' } })

    // Select a color by clicking the color square
    const colorSquare = screen.getAllByRole('button')[0]
    fireEvent.click(colorSquare)

    const button = screen.getByRole('button', { name: /luo tagi/i })
    fireEvent.click(button)

    // Wait for success notification
    await waitFor(() =>
      expect(screen.getByText('Tagi luotu onnistuneesti')).toBeInTheDocument()
    )
  })

  it('displays an error notification when tag creation fails', async () => {
    // Simulate a failed tag creation
    tagService.create.mockRejectedValueOnce(new Error('Error creating tag'))

    render(<NewTag />)

    const inputName = screen.getByRole('textbox', { name: /nimi/i })
    fireEvent.change(inputName, { target: { value: 'Valid Name' } })

    // Select a color by clicking the color square
    const colorSquare = screen.getAllByRole('button')[0]
    fireEvent.click(colorSquare)

    const button = screen.getByRole('button', { name: /luo tagi/i })
    fireEvent.click(button)

    // Wait for error notification
    await waitFor(() =>
      expect(screen.getByText('Tagin luonti epäonnistui')).toBeInTheDocument()
    )
  })
})
