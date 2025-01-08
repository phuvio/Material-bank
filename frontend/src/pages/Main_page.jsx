import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import Filter from '../components/Filter'
import TagFilter from '../components/TagFilter'
import { selectTags } from '../utils/selectTags'
import '../styles/styles.css'

const Main_page = ({ materials }) => {
  const [filter, setFilter] = useState('')

  const { tags, selectedTags, toggleTags } = selectTags()

  const materialsToShow = materials.filter((material) => {
    const tagsIds = material.Tags ? material.Tags.map((tag) => tag.id) : []
    const matchesText =
      filter.length === 0 ||
      material.name.toLowerCase().includes(filter.toLocaleLowerCase())
    const matchesTags =
      selectedTags.length === 0 ||
      (tagsIds && selectedTags.every((tagId) => tagsIds.includes(tagId)))

    return matchesText && matchesTags
  })

  return (
    <div className="container">
      <div className="column left">
        <div className="filter">
          <h2>Etsi materaaleista</h2>
          <Filter
            value={filter}
            handleChange={({ target }) => setFilter(target.value)}
          />
          <br></br>
          <TagFilter
            tags={tags}
            selectedTags={selectedTags}
            toggleTags={toggleTags}
          />
        </div>
        <p>
          <Link to={'/newmaterial'}>Luo uusi materiaali</Link>
        </p>
      </div>
      <div className="column right">
        <h1>Materiaalit</h1>
        <ul>
          {materialsToShow.map(
            (material) =>
              material.visible && (
                <li key={material.id}>
                  {material.is_url && <LoadLinkButton url={material.url} />}
                  {!material.is_url && (
                    <LoadMaterialButton material={material} />
                  )}
                  <Link to={`/materials/${material.id}`}>{material.name}</Link>
                  {material.Tags &&
                    material.Tags.slice()
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((tag) => (
                        <span
                          key={tag.id}
                          className="tag"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  )
}

export default Main_page
