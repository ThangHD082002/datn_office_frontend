import Home from "~/pages/Home";
import HaNoi from "~/pages/HaNoi";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import Search from "~/components/Layout/component/Search";
import HeaderSearch from "~/components/Layout/component/HeaderSearch";
import { HeaderSearchLayout } from "~/components/Layout"
import DetailRoom from "~/pages/DetailRoom";
import { LoginLayout } from "~/components/Layout"
import AdminLayout from "~/components/Layout/AdminLayout";
import AdminDashboard from "~/pages/Admin/AdminDashboard";
import CreateContract from "~/pages/Admin/ContractManagement/CreateContract"
import MangeContract from "~/pages/Admin/ContractManagement/MangeContract";
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
  }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
