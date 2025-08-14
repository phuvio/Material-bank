// Packages.test.jsx
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Packages from './Packages'
import packageService from '../services/packages'

// Mock packageService
vi.mock('../services/packages', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

// Mock Filter component (basic input)
vi.mock('../components/Filter', () => ({
  default: ({ value, handleChange }) => (
    <input data-testid="filter-input" value={value} onChange={handleChange} />
  ),
}))

// Mock Link so router isn't required
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}))

describe('Packages component', () => {
  let showNotification

  beforeEach(() => {
    showNotification = vi.fn()
    vi.clearAllMocks()
  })

  it('renders loading state, then package list', async () => {
    packageService.getAll.mockResolvedValue([
      { id: 2, name: 'Beta' },
      { id: 1, name: 'Alpha' },
    ])

    render(<Packages showNotification={showNotification} />)

    // Loading indicator
    expect(screen.getByText(/Ladataan paketteja/i)).toBeInTheDocument()

    // Wait for list to appear
    await waitFor(() => {
      expect(screen.queryByText(/Ladataan paketteja/i)).not.toBeInTheDocument()
    })

    // Sorted alphabetically
    const items = screen.getAllByRole('link')
    expect(items[0]).toHaveTextContent('Alpha')
    expect(items[1]).toHaveTextContent('Beta')
  })

  it('filters packages based on input', async () => {
    packageService.getAll.mockResolvedValue([
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
    ])

    render(<Packages showNotification={showNotification} />)

    await waitFor(() => {
      expect(screen.getAllByRole('link')).toHaveLength(2)
    })

    fireEvent.change(screen.getByTestId('filter-input'), {
      target: { value: 'Al' },
    })

    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link')).toHaveTextContent('Alpha')
  })

  it('calls showNotification on fetch error', async () => {
    packageService.getAll.mockRejectedValue(new Error('Network error'))

    render(<Packages showNotification={showNotification} />)

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        'Virhe haettaessa paketteja.',
        'error',
        3000
      )
    })
  })
})
