import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import NewMaterial from './NewMaterial'
import materialService from '../services/materials'

vi.mock('../services/materials')
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

  test.skip('submits form with valid data and calls API', async () => {
    const formData = {
      name: 'Test Material',
      description: 'This is a test material',
      user_id: loggedInUser.user_id,
      visible: true,
      is_url: false,
      material: new File(['content'], 'test.txt', { type: 'text/plain' }), // File data
      material_type: 'text/plain',
    }

    materialService.create.mockResolvedValueOnce({})

    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={loggedInUser}
          onMaterialAdded={onMaterialAdded}
          showNotification={showNotificationMock}
        />
      </MemoryRouter>
    )

    // Fill out the form excluding the file input
    fireEvent.change(screen.getByLabelText(/Materiaalin nimi/), {
      target: { value: formData.name },
    })
    fireEvent.change(screen.getByLabelText(/Kuvaus/), {
      target: { value: formData.description },
    })
    fireEvent.change(screen.getByLabelText(/Onko materiaali linkki/), {
      target: { checked: false },
    })

    fireEvent.click(screen.getByText('Tallenna'))

    await waitFor(() => {
      expect(materialService.create).toHaveBeenCalledWith(expect.any(FormData))
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaali lisätty',
        'message',
        2000
      )
      expect(onMaterialAdded).toHaveBeenCalled()
    })
  })

  test('does not submit form when there are validation errors', async () => {
    materialService.create.mockResolvedValueOnce({})

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
      expect(materialService.create).not.toHaveBeenCalled()
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
