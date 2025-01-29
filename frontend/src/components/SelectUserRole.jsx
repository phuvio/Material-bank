import React from 'react'
import userRoles from '../config/userRoles'

const SelectUserRole = ({ formData, handleFormChange }) => {
  return (
    <select
      id="role"
      name="role"
      value={formData.role}
      onChange={handleFormChange}
    >
      {userRoles.map((role) => (
        <option key={role[0]} value={role[0]}>
          {role[1]}
        </option>
      ))}
    </select>
  )
}

export default SelectUserRole
