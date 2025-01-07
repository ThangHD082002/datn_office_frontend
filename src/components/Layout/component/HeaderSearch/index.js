import styles from "./HeaderSearch.module.scss";
import classNames from "classnames/bind";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Header from "../Header";
import Search from "../Search";
const cx = classNames.bind(styles);

function HeaderSearch({children}) {
  return (
    <div className={cx("container")}>
      <Header />
      <h3 className={cx("title-main")}></h3>
      <div className={cx("header-search-title")}>
        <span className={cx("title-content")}></span>
        <span className={cx("title-content")}></span>
      </div>
      <Search />
      <div className={cx("test")}>{children}</div>
    </div>
  );
}

export default HeaderSearch;
