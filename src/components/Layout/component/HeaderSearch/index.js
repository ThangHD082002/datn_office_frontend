import styles from "./HeaderSearch.module.scss";
import classNames from "classnames/bind";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Header from "../Header";
import Search from "../Search";
const cx = classNames.bind(styles);

function HeaderSearch() {
  return (
    <div className={cx("container")}>
      <Header />
      <h3 className={cx("title-main")}>CHO CHO THUÊ VĂN PHÒNG HÀ NỘI</h3>
      <div className={cx("header-search-title")}>
        <span className={cx("title-content")}>Trang chủ</span>
        <div className={cx("vertical")}></div>
        <span className={cx("title-content")}>Hà Nội</span>
      </div>

      <Search />
      <div className={cx("test")}></div>
    </div>
  );
}

export default HeaderSearch;
