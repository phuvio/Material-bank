import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import NewMaterial from './NewMaterial'
import materialService from '../services/materials'
import decodeToken from '../utils/decode'

beforeEach(() => {
  vi.clearAllMocks()
})

vi.mock('../services/materials')

vi.mock('../utils/decode', () => ({
  default: vi.fn(() => ({
    role: 'user', // Default role
    user_id: '123',
    fullname: 'John Doe',
  })),
}))

vi.mock('../utils/materialValidations', () => ({
  validateMaterial: vi.fn().mockResolvedValue({
    name: 'Name is required',
    description: 'Description is too short',
  }),
}))

const showNotificationMock = vi.fn()
const onMaterialAddedMock = vi.fn()

describe('NewMaterial Component', () => {
  beforeEach(() => {
    materialService.create.mockResolvedValue()
  })

  test('renders form inputs and submit button', () => {
    render(
      <MemoryRouter>
        <NewMaterial
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
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const materialNameInput = screen.getByLabelText(/Materiaalin nimi:/)
    fireEvent.change(materialNameInput, { target: { value: 'Test material' } })
    expect(materialNameInput.value).toBe('Test material')
  })

  test('toggles material type and updates URL field', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const isUrlCheckbox = screen.getByLabelText(/Onko materiaali linkki:/)
    fireEvent.click(isUrlCheckbox)

    expect(isUrlCheckbox.checked).toBe(true)

    const urlInput = screen.getByLabelText(/Linkki:/)
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    expect(urlInput.value).toBe('https://example.com')
  })

  test('handles file input correctly', () => {
    render(
      <MemoryRouter>
        <NewMaterial
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const fileInput = screen.getByLabelText('Material')
    const file = new File(['file content'], 'test-file.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(fileInput.files[0]).toBe(file)
    expect(fileInput.files[0].name).toBe('test-file.pdf')
  })

  test('displays validation errors on submit if fields are invalid', async () => {
    decodeToken.mockReturnValue({ role: 'user' })

    render(
      <MemoryRouter>
        <NewMaterial
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const submitButton = screen.getByText(/Tallenna/)
    fireEvent.click(submitButton)

    // Check that the notification mock was called
    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaalin luonti epäonnistui',
        'error',
        3000
      )
    })
  })

  test.skip('submits form data correctly', async () => {
    decodeToken.mockReturnValue({ user_id: 123 })

    render(
      <MemoryRouter>
        <NewMaterial
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const materialNameInput = screen.getByLabelText(/Materiaalin nimi:/)
    fireEvent.change(materialNameInput, { target: { value: 'Test Material' } })

    const descriptionInput = screen.getByLabelText(/Kuvaus:/)
    fireEvent.change(descriptionInput, {
      target: { value: 'A test description' },
    })

    const isUrlCheckbox = screen.getByLabelText(/Onko materiaali linkki:/)
    fireEvent.click(isUrlCheckbox)

    const urlInput = screen.getByLabelText(/Linkki:/)
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })

    const submitButton = screen.getByText(/Tallenna/)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Materiaali lisätty',
        'message',
        2000
      )
    })
    expect(onMaterialAddedMock).toHaveBeenCalled()
  })
})
