import React from 'react'

const TagFilter = ({ tags, selectedTags, toggleTags }) => {
  const sortedTags = tags.slice().sort((a, b) => (a.name > b.name ? 1 : -1))

  return (
    <div className="taglist-parent-container">
      <div className="taglist-container">
        {sortedTags.map((tag) => (
          <div className="taglist" key={tag.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => toggleTags(tag.id)}
              />
              <span className="tag" style={{ backgroundColor: tag.color }}>
                {tag.name}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TagFilter
