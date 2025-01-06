import { vi, describe, beforeEach, test, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NewMaterial from './NewMaterial'

vi.mock('../services/materials') // Mock the entire materialService module

const showNotificationMock = vi.fn()

describe('NewMaterial Component', () => {
  const loggedInUser = { user_id: 1 }
  const onMaterialAdded = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders NewMaterial form correctly', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAdded}
          showNotification={showNotificationMock}
        />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/Materiaalin nimi/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kuvaus/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Onko materiaali linkki/)).toBeInTheDocument()
    expect(screen.getByText('Tallenna')).toBeInTheDocument()
  })

  test('shows validation error when form is submitted with empty fields', async () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAdded}
          showNotification={showNotificationMock}
        />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Tallenna'))

    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaalin luonti epäonnistui',
        'error',
        3000
      )
    })
  })

  test('displays URL input when "is_url" is checked', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAdded}
          showNotification={showNotificationMock}
        />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByLabelText(/Onko materiaali linkki/))

    expect(screen.getByLabelText(/Linkki:/)).toBeInTheDocument()
  })

  test('does not display file input when "is_url" is checked', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAdded}
          showNotification={showNotificationMock}
        />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByLabelText(/Onko materiaali linkki/))

    expect(screen.queryByLabelText(/material/)).not.toBeInTheDocument()
  })
})
