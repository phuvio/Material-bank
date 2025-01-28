import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import tagService from '../services/tags'
import Filter from '../components/Filter'

const TagAdmin = () => {
  const [tags, setTags] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let isMounted = true

    tagService
      .getAll()
      .then((returnedTags) => {
        const sortedTags = returnedTags.sort((a, b) =>
          a.name.localeCompare(b.name)
        )
        setTags(sortedTags)
      })
      .catch((error) => {
        if (isMounted) {
          console.log('Error fetching data:', error)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const tagsToShow =
    filter.length === 0
      ? tags
      : tags.filter((t) =>
          t.name.toLowerCase().includes(filter.toLocaleLowerCase())
        )

  return (
    <div className="container">
      <div className="column left">
        <h2>Etsi tageista</h2>
        <Filter
          value={filter}
          handleChange={({ target }) => setFilter(target.value)}
        />
        <p>
          <Link to={'/uusitagi'}>Luo uusi tagi</Link>
        </p>
      </div>
      <div className="column right">
        <h1>Tagit</h1>
        <ul>
          {tagsToShow.map((tag) => (
            <li key={tag.id}>
              <Link to={`/tagit/${tag.id}`}>{tag.name}</Link>
              <span className="tag" style={{ backgroundColor: tag.color }}>
                {tag.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TagAdmin
