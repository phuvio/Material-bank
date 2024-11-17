import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import Filter from '../components/Filter'

const Main_page = ({ materials }) => {
  const [filter, setFilter] = useState('')

  const materialsToShow =
    filter.length === 0
      ? materials
      : materials.filter((m) =>
          m.name.toLowerCase().includes(filter.toLocaleLowerCase())
        )

  return (
    <div>
      <Filter
        value={filter}
        handleChange={({ target }) => setFilter(target.value)}
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
