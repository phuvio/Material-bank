import React from 'react'

const TagFilter = ({ tags, selectedTags, toggleTags }) => {
  return (
    <div>
      {tags.map((tag) => (
        <label key={tag.id}>
          <input
            type="checkbox"
            checked={selectedTags.includes(tag.id)}
            onChange={() => toggleTags(tag.id)}
          />
          {tag.name}
        </label>
      ))}
    </div>
  )
}

export default TagFilter
