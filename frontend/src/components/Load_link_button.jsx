import React from 'react'

const LoadLinkButton = ({ url }) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <button onClick={handleClick} title={url}>
      Linkki
    </button>
  )
}

export default LoadLinkButton
