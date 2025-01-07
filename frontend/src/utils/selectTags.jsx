import { useState, useEffect, useCallback } from 'react'
import tagService from '../services/tags'

export const selectTags = () => {
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    tagService.getAll().then((returnedTags) => {
      setTags(returnedTags.slice().sort((a, b) => (a.name > b.name ? 1 : -1)))
    })
  }, [])

  const toggleTags = useCallback((tagId) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagId)
        ? prevSelected.filter((id) => id !== tagId)
        : [...prevSelected, tagId]
    )
  }, [])

  return { tags, selectedTags, setSelectedTags, toggleTags }
}

export default selectTags
