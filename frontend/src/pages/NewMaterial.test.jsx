import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi, describe, afterEach, test, expect } from 'vitest'
import NewMaterial from './NewMaterial'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    BrowserRouter: actual.BrowserRouter, // Ensure BrowserRouter is included
  }
})

afterEach(() => {
  vi.clearAllMocks() // Clears mocks after each test
})

describe('NewMaterial Component', () => {
  const mockOnMaterialAdded = vi.fn()

  const renderComponent = (props = {}) => {
    render(
      <BrowserRouter>
        <NewMaterial
          loggedInUser={{ user_id: '123' }}
          onMaterialAdded={mockOnMaterialAdded}
          {...props}
        />
      </BrowserRouter>
    )
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders form fields correctly', () => {
    renderComponent()

    expect(screen.getByLabelText(/Materiaalin nimi:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kuvaus:/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Onko materiaali linkki:/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Tallenna/i })
    ).toBeInTheDocument()
  })

  test('allows toggling between URL and file input', () => {
    renderComponent()

    const isUrlCheckbox = screen.getByRole('checkbox', {
      name: /Onko materiaali linkki:/i,
    })
    fireEvent.click(isUrlCheckbox)

    const urlInput = screen.getByRole('textbox', { name: /Linkki:/i })
    expect(urlInput).toBeInTheDocument()

    fireEvent.click(isUrlCheckbox)

    expect(screen.getByLabelText(/Onko materiaali linkki:/i)).not.toBeChecked()
  })
})
