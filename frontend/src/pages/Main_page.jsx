import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import favoriteService from '../services/favorites'
import materialService from '../services/materials'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import Filter from '../components/Filter'
import TagFilter from '../components/TagFilter'
import { selectTags } from '../utils/selectTags'
import decodeToken from '../utils/decode'

const Main_page = ({ showNotification }) => {
  const [filter, setFilter] = useState('')
  const [materials, setMaterials] = useState([])
  const [favorites, setFavorites] = useState([])
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [favoritesLoading, setFavoritesLoading] = useState(false)

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

  useEffect(() => {
    const fetchMaterials = async () => {
      setMaterialsLoading(true)
      try {
        const initialMaterials = await materialService.getAll()
        const sortedMaterials = initialMaterials.sort((a, b) =>
          a.name.toLowerCase > b.name.toLowerCase ? 1 : -1
        )
        setMaterials(sortedMaterials)
      } catch (error) {
        console.error('Error fetching data:', error)
        showNotification('Virhe haettaessa materiaaleja.', 'error', 3000)
      } finally {
        setMaterialsLoading(false)
      }
    }
    fetchMaterials()
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      setFavoritesLoading(true)
      try {
        const decoded = await decodeToken()

        if (!decoded?.user_id) {
          throw new Error('User ID not found in token')
        }

        const favorites = await favoriteService.get(decoded.user_id)
        const sortedFavorites = Array.isArray(favorites)
          ? favorites.sort((a, b) =>
              a.name.toLowerCase > b.name.toLowerCase ? 1 : -1
            )
          : []

        setFavorites(sortedFavorites)
      } catch (error) {
        console.error('Error fetching favorites:', error)
        showNotification('Virhe haettaessa suosikkeja', 'error', 3000)
      } finally {
        setFavoritesLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const handleFavorites = async (materialId) => {
    try {
      const decoded = await decodeToken()
      if (!decoded?.user_id) {
        throw new Error('User ID not found in token')
      }

      const isAlreadyFavorite = isFavorite(materialId)

      if (isAlreadyFavorite) {
        await favoriteService.remove(decoded.user_id, materialId)
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== materialId)
        )
      } else {
        const newFavorite = await favoriteService.create(
          decoded.user_id,
          materialId
        )
        setFavorites((prevFavorites) => [...prevFavorites, newFavorite])
      }
    } catch (error) {
      console.error('Error handling favorites:', error)
      showNotification('Virhe suosikin käsittelyssä', 'error', 3000)
    }
  }

  const isFavorite = (materialId) =>
    favorites.some((favorite) => favorite.id === materialId)

  return (
    <div className="container">
      <div className="column left">
        <div className="filter">
          <h2>Etsi materaaleista</h2>
          <Filter
            value={filter}
            handleChange={({ target }) => setFilter(target.value)}
          />
          <TagFilter
            tags={tags}
            selectedTags={selectedTags}
            toggleTags={toggleTags}
          />
        </div>
        <p>
          <Link to={'/uusimateriaali'}>Luo uusi materiaali</Link>
        </p>
        <div className="favorites">
          <h2>Omat suosikit</h2>
          {favoritesLoading ? (
            <p>Ladataan suosikkeja...</p>
          ) : favorites.length === 0 ? (
            <div>
              Voit lisätä omia suosikkeja klikkaamalla materiaalin vasemmalla
              puolella olevaa kuvaketta.
            </div>
          ) : (
            favorites.map((favorite) => (
              <li key={favorite.name}>
                <button
                  className={`favoriteButton ${isFavorite(favorite.id) ? 'selected' : ''}`}
                  onClick={() => handleFavorites(favorite.id)}
                ></button>
                {favorite.is_url && <LoadLinkButton url={favorite.url} />}
                {!favorite.is_url && <LoadMaterialButton material={favorite} />}
                {favorite.name}
              </li>
            ))
          )}
        </div>
      </div>
      <div className="column right">
        <h1>Materiaalit</h1>
        {materialsLoading ? (
          <p>Ladataan materiaaleja...</p>
        ) : (
          <ul>
            {materialsToShow.map(
              (material) =>
                material.visible && (
                  <li key={material.id}>
                    <button
                      className={`favoriteButton ${isFavorite(material.id) ? 'selected' : ''}`}
                      onClick={() => handleFavorites(material.id)}
                    ></button>
                    {material.is_url && <LoadLinkButton url={material.url} />}
                    {!material.is_url && (
                      <LoadMaterialButton material={material} />
                    )}
                    <Link to={`/materiaalit/${material.id}`}>
                      {material.name}
                    </Link>
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
        )}
      </div>
    </div>
  )
}

export default Main_page
