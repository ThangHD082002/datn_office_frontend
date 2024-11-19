import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import styles from "./LoginLayout.module.scss";
import classNames from "classnames/bind";
import Footer from "../component/Footer";

const cx = classNames.bind(styles);
function LoginLayout({ children }) {
  return <div>{children}</div>;
}

export default LoginLayout;
