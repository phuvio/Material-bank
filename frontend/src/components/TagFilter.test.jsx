import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import TagFilter from './TagFilter'

describe('TagFilter component', () => {
  const mockTags = [
    { id: 1, name: 'Tag 1' },
    { id: 2, name: 'Tag 2' },
    { id: 3, name: 'Tag 3' },
  ]

  const mockSelectedTags = [1, 3]
  const mockToggleTags = vi.fn()

  it('should render checkboxes for each tag', () => {
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={mockSelectedTags}
        toggleTags={mockToggleTags}
      />
    )

    mockTags.forEach((tag) => {
      expect(screen.getByLabelText(tag.name)).toBeInTheDocument()
    })
  })

  it('should call toggleTags when a checkbox is clicked', () => {
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={mockSelectedTags}
        toggleTags={mockToggleTags}
      />
    )

    // Click on the checkbox for "Tag 2"
    fireEvent.click(screen.getByLabelText('Tag 2'))

    expect(mockToggleTags).toHaveBeenCalledWith(2)
    expect(mockToggleTags).toHaveBeenCalledTimes(1)

    // Click on the checkbox for "Tag 1"
    fireEvent.click(screen.getByLabelText('Tag 1'))

    expect(mockToggleTags).toHaveBeenCalledWith(1)
    expect(mockToggleTags).toHaveBeenCalledTimes(2)
  })
})
