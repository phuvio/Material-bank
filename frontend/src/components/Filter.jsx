const Filter = ({ value, handleChange }) => {
  return (
    <>
      Etsi materiaaleista
      <input value={value} onChange={handleChange} />
    </>
  )
}

export default Filter
