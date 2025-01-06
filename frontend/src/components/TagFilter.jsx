import React, { useMemo } from 'react'

const TagFilter = ({ tags, selectedTags, toggleTags }) => {
  const sortedTags = useMemo(() => {
    return tags.slice().sort((a, b) => (a.name > b.name ? 1 : -1))
  }, [tags])

  const selectedTagsIds = selectedTags.map((tag) => tag.id)

  return (
    <div>
      {sortedTags.map((tag) => (
        <label key={tag.id}>
          <input
            type="checkbox"
            checked={selectedTagsIds.includes(tag.id)}
            onChange={() => toggleTags(tag.id)}
          />
          {tag.name}
        </label>
      ))}
    </div>
  )
}

export default TagFilter
