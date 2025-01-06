import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import Filter from '../components/Filter'
import TagFilter from '../components/TagFilter'
import { selectTags } from '../utils/selectTags'
import '../styles/tag.css'

const Main_page = ({ materials }) => {
  const [filter, setFilter] = useState('')

  const { tags, selectedTags, toggleTags } = selectTags()

  const materialsToShow = materials.filter((material) => {
    const matchesText =
      filter.length === 0 ||
      material.name.toLowerCase().includes(filter.toLocaleLowerCase())
    const matchesTags =
      selectedTags.length === 0 ||
      (material.tags &&
        selectedTags.some((tagId) => material.tags.includes(tagId)))

    return matchesText && matchesTags
  })

  return (
    <div>
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
      <h1>Materiaalit</h1>
      <ul>
        {materialsToShow.map(
          (material) =>
            material.visible && (
              <li key={material.id}>
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
