import React from 'react'
import { describe, test, afterEach, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import MaterialDetails from './MaterialDetails'

// Mock dependencies
vi.mock('axios')
vi.mock('../components/Load_link_button', () => ({
  default: () => <div>Load Link Button</div>,
}))
vi.mock('../components/Load_material_button', () => ({
  default: () => <div>Load Material Button</div>,
}))

// Mock material data
const mockMaterial = {
  name: 'Test Material',
  description: 'This is a test material.',
  is_url: true,
  url: 'https://example.com',
  User: { first_name: 'Pekka', last_name: 'Puupää' },
  updated_at: new Date().toISOString(),
}

describe('MaterialDetails Component', () => {
  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>)

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('fetches and displays material data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockMaterial })

    renderWithRouter(<MaterialDetails />)

    await waitFor(() => {
      expect(screen.getByText('Test Material')).toBeInTheDocument()
      expect(screen.getByText('This is a test material.')).toBeInTheDocument()
      expect(screen.getByText('Load Link Button')).toBeInTheDocument()
      expect(
        screen.getByText(/Muokattu: \d{1,2}\.\d{1,2}\.\d{4}/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Materiaalin tallentaja: Pekka Puupää/i)
      ).toBeInTheDocument()
    })
  })

  test('renders LoadMaterialButton when is_url is false', async () => {
    axios.get.mockResolvedValueOnce({
      data: { ...mockMaterial, is_url: false },
    })

    renderWithRouter(<MaterialDetails />)

    await waitFor(() => {
      expect(screen.getByText('Load Material Button')).toBeInTheDocument()
    })
  })

  test('handles fetch error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'))

    renderWithRouter(<MaterialDetails />)

    // Expect loading text when fetch fails
    expect(screen.getByText(/Haetaan materiaalia.../i)).toBeInTheDocument()
  })
})
