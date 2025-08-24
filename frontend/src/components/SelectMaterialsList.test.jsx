import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SelectedMaterialsList from './SelectMaterialsList'

let mockOnDragEnd

vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core')
  return {
    ...actual,
    DndContext: ({ children, onDragEnd }) => {
      mockOnDragEnd = onDragEnd
      return <div data-testid="dnd-context">{children}</div>
    },
  }
})

describe('SelectedMaterialsList', () => {
  const mockMaterials = [
    { id: '1', name: 'Material A' },
    { id: '2', name: 'Material B' },
    { id: '3', name: 'Material C' },
  ]

  beforeEach(() => {
    mockOnDragEnd = undefined
  })

  it('renders selected materials', () => {
    render(
      <SelectedMaterialsList
        selectedMaterials={mockMaterials}
        setSelectedMaterials={vi.fn()}
      />
    )

    // Check that all materials are rendered
    expect(screen.getByText('Material A')).toBeInTheDocument()
    expect(screen.getByText('Material B')).toBeInTheDocument()
    expect(screen.getByText('Material C')).toBeInTheDocument()
  })

  it('reorders materials on drag end', () => {
    const setSelectedMaterials = vi.fn()

    render(
      <SelectedMaterialsList
        selectedMaterials={mockMaterials}
        setSelectedMaterials={setSelectedMaterials}
      />
    )

    expect(typeof mockOnDragEnd).toBe('function')

    mockOnDragEnd({
      active: { id: '1' },
      over: { id: '2' },
    })

    expect(setSelectedMaterials).toHaveBeenCalledWith([
      { id: '2', name: 'Material B' },
      { id: '1', name: 'Material A' },
      { id: '3', name: 'Material C' },
    ])
  })

  it('does nothing if dropped outside', () => {
    const setSelectedMaterials = vi.fn()

    render(
      <SelectedMaterialsList
        selectedMaterials={mockMaterials}
        setSelectedMaterials={setSelectedMaterials}
      />
    )

    const dndContext = screen.getByTestId('dnd-context')
    fireEvent.dragEnd(dndContext, {
      active: { id: '1' },
      over: null, // dropped outside
    })

    expect(setSelectedMaterials).not.toHaveBeenCalled()
  })

  it('does nothing if dropped on itself', () => {
    const setSelectedMaterials = vi.fn()

    render(
      <SelectedMaterialsList
        selectedMaterials={mockMaterials}
        setSelectedMaterials={setSelectedMaterials}
      />
    )

    const dndContext = screen.getByTestId('dnd-context')
    fireEvent.dragEnd(dndContext, {
      active: { id: '1' },
      over: { id: '1' }, // dropped on itself
    })

    expect(setSelectedMaterials).not.toHaveBeenCalled()
  })
})
