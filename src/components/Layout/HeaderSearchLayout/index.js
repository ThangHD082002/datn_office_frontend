import styles from "./HeaderSearchLayout.module.scss";
import classNames from "classnames/bind";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import HeaderSearch from "../component/HeaderSearch";
import Footer from "../component/Footer";
const cx = classNames.bind(styles);

function HeaderSearchLayout({children}) {
  return (
    <div className={cx("container")}>
      <div>
      <HeaderSearch />
      </div>
      <div className={cx("test")}>{children}</div>
     <div>
     <Footer />
     </div>
    </div>
  );
}

export default HeaderSearchLayout;
