import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import packageService from '../services/packages'
import LoadLinkButton from '../components/Load_link_button'
import LoadMaterialButton from '../components/Load_material_button'
import decodeToken from '../utils/decode'
import GoBackButton from '../components/GoBackButton'

const PackageDetails = ({ showNotification }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pkg, setPackage] = useState(null)
  const [user, setUser] = useState({ userId: null, role: '' })

  useEffect(() => {
    packageService
      .getSingle(id)
      .then((returnedPackage) => {
        const data = returnedPackage
        data.id = id
        setPackage(data)
      })
      .catch((error) => {
        console.error('Error fetching package:', error)
        showNotification('Virhe haettaessa pakettia.', 'error', 3000)
      })
  }, [id, showNotification])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedToken = await decodeToken()
        if (decodedToken) {
          setUser({
            userId: decodedToken.user_id,
            role: decodedToken.role,
          })
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        navigate('/')
      }
    }
    fetchUser()
  }, [])

  const handleDeletePackage = (id) => {
    if (window.confirm('Haluatko varmasti poistaa tämän paketin?')) {
      packageService
        .remove(id)
        .then(() => {
          showNotification('Paketti poistettu onnistuneesti', 'message', 2000)
          navigate('/paketit')
        })
        .catch((error) => {
          console.error('Error deleting package:', error)
          showNotification('Paketin poisto epäonnistui', 'error', 3000)
        })
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (!pkg) {
    return <p>Pakettia ei löytynyt.</p>
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-50">
          <h1>{pkg.name}</h1>
          <p>{pkg.description}</p>
        </div>
        <div className="col-50">
          <h2>Paketin materiaalit</h2>
          {pkg.Materials && pkg.Materials.length > 0 ? (
            <ul>
              {pkg.Materials.map((material) => (
                <li key={material.id}>
                  {material.is_url && <LoadLinkButton url={material.url} />}
                  {!material.is_url && (
                    <LoadMaterialButton material={material} />
                  )}
                  {material.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>Paketissa ei ole materiaaleja.</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="buttongroup">
          <GoBackButton onGoBack={handleGoBack} />
        </div>
      </div>
      <div className="row">
        {(user.role === 'admin' || user.role === 'moderator') && (
          <>
            <div className="row">
              <Link to={`/muokkaapakettia/${pkg.id}`}>Muokkaa pakettia</Link>
            </div>
            <b></b>
            <div className="row">
              <button
                className="deleteButton"
                onClick={() => handleDeletePackage(pkg.id)}
              >
                Poista paketti
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PackageDetails
