import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import NewMaterial from './NewMaterial'
import materialService from '../services/materials'
import { useNavigate } from 'react-router-dom'
import { validateMaterial } from '../utils/materialValidations'
import decodeToken from '../utils/decode'
import { selectTags } from '../utils/selectTags'

// Mocks
vi.mock('../services/materials')
vi.mock('../utils/materialValidations')
vi.mock('../utils/selectTags')
vi.mock('../utils/decode')
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

describe('NewMaterial', () => {
  const showNotification = vi.fn()
  const navigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    decodeToken.mockReturnValue({ user_id: '1' })
    useNavigate.mockReturnValue(navigate)
    materialService.create.mockResolvedValue({})
    validateMaterial.mockResolvedValue({})
    selectTags.mockReturnValue({
      tags: [],
      selectedTags: [],
      toggleTags: vi.fn(),
    })
  })

  it('renders the form correctly', () => {
    render(<NewMaterial showNotification={showNotification} />)
    expect(screen.getByLabelText('Materiaalin nimi:')).toBeInTheDocument()
    expect(screen.getByLabelText('Kuvaus:')).toBeInTheDocument()
    expect(screen.getByLabelText('Onko materiaali linkki:')).toBeInTheDocument()
  })

  it('shows validation errors when form data is invalid', async () => {
    const invalidData = {
      name: '',
      description: '',
      material: null,
    }

    validateMaterial.mockResolvedValue({
      name: 'Name is required',
      description: 'Description is required',
    })

    render(<NewMaterial showNotification={showNotification} />)

    fireEvent.change(screen.getByLabelText('Materiaalin nimi:'), {
      target: { value: invalidData.name },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: invalidData.description },
    })

    const button = screen.getByRole('button', { name: /Tallenna/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })
    expect(showNotification).toHaveBeenCalledWith(
      'Materiaalin luonti epäonnistui',
      'error',
      3000
    )
  })

  it('submits the form successfully and resets fields', async () => {
    const validData = {
      name: 'Test Material',
      description: 'Test Description',
      material: null,
      is_url: false,
    }

    render(<NewMaterial showNotification={showNotification} />)

    fireEvent.change(screen.getByLabelText('Materiaalin nimi:'), {
      target: { value: validData.name },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: validData.description },
    })
    const button = screen.getByRole('button', { name: /Tallenna/i })
    fireEvent.click(button)

    await waitFor(() => expect(materialService.create).toHaveBeenCalled())
    expect(showNotification).toHaveBeenCalledWith(
      'Materiaali lisätty',
      'message',
      2000
    )
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('uploads a file when material is not a URL', async () => {
    const validFile = new File(['dummy content'], 'example.pdf', {
      type: 'application/pdf',
    })

    render(<NewMaterial showNotification={showNotification} />)

    fireEvent.change(screen.getByLabelText('Materiaalin nimi:'), {
      target: { value: 'Test File Material' },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: 'Test File Description' },
    })

    fireEvent.change(screen.getByLabelText('Material'), {
      target: { files: [validFile] },
    })

    const button = screen.getByRole('button', { name: /Tallenna/i })
    fireEvent.click(button)

    await waitFor(() => expect(materialService.create).toHaveBeenCalled())
    expect(showNotification).toHaveBeenCalledWith(
      'Materiaali lisätty',
      'message',
      2000
    )
  })

  it('selects and submits tags', async () => {
    const validData = {
      name: 'Test Material with Tags',
      description: 'Test Description',
      is_url: false,
      material: null,
      material_type: 'application/pdf',
    }

    render(<NewMaterial showNotification={showNotification} />)

    fireEvent.change(screen.getByLabelText('Materiaalin nimi:'), {
      target: { value: validData.name },
    })
    fireEvent.change(screen.getByLabelText('Kuvaus:'), {
      target: { value: validData.description },
    })
    const button = screen.getByRole('button', { name: /Tallenna/i })
    fireEvent.click(button)

    await waitFor(() => expect(materialService.create).toHaveBeenCalled())
  })

  it('calls goBack when "GoBackButton" is clicked', async () => {
    render(<NewMaterial showNotification={showNotification} />)

    fireEvent.click(screen.getByRole('button', { name: /Takaisin/i }))
    expect(navigate).toHaveBeenCalledWith(-1)
  })
})
