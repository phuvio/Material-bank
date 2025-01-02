import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import Filter from '../components/Filter'
import TagFilter from '../components/TagFilter'
import tagService from '../services/tags'

const Main_page = ({ materials }) => {
  const [filter, setFilter] = useState('')
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

  const materialsToShow = materials.filter((material) => {
    console.log(tags)
    console.log(materials)
    console.log(selectedTags)
    const matchesText =
      filter.length === 0 ||
      materials.name.toLowerCase().includes(filter.toLocaleLowerCase())
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tagId) => material.tags.includes(tagId))

    return matchesText && matchesTags
  })

  return (
    <div>
      <h2>Etsi materaaleista</h2>
      <Filter
        value={filter}
        handleChange={({ target }) => setFilter(target.value)}
      />
      <h2>Tagit</h2>
      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        toggleTags={toggleTags}
      />
      <h1>Materiaalit</h1>
      <ul>
        {materialsToShow.map(
          (material) =>
            material.visible && (
              <li key={material.id}>
                <Link to={`/materials/${material.id}`}>{material.name}</Link>
                {material.is_url && <LoadLinkButton url={material.url} />}
                {!material.is_url && <LoadMaterialButton material={material} />}
              </li>
            )
        )}
      </ul>
      <p>
        <Link to={'/newmaterial'}>Luo uusi materiaali</Link>
      </p>
    </div>
  )
}

export default Main_page
