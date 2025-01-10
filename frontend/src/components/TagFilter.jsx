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
          <span
            key={tag.id}
            className="tag"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        </label>
      ))}
    </div>
  )
}

export default TagFilter
