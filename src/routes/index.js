import Home from "~/pages/Home";
import HaNoi from "~/pages/HaNoi";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import Search from "~/components/Layout/component/Search";
import { HeaderSearchLayout } from "~/components/Layout"
import DetailRoom from "~/pages/DetailRoom";
import { LoginLayout } from "~/components/Layout"
import AdminLayout from "~/components/Layout/AdminLayout";
import AdminDashboard from "~/pages/Admin/AdminDashboard";
import RequestManagementList from "~/pages/Admin/RequestManagement/List";
import BuildingManagementList from "~/pages/Admin/BuildingManagement/List";
import OfficeManagementList from "~/pages/Admin/OfficeManagement/List";
import CreateContract from "~/pages/Admin/ContractManagement/CreateContract"
import MangeContract from "~/pages/Admin/ContractManagement/MangeContract";
import RequestManagementCreate from "~/pages/Admin/RequestManagement/Create";

const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/hanoi",
    component: HaNoi,
    layout: HeaderSearchLayout
  },
  {
    path: "/login",
    component: Login,
    layout: LoginLayout
  },
  {
    path: "/register",
    component: Register,
    layout: LoginLayout
  },
  {
    path: "/search",
    component: Search,
  },
  {
    path: "/detail-room/:rid",
    component: DetailRoom,
    layout: HeaderSearchLayout
  },
  {
    path: "/admin",
    component: AdminDashboard,
    layout: AdminLayout
  },
  {
    path: "admin/create-contract",
    component: CreateContract,
    layout: AdminLayout
  },
  {
    path: "admin/contracts",
    component: MangeContract,
    layout: AdminLayout
  },
  {
    path: "/admin/buildings",
    component: BuildingManagementList,
    layout: AdminLayout
  },
  {
    path: "/admin/offices",
    component: OfficeManagementList,
    layout: AdminLayout
  },
  {
    path: "/admin/requests",
    component: RequestManagementList,
    layout: AdminLayout
  },
  {
    path: "/admin/create-request",
    component: RequestManagementCreate,
    layout: AdminLayout
  }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
