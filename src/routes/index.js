import Home from "~/pages/Home";
import HaNoi from "~/pages/HaNoi";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import Search from "~/components/Layout/component/Search";
import HeaderSearch from "~/components/Layout/component/HeaderSearch";
const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/hanoi",
    component: HaNoi,
    layout: HeaderSearch
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/search",
    component: Search,
  }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
