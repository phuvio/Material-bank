import React from 'react'
import COLORS from '../config/colors'

const ColorPicker = ({ selectedColor, onColorChange }) => {
  const handleColorClick = (color) => {
    onColorChange(color)
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 40px)',
          gap: '10px',
          justifyContent: 'left',
        }}
      >
        {COLORS.map((color) => (
          <div
            key={color}
            role="button"
            value={selectedColor}
            aria-label={`color-${color}`}
            onClick={() => handleColorClick(color)}
            style={{
              backgroundColor: color,
              width: '40px',
              height: '40px',
              borderRadius: '5px',
              cursor: 'pointer',
              border:
                selectedColor === color ? '3px solid black' : '1px solid #ccc',
            }}
          />
        ))}
      </div>
      {selectedColor && (
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
          Valittu väri:{' '}
          <span style={{ color: selectedColor }}>{selectedColor}</span>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
