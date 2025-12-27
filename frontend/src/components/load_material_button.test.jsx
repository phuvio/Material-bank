import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, test, expect } from 'vitest'
import LoadMaterialButton, {
  getFileExtensionFromContentType,
} from './Load_material_button'
import api from '../services/api'

// Mock the api module
vi.mock('../services/api')

describe('LoadMaterialButton Component', () => {
  const material = { id: '123', name: 'test-material' }

  test('handles file download successfully with correct file extension', async () => {
    // Mock the API response
    const mockResponse = {
      data: new Blob([new ArrayBuffer(1)]), // Mock a non-empty file
      headers: { 'content-type': 'application/pdf' }, // PDF content type
    }
    api.get.mockResolvedValue(mockResponse)

    // Spy on the console to check logs
    const logSpy = vi.spyOn(console, 'log')

    // Render the component
    render(<LoadMaterialButton material={material} />)

    // Simulate a button click
    fireEvent.click(screen.getByText(/Tiedosto/))

    // Wait for the file handling code to run
    await waitFor(() => {
      expect(logSpy).not.toHaveBeenCalledWith('No file data returned')
    })

    // Check that the browser interaction (file download) occurred
    expect(api.get).toHaveBeenCalledWith(
      `/api/materials/${material.id}/material`,
      {
        responseType: 'blob',
      }
    )
  })

  test('handles empty file data gracefully', async () => {
    // Mock API response with no file data
    const mockEmptyResponse = {
      data: new Blob([]),
      headers: { 'content-type': 'application/octet-stream' },
    }
    api.get.mockResolvedValue(mockEmptyResponse)

    // Spy on the console to check logs
    const logSpy = vi.spyOn(console, 'warn')

    // Render the component
    render(<LoadMaterialButton material={material} />)

    // Simulate a button click
    fireEvent.click(screen.getByText(/Tiedosto/))

    // Wait for the file handling code to run
    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('No file data returned')
    })
  })

  test('handles error gracefully if API request fails', async () => {
    // Mock API to throw an error
    api.get.mockRejectedValue(new Error('Network error'))

    // Spy on the console to check logs
    const logSpy = vi.spyOn(console, 'error')

    // Render the component
    render(<LoadMaterialButton material={material} />)

    // Simulate a button click
    fireEvent.click(screen.getByText(/Tiedosto/))

    // Wait for the error handling code to run
    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(
        'Error opening file',
        expect.any(Error)
      )
    })
  })

  test('correctly determines file extension based on content-type', () => {
    // Test the getFileExtensionFromContentType function
    expect(getFileExtensionFromContentType('application/pdf')).toBe('.pdf')
    expect(
      getFileExtensionFromContentType(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ).toBe('.docx')
    expect(getFileExtensionFromContentType('image/jpeg')).toBe('.jpg')
    expect(getFileExtensionFromContentType('application/octet-stream')).toBe(
      '.bin'
    ) // Default fallback
  })
})
