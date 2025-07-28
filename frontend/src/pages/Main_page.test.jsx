import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Main_page from './Main_page'
import favoriteService from '../services/favorites'
import tagService from '../services/tags'
import materialService from '../services/materials'
import decodeToken from '../utils/decode'

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
  default: ({ tags, toggleTags }) => (
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

vi.mock('../utils/decode', () => ({
  default: vi.fn(() => ({
    role: 'user', // Default role
    user_id: '123',
    fullname: 'John Doe',
  })),
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
    decodeToken.mockReturnValue({
      user_id: 123,
      role: 'user',
    })

    render(
      <BrowserRouter>
        <Main_page showNotification={vi.fn()} />
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
})
