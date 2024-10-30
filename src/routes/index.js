import Home from "~/pages/Home";
import HaNoi from "~/pages/HaNoi";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import Search from "~/components/Layout/component/Search";
import HeaderSearch from "~/components/Layout/component/HeaderSearch";
import { HeaderSearchLayout} from "~/components/Layout"
import DetailRoom from "~/pages/DetailRoom";
import {LoginLayout} from "~/components/Layout"
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
    path: "/detail-room",
    component: DetailRoom,
    layout: HeaderSearchLayout
  }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
