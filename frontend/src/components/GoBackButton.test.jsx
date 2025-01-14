import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GoBackButton from './GoBackButton'

describe('GoBackButton', () => {
  it('renders the button with the correct text', () => {
    render(<GoBackButton onGoBack={() => {}} />)
    const button = screen.getByRole('button', { name: /takaisin/i })
    expect(button).toBeInTheDocument()
  })

  it('calls the onGoBack function when clicked', () => {
    const onGoBackMock = vi.fn()
    render(<GoBackButton onGoBack={onGoBackMock} />)
    const button = screen.getByRole('button', { name: /takaisin/i })
    fireEvent.click(button)
    expect(onGoBackMock).toHaveBeenCalledTimes(1)
  })

  it('has the correct class name', () => {
    render(<GoBackButton onGoBack={() => {}} />)
    const button = screen.getByRole('button', { name: /takaisin/i })
    expect(button).toHaveClass('backButton')
  })
})
