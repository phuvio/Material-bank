import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, beforeEach, test, expect, fireEvent } from 'vitest'
import MaterialDetails from './MaterialDetails'
import materialService from '../services/materials'

vi.mock('../services/materials')

const showNotificationMock = vi.fn()
const onMaterialAddedMock = vi.fn()
const mockLoggedInUser = { id: 1, name: 'Jane Doe', role: 0 }

describe('MaterialDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    materialService.getSingle.mockResolvedValue({
      id: 1,
      name: 'Test Material',
      description: 'This is a test material.',
      updated_at: '2024-01-01T00:00:00.000Z',
      is_url: false,
      User: { id: 1, first_name: 'John', last_name: 'Doe' },
      Tags: [{ id: 1, name: 'Tag1', color: '#123456' }],
    })
  })

  test('renders MaterialDetails correctly', async () => {
    render(
      <MemoryRouter>
        <MaterialDetails
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    // Wait for the material name to appear
    expect(await screen.findByText(/Test Material/)).toBeInTheDocument()
    expect(screen.getByText(/This is a test material./)).toBeInTheDocument()
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/Tag1/)).toBeInTheDocument()
  })

  test('displays loading state when material is being fetched', () => {
    render(
      <MemoryRouter>
        <MaterialDetails
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    expect(screen.getByText(/Materiaalia ei löytynyt/)).toBeInTheDocument()
  })

  test('displays error message when material is not found', async () => {
    render(
      <MemoryRouter>
        <MaterialDetails
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    expect(
      await screen.findByText(/Materiaalia ei löytynyt/)
    ).toBeInTheDocument()
  })

  test('renders tags associated with the material', async () => {
    render(
      <MemoryRouter>
        <MaterialDetails
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    const tagElement = await screen.findByText(/Tag1/)
    expect(tagElement).toBeInTheDocument()
    expect(tagElement).toHaveStyle({ background: '#123456' })
  })

  test('renders the correct download button based on is_url flag', async () => {
    materialService.getSingle.mockResolvedValue({
      id: 1,
      name: 'Test Material',
      description: 'This is a test material.',
      updated_at: '2024-01-01T00:00:00.000Z',
      is_url: true,
      User: { id: 1, first_name: 'John', last_name: 'Doe' },
      Tags: [{ id: 1, name: 'Tag1', color: '#123456' }],
    })
    render(
      <MemoryRouter>
        <MaterialDetails
          loggedInUser={mockLoggedInUser}
          showNotification={showNotificationMock}
          onMaterialAdded={onMaterialAddedMock}
        />
      </MemoryRouter>
    )

    expect(
      await screen.findByRole('button', { name: /Avaa linkki/ })
    ).toBeInTheDocument()
  })
})
