import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewUser from './NewUser'
import axios from 'axios'
import { vi, describe, test, expect } from 'vitest'

// Mock axios post request
vi.mock('axios')

describe('NewUser Component', () => {
  test('renders form inputs and submit button', () => {
    render(<NewUser />)

    // Check that the form fields are rendered
    expect(screen.getByLabelText(/Käyttäjätunnus:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Etunimi:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Sukunimi:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Salasana:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Rooli:/)).toBeInTheDocument()

    // Check that the submit button is rendered
    expect(screen.getByText(/Tallenna/)).toBeInTheDocument()
  })

  test('updates form state on input change', () => {
    render(<NewUser />)

    const usernameInput = screen.getByLabelText(/Käyttäjätunnus:/)
    fireEvent.change(usernameInput, { target: { value: 'john_doe' } })

    // Check if the form state is updated
    expect(usernameInput.value).toBe('john_doe')
  })
})
