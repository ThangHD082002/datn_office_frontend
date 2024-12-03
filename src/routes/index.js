import Home from '~/pages/Home'
import HaNoi from '~/pages/HaNoi'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import Search from '~/components/Layout/component/Search'
import { HeaderSearchLayout } from '~/components/Layout'
import DetailRoom from '~/pages/DetailRoom'
import { LoginLayout } from '~/components/Layout'
import AdminLayout from '~/components/Layout/AdminLayout'
import AdminDashboard from '~/pages/Admin/AdminDashboard'
import RequestManagementList from '~/pages/Admin/RequestManagement/List'
import BuildingManagementList from '~/pages/Admin/BuildingManagement/List'
import OfficeManagementList from '~/pages/Admin/OfficeManagement/List'
import CreateContract from '~/pages/Admin/ContractManagement/CreateContract'
import ManageContract from '~/pages/Admin/ContractManagement/ManageContract'
import RequestManagementCreate from '~/pages/Admin/RequestManagement/Create'
import ErrorToken from '~/pages/ErrorToken'
import UserManagementList from '~/pages/Admin/UserManagement/List'
import UserManagementCreate from '~/pages/Admin/UserManagement/Create'
import UserManagementDetail from '~/pages/Admin/UserManagement/Detail'
import AssignBuilding from '~/pages/Admin/UserManagement/AssignBuilding'
import PreviewContract from '~/pages/Admin/ContractManagement/PreviewContract'
import BuildingManagementCreate from '~/pages/Admin/BuildingManagement/Create'
import BuildingManagementDetail from '~/pages/Admin/BuildingManagement/Detail'
import UserContract from '~/pages/UserContract'
import UserPreviewContract from '~/pages/UserPreviewContract'
import BuildingManagementEdit from '~/pages/Admin/BuildingManagement/Edit'
import OfficeManagementDetail from '~/pages/Admin/OfficeManagement/Detail'
import OfficeManagementCreate from '~/pages/Admin/OfficeManagement/Create'
import RequestManagementDetail from '~/pages/Admin/RequestManagement/Detail'

const publicRoutes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/hanoi',
    component: HaNoi,
    layout: HeaderSearchLayout
  },
  {
    path: '/login',
    component: Login,
    layout: LoginLayout
  },
  {
    path: '/register',
    component: Register,
    layout: LoginLayout
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/detail-room/:rid',
    component: DetailRoom,
    layout: HeaderSearchLayout
  },
  {
    path: '/user-contract',
    component: UserContract,
    layout: HeaderSearchLayout
  },
  {
    path: '/user/preview-contract/:pid',
    component: UserPreviewContract,
    layout: HeaderSearchLayout
  },
  {
    path: '/admin',
    component: AdminDashboard,
    layout: AdminLayout
  },
  {
    path: 'admin/create-contract/:cid',
    component: CreateContract,
    layout: AdminLayout
  },
  {
    path: 'admin/contracts',
    component: ManageContract,
    layout: AdminLayout
  },
  {
    path: '/admin/buildings',
    component: BuildingManagementList,
    layout: AdminLayout
  },
  {
    path: '/admin/create-building',
    component: BuildingManagementCreate,
    layout: AdminLayout
  },
  {
    path: '/admin/edit-buildings/:bid',
    component: BuildingManagementEdit,
    layout: AdminLayout
  },
  {
    path: '/admin/buildings/:bid',
    component: BuildingManagementDetail,
    layout: AdminLayout
  },
  {
    path: '/admin/offices',
    component: OfficeManagementList,
    layout: AdminLayout
  },
  {
    path: '/admin/offices/:oid',
    component: OfficeManagementDetail,
    layout: AdminLayout
  },
  {
    path: '/admin/create-office',
    component: OfficeManagementCreate,
    layout: AdminLayout
  },
  {
    path: '/admin/users',
    component: UserManagementList,
    layout: AdminLayout
  },
  {
    path: '/admin/create-managers',
    component: UserManagementCreate,
    layout: AdminLayout
  },
  {
    path: '/admin/users/:uid',
    component: UserManagementDetail,
    layout: AdminLayout
  },
  {
    path: '/admin/assign-building',
    component: AssignBuilding,
    layout: AdminLayout
  },
  {
    path: '/admin/requests',
    component: RequestManagementList,
    layout: AdminLayout
  },
  {
    path: '/admin/requests/:rid',
    component: RequestManagementDetail,
    layout: AdminLayout
  },
  {
    path: '/admin/create-request',
    component: RequestManagementCreate,
    layout: AdminLayout
  },
  {
    path: '/error-token',
    component: ErrorToken,
    layout: null
  },
  {
    path: '/admin/preview-contract/:pid',
    component: PreviewContract,
    layout: AdminLayout
  }
]

const privateRoutes = []

export { publicRoutes, privateRoutes }
