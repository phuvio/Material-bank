import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, test, afterEach, expect, beforeEach } from 'vitest'
import selectTags from './selectTags'
import tagService from '../services/tags'

// Mock the tagService
vi.mock('../services/tags', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

const TestComponent = () => {
  const { tags, selectedTags, toggleTags } = selectTags()

  return (
    <div>
      <div data-testid="tags">
        {tags.map((tag) => (
          <div key={tag.id} data-testid={`tag-${tag.id}`}>
            {tag.name}
          </div>
        ))}
      </div>
      <div data-testid="selectedTags">
        {selectedTags.map((id) => (
          <div key={id} data-testid={`selectedTag-${id}`}>
            Selected Tag: {id}
          </div>
        ))}
      </div>
      <div>
        {tags.map((tag) => (
          <button
            key={tag.id}
            data-testid={`toggle-${tag.id}`}
            onClick={() => toggleTags(tag.id)}
          >
            Toggle {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}

describe('selectTags Hook', () => {
  beforeEach(() => {
    tagService.getAll.mockResolvedValue([
      { id: 1, name: 'Tag A' },
      { id: 2, name: 'Tag B' },
    ])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('fetches and displays tags', async () => {
    render(<TestComponent />)

    const tagA = await screen.findByTestId('tag-1')
    const tagB = await screen.findByTestId('tag-2')

    expect(tagA).toHaveTextContent('Tag A')
    expect(tagB).toHaveTextContent('Tag B')
  })

  test('toggles selected tags', async () => {
    render(<TestComponent />)

    const toggleA = await screen.findByTestId('toggle-1')
    const toggleB = await screen.findByTestId('toggle-2')

    fireEvent.click(toggleA)
    expect(screen.getByTestId('selectedTag-1')).toHaveTextContent(
      'Selected Tag: 1'
    )

    fireEvent.click(toggleB)
    expect(screen.getByTestId('selectedTag-2')).toHaveTextContent(
      'Selected Tag: 2'
    )

    fireEvent.click(toggleA)
    expect(screen.queryByTestId('selectedTag-1')).toBeNull()
  })
})
