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
        setTags(returnedTags)
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
    <div>
      <h2>Etsi tageista</h2>
      <Filter
        value={filter}
        handleChange={({ target }) => setFilter(target.value)}
      />
      <h1>Tagit</h1>
      <ul>
        {tagsToShow.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
      <p>
        <Link to={'/newtag'}>Luo uusi tagi</Link>
      </p>
    </div>
  )
}

export default TagAdmin
