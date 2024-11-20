import React from 'react'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

global.React = React

afterEach(() => {
  cleanup()
})
