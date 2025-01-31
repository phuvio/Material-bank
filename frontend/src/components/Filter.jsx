import React from 'react'

const Filter = ({ value, handleChange }) => {
  return (
    <>
      <input value={value} onChange={handleChange} name="filter" />
    </>
  )
}

export default Filter
