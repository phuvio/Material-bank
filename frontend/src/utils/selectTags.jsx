import { useState, useEffect } from 'react'
import tagService from '../services/tags'

export const selectTags = () => {
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    tagService.getAll().then((returnedTags) => {
      setTags(returnedTags)
    })
  }, [])

  const toggleTags = (tagId) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagId)
        ? prevSelected.filter((id) => id !== tagId)
        : [...prevSelected, tagId]
    )
  }

  return { tags, selectedTags, toggleTags }
}

export default selectTags
