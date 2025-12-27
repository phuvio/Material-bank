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

    expect(screen.getByText(/Ladataan paketteja/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText(/Ladataan paketteja/i)).not.toBeInTheDocument()
    })

    const packageLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/paketti/'))

    expect(packageLinks[0]).toHaveTextContent('Alpha')
    expect(packageLinks[1]).toHaveTextContent('Beta')
  })

  it('filters packages based on input', async () => {
    packageService.getAll.mockResolvedValue([
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
    ])

    render(<Packages showNotification={showNotification} />)

    await waitFor(() => {
      const packageLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.startsWith('/paketti/'))
      expect(packageLinks).toHaveLength(2)
    })

    fireEvent.change(screen.getByTestId('filter-input'), {
      target: { value: 'Al' },
    })

    const filteredLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/paketti/'))

    expect(filteredLinks).toHaveLength(1)
    expect(filteredLinks[0]).toHaveTextContent('Alpha')
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
