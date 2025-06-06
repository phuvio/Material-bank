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
        <TagAdmin showNotification={vi.fn()} />
      </Router>
    )

    // Check if the initial content is rendered
    expect(screen.getByText('Etsi tageista')).toBeInTheDocument()
    expect(screen.getByText('Tagit')).toBeInTheDocument()

    // Wait for the tags to load and be displayed
    await waitFor(() => {
      const tagElements = screen.getAllByText('Tag1')
      expect(tagElements).toHaveLength(2)
    })
    await waitFor(() => {
      const tagElements2 = screen.getAllByText('Tag2')
      expect(tagElements2).toHaveLength(2)
    })
    await waitFor(() => {
      const tagElements3 = screen.getAllByText('Tag3')
      expect(tagElements3).toHaveLength(2)
    })
  })

  it('filters tags based on input', async () => {
    render(
      <Router>
        <TagAdmin showNotification={vi.fn()} />
      </Router>
    )

    // Wait for tags to load
    await waitFor(() => {
      const tagElements = screen.getAllByText('Tag1')
      expect(tagElements).toHaveLength(2)
    })

    // Find filter input and change value
    const filterInput = screen.getByRole('textbox')
    fireEvent.change(filterInput, { target: { value: 'Tag1' } })

    // Check if only the filtered tag is displayed
    expect(screen.queryByText('Tag2')).toBeNull()
    expect(screen.queryByText('Tag3')).toBeNull()
  })

  it('displays a link to create a new tag', () => {
    render(
      <Router>
        <TagAdmin showNotification={vi.fn()} />
      </Router>
    )

    expect(screen.getByText('Luo uusi tagi')).toHaveAttribute(
      'href',
      '/uusitagi'
    )
  })

  it('handles error if fetching tags fails and shows notification', async () => {
    const showNotification = vi.fn()
    tagService.getAll.mockRejectedValueOnce(new Error('Error fetching data'))

    render(
      <Router>
        <TagAdmin showNotification={showNotification} />
      </Router>
    )

    // Wait for the component to try fetching and handle error
    await waitFor(() => {
      expect(tagService.getAll).toHaveBeenCalled()
    })

    // Verify that the notification function is called with the correct arguments
    expect(showNotification).toHaveBeenCalledWith(
      'Virhe haettaessa tageja.',
      'error',
      3000
    )
  })
})
