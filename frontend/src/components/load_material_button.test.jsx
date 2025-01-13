import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import LoadMaterialButton from './Load_material_button'
import axios from 'axios'

vi.mock('axios') // Mock axios globally

beforeEach(() => {
  vi.resetAllMocks()
})

describe('LoadMaterialButton Component', () => {
  const material = { id: '123', name: 'test-material' }

  test('handles empty file data gracefully', async () => {
    // Mock axios GET request to return an empty response (no file)
    const mockEmptyResponse = {
      data: new Blob([]),
      headers: { 'content-type': 'application/octet-stream' },
    }
    axios.get.mockResolvedValue(mockEmptyResponse)

    // Spy on console.log to check for the expected log message
    const logSpy = vi.spyOn(console, 'log')

    // Render the component
    render(<LoadMaterialButton material={material} />)

    // Simulate button click
    fireEvent.click(screen.getByText(/Lataa tiedosto/))

    // Wait for any async operations to complete
    await screen.findByText(/Lataa tiedosto/)

    // Check if the appropriate log message is shown when no file is returned
    expect(logSpy).toHaveBeenCalledWith('No file data returned')
  })

  test('handles error gracefully if axios request fails', async () => {
    // Mock axios GET request to throw an error
    axios.get.mockRejectedValue(new Error('Network error'))

    // Spy on console.log to check for the expected log message
    const logSpy = vi.spyOn(console, 'log')

    // Render the component
    render(<LoadMaterialButton material={material} />)

    // Simulate button click
    fireEvent.click(screen.getByText(/Lataa tiedosto/))

    // Wait for any async operations to complete
    await screen.findByText(/Lataa tiedosto/)

    // Check if the appropriate error message is logged
    expect(logSpy).toHaveBeenCalledWith('Error opening file', expect.any(Error))
  })

  test('correctly handles content-type and appends file extension', async () => {
    // Mock axios GET request to return a file with a known content-type
    const mockResponse = {
      data: new Blob(['test'], { type: 'application/pdf' }),
      headers: { 'content-type': 'application/pdf' },
    }
    axios.get.mockResolvedValue(mockResponse)

    // Spy on console.log to check for the filename and logs
    const logSpy = vi.spyOn(console, 'log')

    // Render the component
    render(<LoadMaterialButton material={material} />)

    // Simulate button click
    fireEvent.click(screen.getByText(/Lataa tiedosto/))

    // Wait for any async operations to complete
    await screen.findByText(/Lataa tiedosto/)

    // Check if the correct file extension is appended
    expect(logSpy).toHaveBeenCalledWith('filename', 'test-material.pdf')
  })
})
