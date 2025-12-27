/* eslint-disable no-undef */
import React, { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Editor from './TextEditor'

// --- everything inside vi.mock ---
vi.mock('quill', () => {
  const mockOn = vi.fn()
  const mockOff = vi.fn()
  const mockEnable = vi.fn()
  const mockGetText = vi.fn(() => 'mock text')
  const mockGetLength = vi.fn(() => 42)
  const mockGetSelection = vi.fn(() => null)
  const mockRoot = { innerHTML: '<p>Initial</p>' }

  // attach mocks to global so tests can access them
  global.__mockQuill = {
    mockOn,
    mockOff,
    mockEnable,
    mockGetText,
    mockGetLength,
    mockRoot,
  }

  const MockQuill = vi.fn().mockImplementation(() => ({
    root: mockRoot,
    on: mockOn,
    off: mockOff,
    getSelection: mockGetSelection,
    setSelection: vi.fn(),
    enable: mockEnable,
    getText: mockGetText,
    getLength: mockGetLength,
  }))

  return { default: MockQuill }
})

describe('Editor Component', () => {
  it('renders editor div', () => {
    render(<Editor value="<p>Hello</p>" />)
    expect(screen.getByTestId('text-editor')).toBeInTheDocument()
  })

  it('exposes ref API methods', () => {
    const { mockRoot } = global.__mockQuill
    const ref = createRef()
    render(<Editor ref={ref} value="<p>Ref test</p>" />)
    ref.current.setHTML('<p>New HTML</p>')
    expect(mockRoot.innerHTML).toBe('<p>New HTML</p>')
    expect(ref.current.getHTML()).toBe('<p>New HTML</p>')
    expect(ref.current.getText()).toBe('mock text')
    expect(ref.current.getLength()).toBe(42)
  })

  it('enables/disables editor based on readOnly prop', () => {
    const { mockEnable } = global.__mockQuill
    const { rerender } = render(<Editor value="" readOnly={false} />)
    expect(mockEnable).toHaveBeenCalledWith(true)
    rerender(<Editor value="" readOnly={true} />)
    expect(mockEnable).toHaveBeenCalledWith(false)
  })

  it('cleans up event listeners on unmount', () => {
    const { mockOff } = global.__mockQuill
    const { unmount } = render(<Editor value="" />)
    unmount()
    expect(mockOff).toHaveBeenCalledWith('text-change')
  })
})
