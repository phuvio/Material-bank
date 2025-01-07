import React from 'react'

const TagFilter = ({ tags, selectedTags, toggleTags }) => {
  const sortedTags = tags.slice().sort((a, b) => (a.name > b.name ? 1 : -1))

  return (
    <div>
      {sortedTags.map((tag) => (
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
