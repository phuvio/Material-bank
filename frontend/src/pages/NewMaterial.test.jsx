import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, test, expect } from 'vitest'
import NewMaterial from './NewMaterial'
import materialService from '../services/materials'
import useNotification from '../utils/useNotification'
import { BrowserRouter as Router } from 'react-router-dom'

// Mock services and hooks
vi.mock('../services/materials')
vi.mock('../utils/useNotification')

describe('NewMaterial component', () => {
  let loggedInUser
  let onMaterialAddedMock
  let showNotificationMock

  beforeEach(() => {
    loggedInUser = { user_id: '123' }
    onMaterialAddedMock = vi.fn()
    showNotificationMock = vi.fn()

    useNotification.mockReturnValue({
      message: '',
      type: '',
      showNotification: showNotificationMock,
    })
  })

  test('renders form elements correctly', () => {
    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
        />
      </Router>
    )

    expect(screen.getByLabelText(/Materiaalin nimi:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kuvaus:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Onko materiaali linkki:/)).toBeInTheDocument()
    expect(screen.getByText(/Tallenna/)).toBeInTheDocument()
  })

  test('validates form data and shows error notification when validation fails', async () => {
    const validateMaterialMock = vi.fn().mockResolvedValue({
      name: 'Name is required',
      description: 'Description is required',
    })

    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
        />
      </Router>
    )

    fireEvent.change(screen.getByLabelText(/Materiaalin nimi:/), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByLabelText(/Kuvaus:/), {
      target: { value: '' },
    })

    // Try to submit the form with invalid data
    fireEvent.click(screen.getByText(/Tallenna/))

    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaalin luonti epäonnistui',
        'error',
        3000
      )
    })
  })

  test.skip('calls materialService.create when form is submitted successfully', async () => {
    const formData = {
      name: 'Test Material',
      description: 'A description for the test material.',
      user_id: '123',
      visible: true,
      is_url: false,
      material: new File(['material content'], 'material.pdf', {
        type: 'application/pdf',
      }),
      material_type: 'application/pdf',
    }

    materialService.create.mockResolvedValueOnce({})

    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
        />
      </Router>
    )

    fireEvent.change(screen.getByLabelText(/Materiaalin nimi:/), {
      target: { value: formData.name },
    })
    fireEvent.change(screen.getByLabelText(/Kuvaus:/), {
      target: { value: formData.description },
    })

    fireEvent.click(screen.getByText(/Tallenna/))

    await waitFor(() => {
      expect(materialService.create).toHaveBeenCalledWith(expect.any(FormData))
      expect(onMaterialAddedMock).toHaveBeenCalled()
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaali lisätty',
        'message',
        2000
      )
    })
  })

  test('handles file input correctly', () => {
    const file = new File(['test file content'], 'testfile.pdf', {
      type: 'application/pdf',
    })

    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
        />
      </Router>
    )

    const fileInput = screen.getByLabelText(/Materiaali/)

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(screen.getByLabelText(/Materiaali/).files[0]).toBe(file)
  })

  test('shows URL input when is_url checkbox is checked', () => {
    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
        />
      </Router>
    )

    fireEvent.click(screen.getByLabelText(/Onko materiaali linkki:/))

    expect(screen.getByLabelText(/Linkki:/)).toBeInTheDocument()
  })

  test.skip('shows error when URL is invalid', async () => {
    const validateMaterialMock = vi.fn().mockResolvedValue({
      url: 'URL is invalid',
    })

    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
        />
      </Router>
    )

    fireEvent.click(screen.getByLabelText(/Onko materiaali linkki:/))
    fireEvent.change(screen.getByLabelText(/Linkki:/), {
      target: { value: 'invalid-url' },
    })

    fireEvent.click(screen.getByText(/Tallenna/))

    await waitFor(() => {
      expect(screen.getByText(/Lisää URL-osoite/)).toBeInTheDocument()
    })
  })
})
