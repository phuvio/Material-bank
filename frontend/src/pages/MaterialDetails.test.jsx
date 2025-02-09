import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MaterialDetails from './MaterialDetails'
import materialService from '../services/materials'
import tagService from '../services/tags'
import decodeToken from '../utils/decode'

vi.mock('../services/materials', () => ({
  default: {
    getSingle: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('../services/tags', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

vi.mock('../utils/decode', () => ({
  default: vi.fn(() => ({
    role: 'user', // Default role
    user_id: '123',
    fullname: 'John Doe',
  })),
}))

const mockTags = [
  { id: 1, name: 'Tag 1' },
  { id: 2, name: 'Tag 2' },
]

const mockShowNotification = vi.fn()

const mockMaterial = {
  id: '1',
  name: 'Test Material',
  description: 'This is a test material.',
  is_url: true,
  url: 'http://example.com',
  updated_at: '2024-02-09',
  Tags: [{ id: 1, name: 'Tag1', color: '#ff0000' }],
  User: { first_name: 'John', last_name: 'Doe' },
  user_id: 123,
}

describe('MaterialDetails Component', () => {
  beforeEach(() => {
    materialService.getSingle.mockResolvedValue(mockMaterial)
    tagService.getAll.mockResolvedValue(mockTags)
    decodeToken.mockReturnValue({
      user_id: 123,
      role: 'user',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders loading message initially', () => {
    render(
      <MemoryRouter initialEntries={['/materiaalit/1']}>
        <Routes>
          <Route
            path="/materiaalit/:id"
            element={
              <MaterialDetails showNotification={mockShowNotification} />
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Materiaalia ei löytynyt')).toBeInTheDocument()
  })

  it('renders material details after fetching data', async () => {
    render(
      <MemoryRouter initialEntries={['/materiaalit/1']}>
        <Routes>
          <Route
            path="/materiaalit/:id"
            element={
              <MaterialDetails showNotification={mockShowNotification} />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Material')).toBeInTheDocument()
      expect(screen.getByText('This is a test material.')).toBeInTheDocument()
    })
  })

  it('handles delete confirmation and calls API', async () => {
    window.confirm = vi.fn().mockReturnValue(true)
    materialService.remove.mockResolvedValue()

    render(
      <MemoryRouter initialEntries={['/materiaalit/1']}>
        <Routes>
          <Route
            path="/materiaalit/:id"
            element={
              <MaterialDetails showNotification={mockShowNotification} />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('Test Material'))

    const deleteButton = screen.getByText('Poista materiaali')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(materialService.remove).toHaveBeenCalledWith('1')
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Materiaali poistettu onnistuneesti',
        'message',
        2000
      )
    })
  })

  it('handles tag updates', async () => {
    materialService.update.mockResolvedValue()

    render(
      <MemoryRouter initialEntries={['/materiaalit/1']}>
        <Routes>
          <Route
            path="/materiaalit/:id"
            element={
              <MaterialDetails showNotification={mockShowNotification} />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('Test Material'))

    const saveButton = screen.getByText('Tallenna')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(materialService.update).toHaveBeenCalled()
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Tagit päivitetty onnistuneesti',
        'message',
        2000
      )
    })
  })
})
