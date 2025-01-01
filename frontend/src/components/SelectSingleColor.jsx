import React from 'react'

const SingleValue = (props) => {
  const { data } = props

  return (
    <div className="Select-option">
      <span
        className="SelectColorSingleValue"
        style={{ backgroundColor: data.color }}
      >
        {data.label}
      </span>
    </div>
  )
}

export default SingleValue
