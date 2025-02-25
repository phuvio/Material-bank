import Main_page from '../pages/Main_page'
import MaterialDetails from '../pages/MaterialDetails'
import Users from '../pages/Users'
import NewUser from '../pages/NewUser'
import NewMaterial from '../pages/NewMaterial'
import TagAdmin from '../pages/TagAdmin'
import NewTag from '../pages/NewTag'
import EditTag from '../pages/EditTag'
import EditMaterial from '../pages/EditMaterial'
import EditUser from '../pages/EditUser'
import ChangePassword from '../pages/ChangePassword'

const routesConfig = [
  { path: '/', element: 'redirect', to: '/materiaalit' },
  {
    path: '/materiaalit',
    element: Main_page,
    requiredRoles: ['admin', 'moderator', 'basic'],
  },
  {
    path: '/materiaalit/:id',
    element: MaterialDetails,
    requiredRoles: ['admin', 'moderator', 'basic'],
  },
  {
    path: '/uusimateriaali',
    element: NewMaterial,
    requiredRoles: ['admin', 'moderator', 'basic'],
  },
  {
    path: '/muokkaamateriaalia/:id',
    element: EditMaterial,
    requiredRoles: ['admin', 'moderator', 'basic'],
  },
  {
    path: '/vaihdasalasana/:id',
    element: ChangePassword,
    requiredRoles: ['admin', 'moderator', 'basic'],
  },
  { path: '/kayttajat', element: Users, requiredRoles: ['admin'] },
  { path: '/uusikayttaja', element: NewUser, requiredRoles: ['admin'] },
  {
    path: '/muokkaakayttajaa/:id',
    element: EditUser,
    requiredRoles: ['admin'],
  },
  {
    path: '/tagit',
    element: TagAdmin,
    requiredRoles: ['admin', 'moderator'],
  },
  {
    path: '/uusitagi',
    element: NewTag,
    requiredRoles: ['admin', 'moderator'],
  },
  {
    path: '/tagit/:id',
    element: EditTag,
    requiredRoles: ['admin', 'moderator'],
  },
]

export default routesConfig
