import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import NewMaterial from './NewMaterial'
import materialService from '../services/materials'

beforeEach(() => {
  vi.clearAllMocks()
})

vi.mock('../services/materials')

const showNotificationMock = vi.fn()
const onMaterialAddedMock = vi.fn()
const mockLoggedInUser = { user_id: 1, name: 'Jane Doe' }

describe('NewMaterial Component', () => {
  beforeEach(() => {
    materialService.create.mockResolvedValue()
  })

  test('renders form inputs and submit button', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/Materiaalin nimi:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kuvaus:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Onko materiaali linkki:/)).toBeInTheDocument()
    expect(screen.getByText(/Tallenna/)).toBeInTheDocument()
  })

  test('updates form state on input change', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const materialNameInput = screen.getByLabelText(/Materiaalin nimi:/)
    fireEvent.change(materialNameInput, { target: { value: 'Test material' } })

    expect(materialNameInput.value).toBe('Test material')
  })

  test('handles file input correctly', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const fileInput = screen.getByLabelText(/Material/)
    const file = new File(['file content'], 'test-file.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(fileInput.files[0]).toBe(file)
    expect(fileInput.files[0].name).toBe('test-file.pdf')
  })

  test('shows validation errors on submit', async () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const submitButton = screen.getByText(/Tallenna/)
    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaalin luonti epäonnistui',
        'error',
        3000
      )
    )
  })

  test('submits the form and calls services', async () => {
    render(
      <MemoryRouter>
        <NewMaterial
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const materialNameInput = screen.getByLabelText(/Materiaalin nimi:/)
    fireEvent.change(materialNameInput, { target: { value: 'Test material' } })

    const descriptionInput = screen.getByLabelText(/Kuvaus:/)
    fireEvent.change(descriptionInput, {
      target: { value: 'Test description' },
    })

    const isUrlInput = screen.getByLabelText(/Onko materiaali linkki:/)
    fireEvent.click(isUrlInput)

    const urlInput = screen.getByLabelText(/Linkki:/)
    fireEvent.change(urlInput, {
      target: { value: 'http://www.proneuron.fi' },
    })

    const submitButton = screen.getByText(/Tallenna/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(materialService.create).toHaveBeenCalled()
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaali lisätty',
        'message',
        2000
      )
      expect(onMaterialAddedMock).toHaveBeenCalled()
    })
  })
})
