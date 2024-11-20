import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Main_page from './Main_page'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import Filter from '../components/Filter'

// Mock components for isolated testing
vi.mock('../components/Load_link_button', () => ({
  default: ({ url }) => (
    <button data-testid="load-link-button">Load {url}</button>
  ),
}))

vi.mock('../components/Load_material_button', () => ({
  default: ({ material }) => (
    <button data-testid="load-material-button">Load {material.name}</button>
  ),
}))

vi.mock('../components/Filter', () => ({
  default: ({ value, handleChange }) => (
    <input
      data-testid="filter-input"
      value={value}
      onChange={handleChange}
      placeholder="Filter materials"
    />
  ),
}))

describe('Main_page Component', () => {
  const mockMaterials = [
    {
      id: 1,
      name: 'Material 1',
      visible: true,
      is_url: true,
      url: 'http://example.com',
    },
    { id: 2, name: 'Material 2', visible: true, is_url: false },
    { id: 3, name: 'Hidden Material', visible: false, is_url: false },
  ]

  it('renders the filter input and materials list', () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    // Check Filter input
    expect(screen.getByTestId('filter-input')).toBeInTheDocument()

    // Check visible materials
    expect(screen.getByText('Material 1')).toBeInTheDocument()
    expect(screen.getByText('Material 2')).toBeInTheDocument()
    expect(screen.queryByText('Hidden Material')).not.toBeInTheDocument()
  })

  it('renders the correct buttons for materials', () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    // Check LoadLinkButton for URL material
    expect(screen.getByTestId('load-link-button')).toHaveTextContent(
      'Load http://example.com'
    )

    // Check LoadMaterialButton for non-URL material
    expect(screen.getByTestId('load-material-button')).toHaveTextContent(
      'Load Material 2'
    )
  })

  it('filters materials based on the input value', () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    const filterInput = screen.getByTestId('filter-input')
    fireEvent.change(filterInput, { target: { value: 'Material 2' } })

    // Check only filtered material is displayed
    expect(screen.queryByText('Material 1')).not.toBeInTheDocument()
    expect(screen.getByText('Material 2')).toBeInTheDocument()
  })

  it('provides a link to create a new material', () => {
    render(
      <BrowserRouter>
        <Main_page materials={mockMaterials} />
      </BrowserRouter>
    )

    const newMaterialLink = screen.getByText('Luo uusi materiaali')
    expect(newMaterialLink).toHaveAttribute('href', '/newmaterial')
  })
})
