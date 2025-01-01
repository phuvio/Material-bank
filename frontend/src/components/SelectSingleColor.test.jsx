// SingleValue.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import SingleValue from './SelectSingleColor'

// Mock props for testing
const mockData = {
  color: '#ff0000',
  label: 'Red',
}

describe('SingleValue Component', () => {
  test('renders the correct label', () => {
    render(<SingleValue data={mockData} />)

    const labelElement = screen.getByText(mockData.label)
    expect(labelElement).toBeInTheDocument()
  })

  test('applies the correct background color', () => {
    render(<SingleValue data={mockData} />)

    const colorSpan = screen.getByText(mockData.label)
    expect(colorSpan).toHaveStyle(`background-color: ${mockData.color}`)
  })
})
