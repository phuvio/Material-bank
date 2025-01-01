import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ColorPicker from '../components/ColorPicker'
import COLORS from '../config/colors'

describe('ColorPicker Component', () => {
  it('renders all colors', () => {
    render(<ColorPicker selectedColor="" onColorChange={vi.fn()} />)

    // Verify that all colors are rendered
    const colorBoxes = screen.getAllByRole('button')
    expect(colorBoxes).toHaveLength(COLORS.length)
  })

  it('calls onColorChange when a color is clicked', () => {
    const mockOnColorChange = vi.fn()
    render(<ColorPicker selectedColor="" onColorChange={mockOnColorChange} />)

    // Click on the first color
    const firstColorBox = screen.getAllByRole('button')[0]
    fireEvent.click(firstColorBox)

    // Verify onColorChange was called with the correct color
    expect(mockOnColorChange).toHaveBeenCalledWith(COLORS[0])
  })

  it('highlights the selected color', () => {
    const selectedColor = COLORS[1]
    render(
      <ColorPicker selectedColor={selectedColor} onColorChange={vi.fn()} />
    )

    // Verify that the selected color box has a black border
    const selectedColorBox = screen.getAllByRole('button')[1] // Second color in the list
    expect(selectedColorBox).toHaveStyle('border: 3px solid black')
  })

  it('displays the selected color below the grid', () => {
    const selectedColor = COLORS[2]
    render(
      <ColorPicker selectedColor={selectedColor} onColorChange={vi.fn()} />
    )

    // Verify that the selected color is displayed correctly
    const selectedColorText = screen.getByText(/Valittu väri:/i)
    expect(selectedColorText).toHaveTextContent(selectedColor)
    expect(selectedColorText.querySelector('span')).toHaveStyle(
      `color: ${selectedColor}`
    )
  })
})
