import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, test, expect } from 'vitest'
import LoadLinkButton from './Load_link_button'

describe('LoadLinkButton Component', () => {
  const url = 'https://example.com'

  // Mock window.open globally
  vi.spyOn(window, 'open').mockImplementation(vi.fn())

  test('renders the button with the correct title', () => {
    // Render the component
    render(<LoadLinkButton url={url} />)

    // Check if the button is rendered and has the correct title
    const button = screen.getByText('Linkki')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('title', url)
  })

  test('opens the link in a new tab when clicked', () => {
    // Render the component
    render(<LoadLinkButton url={url} />)

    // Simulate button click
    fireEvent.click(screen.getByText('Linkki'))

    // Check if window.open was called with the correct URL and parameters
    expect(window.open).toHaveBeenCalledWith(
      url,
      '_blank',
      'noopener,noreferrer'
    )
  })
})
