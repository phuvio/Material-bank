import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Main_page from './Main_page'
import tagService from '../services/tags'

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

describe('Main_page Component', () => {
  const mockMaterials = [
    {
      id: 1,
      name: 'Material 1',
      visible: true,
      is_url: true,
      url: 'http://example.com',
      tags: [1, 2],
    },
    {
      id: 2,
      name: 'Material 2',
      visible: true,
      is_url: false,
      tags: [2],
    },
    {
      id: 3,
      name: 'Hidden Material',
      visible: false,
      is_url: false,
      tags: [],
    },
  ]

  const mockTags = [
    { id: 1, name: 'Tag 1' },
    { id: 2, name: 'Tag 2' },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    tagService.getAll.mockResolvedValue(mockTags)
  })

  it('renders the filter input and materials list', async () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    // Wait for tags to load
    await screen.findByTestId('tag-filter')

    // Check Filter input
    expect(screen.getByTestId('filter-input')).toBeInTheDocument()

    // Check visible materials
    expect(screen.getByText('Material 1')).toBeInTheDocument()
    expect(screen.getByText('Material 2')).toBeInTheDocument()
    expect(screen.queryByText('Hidden Material')).not.toBeInTheDocument()
  })

  it('renders available tags', async () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    // Wait for tags to load
    const tagButtons = await screen.findAllByTestId(/tag-button-/)
    expect(tagButtons).toHaveLength(mockTags.length)
    mockTags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeInTheDocument()
    })
  })

  it('filters materials by text', async () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    // Wait for tags to load
    await screen.findByTestId('tag-filter')

    // Simulate typing in the filter
    const input = screen.getByTestId('filter-input')
    fireEvent.change(input, { target: { value: 'Material 2' } })

    // Check filtered materials
    expect(screen.queryByText('Material 1')).not.toBeInTheDocument()
    expect(screen.getByText('Material 2')).toBeInTheDocument()
  })

  it('filters materials by tags', async () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    // Simulate clicking on a tag
    const tagButton = await screen.findByTestId('tag-button-1')
    fireEvent.click(tagButton)

    // Expect materials matching the tag to be shown
    expect(screen.getByText('Material 1')).toBeInTheDocument()
    expect(screen.queryByText('Material 2')).not.toBeInTheDocument()
  })

  it('provides a link to create a new material', () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    const newMaterialLink = screen.getByText('Luo uusi materiaali')
    expect(newMaterialLink).toHaveAttribute('href', '/newmaterial')
  })
})
