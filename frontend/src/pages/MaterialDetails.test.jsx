import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import MaterialDetails from './MaterialDetails'
import materialService from '../services/materials'

beforeEach(() => {
  vi.clearAllMocks()
})

vi.mock('../services/materials') // Mocking the materialService

describe('MaterialDetails', () => {
  const mockMaterial = {
    id: '1',
    name: 'Test Material',
    description: 'A description for the test material',
    is_url: false,
    url: '',
    Tags: [{ id: '1', name: 'Tag1', color: 'red' }],
    User: { first_name: 'John', last_name: 'Doe' },
    updated_at: '2025-01-01',
  }

  const mockShowNotification = vi.fn()
  const mockOnMaterialAdded = vi.fn()

  beforeEach(() => {
    materialService.getSingle = vi.fn().mockResolvedValue(mockMaterial)
    materialService.remove = vi.fn().mockResolvedValue()
    materialService.update = vi.fn().mockResolvedValue()
  })

  test('renders material details and loads them from the API', async () => {
    render(
      <MemoryRouter initialEntries={['/material/1']}>
        <MaterialDetails
          loggedInUser={{ role: 'admin', user_id: '1' }}
          onMaterialAdded={mockOnMaterialAdded}
          showNotification={mockShowNotification}
        />
      </MemoryRouter>
    )

    // Check if the material name is rendered
    expect(await screen.findByText('Test Material')).toBeInTheDocument()
    // Check if the description is rendered
    expect(
      screen.getByText('A description for the test material')
    ).toBeInTheDocument()
    // Check if the tag is rendered
    expect(screen.getByText('Tag1')).toBeInTheDocument()
  })

  test('handles delete material action', async () => {
    window.confirm = vi.fn().mockReturnValue(true) // Mocking the confirm dialog

    render(
      <MemoryRouter initialEntries={['/material/1']}>
        <MaterialDetails
          loggedInUser={{ role: 'admin', user_id: '1' }}
          onMaterialAdded={mockOnMaterialAdded}
          showNotification={mockShowNotification}
        />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('Test Material'))

    const deleteButton = screen.getByText('Poista materiaali')
    fireEvent.click(deleteButton)

    await waitFor(() => expect(materialService.remove).toHaveBeenCalled())

    // Ensure a notification was shown
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Materiaali poistettu onnistuneesti',
      'message',
      2000
    )
  })

  test('handles tag update action', async () => {
    render(
      <MemoryRouter initialEntries={['/material/1']}>
        <MaterialDetails
          loggedInUser={{ role: 'admin', user_id: '1' }}
          onMaterialAdded={mockOnMaterialAdded}
          showNotification={mockShowNotification}
        />
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('Test Material'))

    const updateTagsButton = screen.getByText('Päivitä tagit')
    fireEvent.click(updateTagsButton)

    // Check that the update function was called
    await waitFor(() => expect(materialService.update).toHaveBeenCalled())
    // Ensure the notification for success is shown
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Tagit päivitetty onnistuneesti',
      'message',
      2000
    )
    // Ensure the callback onMaterialAdded was called
    expect(mockOnMaterialAdded).toHaveBeenCalled()
  })

  test('displays "Materiaalia ei löytynyt" when material is not found', async () => {
    materialService.getSingle = vi
      .fn()
      .mockRejectedValue(new Error('Material not found'))

    render(
      <MemoryRouter initialEntries={['/material/1']}>
        <MaterialDetails
          loggedInUser={{ role: 'admin', user_id: '1' }}
          onMaterialAdded={mockOnMaterialAdded}
          showNotification={mockShowNotification}
        />
      </MemoryRouter>
    )

    // Check for the "Materiaalia ei löytynyt" message
    expect(
      await screen.findByText('Materiaalia ei löytynyt')
    ).toBeInTheDocument()
  })
})
