import React from 'react'

const GoBackButton = ({ onGoBack }) => (
  <button type="button" className="backButton" onClick={onGoBack}>
    Takaisin
  </button>
)

export default GoBackButton
