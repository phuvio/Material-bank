import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Main_page from './Main_page'
import favoriteService from '../services/favorites'
import tagService from '../services/tags'
import materialService from '../services/materials'

// Mock components for isolated testing
vi.mock('../components/Load_link_button', () => ({
  default: ({ url }) => (
    <button data-testid="load-link-button">Load {url}</button>
  ),
}))

vi.mock('../components/Load_material_button', () => ({
  default: ({ material }) => (
    <button data-testid="load-material-button">Load {material.name}</button>
  ),
}))

vi.mock('../components/Filter', () => ({
  default: ({ value, handleChange }) => (
    <input
      data-testid="filter-input"
      value={value}
      onChange={handleChange}
      placeholder="Filter materials"
    />
  ),
}))

vi.mock('../components/TagFilter', () => ({
  default: ({ tags, selectedTags, toggleTags }) => (
    <div data-testid="tag-filter">
      {tags.map((tag) => (
        <button
          key={tag.id}
          data-testid={`tag-button-${tag.id}`}
          onClick={() => toggleTags(tag.id)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('../services/tags', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

vi.mock('../services/favorites', () => ({
  default: {
    get: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('../services/materials', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

describe('Main_page Component', () => {
  const mockMaterials = [
    {
      id: 1,
      name: 'Material 1',
      visible: true,
      is_url: true,
      url: 'http://example.com',
      Tags: [
        { id: 1, name: 'Tag 1' },
        { id: 2, name: 'Tag 2' },
      ],
    },
    {
      id: 2,
      name: 'Material 2',
      visible: true,
      is_url: false,
      Tags: [{ id: 2, name: 'Tag 2' }],
    },
    {
      id: 3,
      name: 'Hidden Material',
      visible: false,
      is_url: false,
      Tags: [],
    },
  ]

  const mockTags = [
    { id: 1, name: 'Tag 1' },
    { id: 2, name: 'Tag 2' },
  ]

  const mockFavorites = [
    { id: 1, name: 'Material 1', is_url: true, url: 'http://example.com' },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    tagService.getAll.mockResolvedValue(mockTags)
    favoriteService.get.mockResolvedValue(mockFavorites)
    materialService.getAll.mockResolvedValue(mockMaterials)
  })

  it('renders the filter input and materials list', async () => {
    render(
      <BrowserRouter>
        <Main_page loggedInUser={{ user_id: '1' }} showNotification={vi.fn()} />
      </BrowserRouter>
    )

    // Wait for tags to load
    await screen.findByTestId('tag-filter')

    // Check Filter input
    expect(screen.getByTestId('filter-input')).toBeInTheDocument()

    // Check visible materials
    expect(screen.getAllByText('Material 1')).toHaveLength(2)
    expect(screen.getAllByText('Material 2')).toHaveLength(1)
    expect(screen.queryByText('Hidden Material')).not.toBeInTheDocument()
  })

  it.skip('adds and removes favorites correctly', async () => {
    render(
      <BrowserRouter>
        <Main_page loggedInUser={{ user_id: '1' }} showNotification={vi.fn()} />
      </BrowserRouter>
    )

    // Wait for favorites to load
    await screen.findByText('Omat suosikit')

    // Simulate adding a favorite
    favoriteService.create.mockResolvedValue(mockMaterials)
    const favoriteButton = screen.getAllByRole('button', {
      class: 'favoriteButton',
    })
    fireEvent.click(favoriteButton[2])
    expect(screen.getAllByText('Material 2')).toHaveLength(1)

    // Simulate removing a favorite
    favoriteService.remove.mockResolvedValue()
    fireEvent.click(favoriteButton[1])
    await waitFor(() => expect(favoriteService.remove).toHaveBeenCalled())

    // Ensure favorite button state is updated
    expect(screen.getByText('Material 1')).toBeInTheDocument()
    expect(screen.getByText('Material 2')).toBeInTheDocument()
  })

  it('filters materials by text', async () => {
    render(
      <BrowserRouter>
        <Main_page loggedInUser={{ user_id: '1' }} showNotification={vi.fn()} />
      </BrowserRouter>
    )

    // Wait for tags to load
    await screen.findByTestId('tag-filter')

    expect(screen.getAllByText('Material 1')).toHaveLength(2)

    // Simulate typing in the filter
    const input = screen.getByTestId('filter-input')
    fireEvent.change(input, { target: { value: 'Material 2' } })

    // Check filtered materials
    expect(screen.getAllByText('Material 1')).toHaveLength(1)
    expect(screen.getByText('Material 2')).toBeInTheDocument()
  })

  it('filters materials by tags', async () => {
    render(
      <BrowserRouter>
        <Main_page loggedInUser={{ user_id: '1' }} showNotification={vi.fn()} />
      </BrowserRouter>
    )

    // Simulate clicking on a tag
    const tagButton1 = await screen.findByTestId('tag-button-1')
    fireEvent.click(tagButton1)

    // Simulate clicking on another tag
    const tagButton2 = await screen.findByTestId('tag-button-2')
    fireEvent.click(tagButton2)

    // Expect materials matching both tags to be shown
    expect(screen.getAllByText('Material 1')).toHaveLength(2)
    expect(screen.queryByText('Material 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden Material')).not.toBeInTheDocument()
  })

  it('provides a link to create a new material', () => {
    render(
      <BrowserRouter>
        <Main_page loggedInUser={{ user_id: '1' }} showNotification={vi.fn()} />
      </BrowserRouter>
    )

    // Check if the link to create a new material is present
    expect(screen.getByText('Luo uusi materiaali')).toBeInTheDocument()
  })
})
