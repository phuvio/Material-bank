import { render, screen } from '@testing-library/react'
import { vi, describe, test, expect } from 'vitest'
import Filter from './Filter'

describe('Filter Component', () => {
  const handleChange = vi.fn() // Mock handleChange function
  const value = 'test value' // Initial value for the input field

  test('renders the Filter component with the correct initial value', () => {
    // Render the component with the value prop
    render(<Filter value={value} handleChange={handleChange} />)

    // Check if the input is rendered with the correct value
    const input = screen.getByRole('textbox') // Get input field by its role
    expect(input).toHaveValue(value) // Ensure the input field has the correct value
  })
})
