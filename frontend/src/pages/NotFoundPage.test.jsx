import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import NotFoundPage from './NotFoundPage'

describe('NotFoundPage Component', () => {
  it('renders the not found message', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Sivua ei löydy')).toBeInTheDocument()
    expect(screen.getByText('Tätä sivua ei löydy.')).toBeInTheDocument()
  })

  it('contains a link to the materials page', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: 'Palaa materiaalit sivulle' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/materiaalit')
  })
})
