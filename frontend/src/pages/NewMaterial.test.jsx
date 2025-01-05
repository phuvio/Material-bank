import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, test, expect } from 'vitest'
import NewMaterial from './NewMaterial'
import { BrowserRouter as Router } from 'react-router-dom'

const showNotificationMock = vi.fn()

describe('NewMaterial component', () => {
  let loggedInUser
  let onMaterialAddedMock

  beforeEach(() => {
    loggedInUser = { user_id: '123' }
    onMaterialAddedMock = vi.fn()
  })

  test('renders form elements correctly', () => {
    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
          showNotification={showNotificationMock}
        />
      </Router>
    )

    expect(screen.getByLabelText(/Materiaalin nimi:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kuvaus:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Onko materiaali linkki:/)).toBeInTheDocument()
    expect(screen.getByText(/Tallenna/)).toBeInTheDocument()
  })

  test('validates form data and shows error notification when validation fails', async () => {
    render(
      <Router>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAddedMock}
          showNotification={showNotificationMock}
        />
      </Router>
    )

    fireEvent.change(screen.getByLabelText(/Materiaalin nimi:/), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByLabelText(/Kuvaus:/), {
      target: { value: '' },
    })

    fireEvent.click(screen.getByText(/Tallenna/))

    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaalin luonti epäonnistui',
        'error',
        3000
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
          showNotification={showNotificationMock}
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
          showNotification={showNotificationMock}
        />
      </Router>
    )

    fireEvent.click(screen.getByLabelText(/Onko materiaali linkki:/))

    expect(screen.getByLabelText(/Linkki:/)).toBeInTheDocument()
  })
})
