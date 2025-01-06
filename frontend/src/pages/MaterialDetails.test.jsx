import React from 'react'
import { describe, expect, vi, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import MaterialDetails from './MaterialDetails'
import materialService from '../services/materials'

// Mock services
vi.mock('../services/materials')
vi.mock('axios')

// Inside your test case
axios.get.mockResolvedValue({ data: { tags: [] } })

// Mocked user and notification props
const mockLoggedInUser = {
  role: 1,
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
}
const mockShowNotification = vi.fn()

describe('MaterialDetails Component', () => {
  const mockMaterial = {
    id: '1',
    name: 'Test Material',
    description: 'This is a test material.',
    Tags: [{ id: '1', name: 'Tag1', color: 'red' }],
    is_url: false,
    url: '',
    User: { id: '1', first_name: 'Jane', last_name: 'Smith' },
    updated_at: '2025-01-06T12:00:00Z',
  }

  it.skip('renders the material details when data is fetched successfully', async () => {
    materialService.getSingle.mockResolvedValue(mockMaterial)

    render(
      <MemoryRouter initialEntries={['/materials/1']}>
        <Routes>
          <Route
            path="/materials/:id"
            element={
              <MaterialDetails
                loggedInUser={mockLoggedInUser}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.getByText('Test Material')).toBeInTheDocument()
    )

    // Check for material details rendering
    expect(screen.getByText('This is a test material.')).toBeInTheDocument()
    expect(screen.getByText('Tag1')).toBeInTheDocument()
    expect(
      screen.getByText('Materiaalin tallentaja: Jane Smith')
    ).toBeInTheDocument()
    expect(screen.getByText('Muokattu: 6.1.2025')).toBeInTheDocument()
  })

  it('shows error message when material is not found', async () => {
    materialService.getSingle.mockRejectedValue(new Error('Material not found'))

    render(
      <MemoryRouter initialEntries={['/materials/1']}>
        <Routes>
          <Route
            path="/materials/:id"
            element={
              <MaterialDetails
                loggedInUser={mockLoggedInUser}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.getByText('Materiaalia ei löytynyt')).toBeInTheDocument()
    )
  })

  it.skip('conditionally shows the "Edit material" link based on user role or ownership', async () => {
    materialService.getSingle.mockResolvedValue(mockMaterial)

    // Case 1: Logged in user is the material owner
    render(
      <MemoryRouter initialEntries={['/materials/1']}>
        <Routes>
          <Route
            path="/materials/:id"
            element={
              <MaterialDetails
                loggedInUser={{ ...mockLoggedInUser, id: '1' }}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.getByText('Muokkaa materiaalia')).toBeInTheDocument()
    )

    // Case 2: Logged in user is not the material owner
    render(
      <MemoryRouter initialEntries={['/materials/1']}>
        <Routes>
          <Route
            path="/materials/:id"
            element={
              <MaterialDetails
                loggedInUser={{ ...mockLoggedInUser, id: '2' }}
                showNotification={mockShowNotification}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.queryByText('Muokkaa materiaalia')).not.toBeInTheDocument()
    )
  })
})
