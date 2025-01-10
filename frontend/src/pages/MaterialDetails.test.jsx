import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MaterialDetails from './MaterialDetails'
import materialService from '../services/materials'
import { vi, describe, beforeEach, it, expect } from 'vitest'

// Mock the necessary services and functions
vi.mock('../services/materials')
vi.mock('../components/Load_link_button', () => ({
  default: () => <div>Mock LoadLinkButton</div>,
}))
vi.mock('../components/Load_material_button', () => ({
  default: () => <div>Mock LoadMaterialButton</div>,
}))
vi.mock('../components/TagFilter', () => ({
  default: () => <div>Mock TagFilter</div>,
}))

describe('MaterialDetails', () => {
  const mockShowNotification = vi.fn()
  const mockOnMaterialAdded = vi.fn()
  const loggedInUser = { user_id: 1, role: 'admin' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state and material details', async () => {
    // Mock the response from materialService.getSingle
    const mockMaterial = {
      id: '1',
      name: 'Material 1',
      description: 'This is a test material',
      is_url: true,
      url: 'https://example.com',
      Tags: [
        { id: 1, name: 'Tag 1', color: 'red' },
        { id: 2, name: 'Tag 2', color: 'blue' },
      ],
      updated_at: '2025-01-01',
      User: { first_name: 'John', last_name: 'Doe' },
    }
    materialService.getSingle.mockResolvedValue(mockMaterial)

    // Render the component inside a MemoryRouter
    render(
      <MemoryRouter initialEntries={['/material/1']}>
        <Routes>
          <Route
            path="/material/:id"
            element={
              <MaterialDetails
                loggedInUser={loggedInUser}
                onMaterialAdded={mockOnMaterialAdded}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    // Check that the loading state (if any) is not visible
    await waitFor(() =>
      expect(
        screen.queryByText(/Materiaalia ei löytynyt/)
      ).not.toBeInTheDocument()
    )

    // Check that material details are displayed correctly
    expect(screen.getByText('Material 1')).toBeInTheDocument()
    expect(screen.getByText('This is a test material')).toBeInTheDocument()
    expect(screen.getByText('Mock LoadLinkButton')).toBeInTheDocument()
    expect(screen.getByText('Mock TagFilter')).toBeInTheDocument()
    expect(
      screen.getByText('Materiaalin tallentaja: John Doe')
    ).toBeInTheDocument()
  })
})
