import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import packageService from '../services/packages'
import Filter from '../components/Filter'

const Packages = ({ showNotification }) => {
  const [filter, setFilter] = useState('')
  const [packages, setPackages] = useState([])
  const [packagesLoading, setPackagesLoading] = useState(false)

  const packagesToShow = packages.filter((pkg) => {
    const matchesText =
      filter.length === 0 ||
      pkg.name.toLowerCase().includes(filter.toLocaleLowerCase())
    return matchesText
  })

  useEffect(() => {
    const fetchPackages = async () => {
      setPackagesLoading(true)
      try {
        const initialPackages = await packageService.getAll()
        const sortedPackages = initialPackages.sort((a, b) =>
          a.name > b.name ? 1 : -1
        )
        setPackages(sortedPackages)
      } catch (error) {
        console.error('Error fetching data:', error)
        showNotification('Virhe haettaessa paketteja.', 'error', 3000)
      } finally {
        setPackagesLoading(false)
      }
    }
    fetchPackages()
  }, [])

  return (
    <div className="container">
      <div className="column left">
        <div className="filter">
          <h2>Etsi paketeista</h2>
          <Filter
            value={filter}
            handleChange={({ target }) => setFilter(target.value)}
          />
        </div>
      </div>
      <div className="column right">
        <h1>Paketit</h1>
        {packagesLoading ? (
          <p>Ladataan paketteja...</p>
        ) : (
          <ul>
            {packagesToShow.map((pkg) => (
              <li key={pkg.id}>
                <Link to={`/packages/${pkg.id}`}>{pkg.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Packages
