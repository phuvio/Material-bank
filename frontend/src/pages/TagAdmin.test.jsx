import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TagAdmin from './TagAdmin'
import tagService from '../services/tags'
import { BrowserRouter as Router } from 'react-router-dom'

// Mock the tagService to simulate fetching data
vi.mock('../services/tags')

describe('TagAdmin Component', () => {
  beforeEach(() => {
    tagService.getAll.mockResolvedValue([
      { id: 1, name: 'Tag1' },
      { id: 2, name: 'Tag2' },
      { id: 3, name: 'Tag3' },
    ])
  })

  it('renders correctly', async () => {
    render(
      <Router>
        <TagAdmin />
      </Router>
    )

    // Check if the initial content is rendered
    expect(screen.getByText('Etsi tageista')).toBeInTheDocument()
    expect(screen.getByText('Tagit')).toBeInTheDocument()

    // Wait for the tags to load and be displayed
    await waitFor(() => screen.getByText('Tag1'))
    expect(screen.getByText('Tag1')).toBeInTheDocument()
    expect(screen.getByText('Tag2')).toBeInTheDocument()
    expect(screen.getByText('Tag3')).toBeInTheDocument()
  })

  it('filters tags based on input', async () => {
    render(
      <Router>
        <TagAdmin />
      </Router>
    )

    // Wait for tags to load
    await waitFor(() => screen.getByText('Tag1'))

    // Find filter input and change value
    const filterInput = screen.getByRole('textbox')
    fireEvent.change(filterInput, { target: { value: 'Tag1' } })

    // Check if only the filtered tag is displayed
    await waitFor(() => expect(screen.getByText('Tag1')).toBeInTheDocument())
    expect(screen.queryByText('Tag2')).toBeNull()
    expect(screen.queryByText('Tag3')).toBeNull()
  })

  it('displays a link to create a new tag', () => {
    render(
      <Router>
        <TagAdmin />
      </Router>
    )

    expect(screen.getByText('Luo uusi tagi')).toHaveAttribute('href', '/newtag')
  })

  it('handles error if fetching tags fails', async () => {
    // Simulate a failed fetch
    tagService.getAll.mockRejectedValueOnce(new Error('Error fetching data'))

    render(
      <Router>
        <TagAdmin />
      </Router>
    )

    // Wait for the tags to load or error to show
    await waitFor(() => screen.queryByText('Tagit'))
    expect(screen.queryByText('Tag1')).toBeNull()
  })
})
